/**
 * OpenPages Agent Orchestra
 *
 * Three-agent pipeline:
 *   Agent 1 (Generator)  → Creates landing page, validates lint + build locally
 *   Agent 2 (Deployer)   → Pushes to GitHub, deploys via Vercel
 *   Agent 3 (Fixer)      → Monitors deployment errors, fixes, re-deploys
 *
 * Usage:
 *   npx tsx -r dotenv/config scripts/orchestrate.ts
 *   npx tsx -r dotenv/config scripts/orchestrate.ts --dry-run
 */

import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";
import path from "path";

const execAsync = promisify(exec);

// ─── Configuration ──────────────────────────────────────────────────
const MAX_LOCAL_FIX_RETRIES = 3;      // retries for local build failures
const MAX_DEPLOY_FIX_RETRIES = 2;     // retries for Vercel deployment failures
const DEPLOY_POLL_INTERVAL_MS = 15_000;
const DEPLOY_POLL_TIMEOUT_MS = 300_000;
const DRY_RUN = process.argv.includes("--dry-run");

const ROOT = process.cwd();

// ─── Helpers ────────────────────────────────────────────────────────

function generateSiteName(): string {
    const adjectives = ["rapid", "swift", "nova", "apex", "zenith", "hyper", "ultra", "lunar", "solar", "neon"];
    const nouns = ["launch", "forge", "wave", "spark", "pulse", "orbit", "flow", "nexus", "core", "grid"];
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const num = Math.floor(Math.random() * 1000);
    return `${adj}-${noun}-${num}`;
}

function getEnvOrThrow(key: string): string {
    const val = process.env[key];
    if (!val) throw new Error(`Missing env var: ${key}`);
    return val;
}

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Parse ===FILE: path=== ... ===END FILE=== blocks from agent output */
function parseFileBlocks(text: string): Map<string, string> {
    const files = new Map<string, string>();
    const re = /===FILE:\s*(.+?)===\n([\s\S]*?)===END FILE===/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
        files.set(m[1].trim(), m[2]);
    }
    return files;
}

/** Write a Map of relative-path → content into a directory */
async function writeFiles(outputDir: string, files: Map<string, string>): Promise<void> {
    for (const [filePath, content] of files) {
        const full = path.join(outputDir, filePath);
        await fs.mkdir(path.dirname(full), { recursive: true });
        await fs.writeFile(full, content);
        console.log(`    ✓ ${filePath}`);
    }
}

/** Recursively read all source files in a directory (skip node_modules, .next) */
async function readSiteFiles(dir: string, prefix = ""): Promise<Record<string, string>> {
    const result: Record<string, string> = {};
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
        if (entry.name === "node_modules" || entry.name === ".next") continue;
        const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
        if (entry.isDirectory()) {
            Object.assign(result, await readSiteFiles(path.join(dir, entry.name), rel));
        } else {
            result[rel] = await fs.readFile(path.join(dir, entry.name), "utf-8");
        }
    }
    return result;
}

// ─── OpenClaw API ───────────────────────────────────────────────────

async function callOpenClaw(agentId: string, prompt: string): Promise<string> {
    const url = getEnvOrThrow("OPENCLAW_GATEWAY_URL");
    const token = getEnvOrThrow("OPENCLAW_GATEWAY_TOKEN");

    const res = await fetch(`${url}/v1/chat/completions`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "x-openclaw-agent-id": agentId,
        },
        body: JSON.stringify({
            model: `openclaw:${agentId}`,
            messages: [{ role: "user", content: prompt }],
            max_tokens: 16000,
            temperature: 0.7,
        }),
    });

    if (!res.ok) {
        throw new Error(`OpenClaw API error (${res.status}): ${await res.text()}`);
    }

    const data = (await res.json()) as any;
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new Error("OpenClaw returned empty content");
    return content;
}

// ═══════════════════════════════════════════════════════════════════
// AGENT 1 — GENERATOR: Create + Lint + Build locally
// ═══════════════════════════════════════════════════════════════════

async function generateSite(siteName: string, outputDir: string): Promise<boolean> {
    console.log(`\n🎨 [Agent 1 · Generator] Creating landing page for "${siteName}"...`);

    const prompt = `Generate a complete Next.js landing page for a SaaS product called "${siteName}".
The site should be a premium, dark-mode landing page with:
- A stunning hero section with gradient text and a call-to-action
- A features section with at least 6 feature cards
- A pricing section with 3 tiers
- A testimonials section
- A footer
- Smooth CSS animations and hover effects
- Fully responsive design

CRITICAL RULES:
- Use ONLY vanilla CSS in globals.css. Do NOT use @tailwind directives or any Tailwind CSS.
- Do NOT include tailwindcss, @tailwindcss/postcss, postcss, or autoprefixer as dependencies.
- Do NOT create postcss.config.js, postcss.config.mjs, or tailwind.config files.
- Only create ONE next.config file (next.config.ts), never next.config.mjs or next.config.js.
- Use Next.js 14.x (not 15.x) for maximum compatibility.

Output ALL files using the ===FILE: path=== ... ===END FILE=== format as instructed in your identity.`;

    try {
        const content = await callOpenClaw("openpages", prompt);
        console.log(`    Received ${content.length} characters from OpenClaw.`);

        const files = parseFileBlocks(content);
        if (files.size === 0) {
            console.error("    ✗ Failed to parse files from response.");
            await fs.mkdir(outputDir, { recursive: true });
            await fs.writeFile(path.join(outputDir, "_raw_response.txt"), content);
            return false;
        }

        console.log(`    Parsed ${files.size} files:`);
        await writeFiles(outputDir, files);
        return true;
    } catch (error) {
        console.error("    ✗ Generation failed:", error);
        return false;
    }
}

async function localBuild(siteDir: string): Promise<{ ok: boolean; logs: string }> {
    console.log(`\n🔨 [Agent 1 · Build] Running npm install + build in ${path.basename(siteDir)}...`);

    try {
        const { stdout, stderr } = await execAsync("npm install --legacy-peer-deps && npx next build", {
            cwd: siteDir,
            timeout: 120_000,
            env: { ...process.env, NODE_ENV: "production" },
        });
        const logs = `${stdout}\n${stderr}`;
        console.log("    ✓ Build succeeded.");
        return { ok: true, logs };
    } catch (error: any) {
        const logs = `${error.stdout || ""}\n${error.stderr || ""}\n${error.message || ""}`;
        console.error("    ✗ Build failed.");
        return { ok: false, logs };
    }
}

async function fixLocalBuild(
    siteName: string,
    siteDir: string,
    buildLogs: string
): Promise<boolean> {
    console.log(`\n🔧 [Agent 1 · Fixer] Fixing local build errors...`);

    // Step 1: Ask deployer agent to analyze
    console.log("    Asking deployer agent to analyze error...");
    const analysis = await callOpenClaw(
        "openpages-deployer",
        `Analyze this local build error for a Next.js site called "${siteName}":\n\n${buildLogs.slice(-3000)}`
    );
    console.log(`    Analysis: ${analysis.slice(0, 300)}...`);

    // Step 2: Read current files
    const currentFiles = await readSiteFiles(siteDir);
    const fileList = Object.entries(currentFiles)
        .map(([name, content]) => `===FILE: ${name}===\n${content}\n===END FILE===`)
        .join("\n\n");

    // Step 3: Ask fixer to produce corrected files
    console.log("    Asking fixer agent to repair code...");
    const fixResponse = await callOpenClaw(
        "openpages-fixer",
        `Fix the following build errors in a Next.js site called "${siteName}".

Error analysis:
${analysis}

Current files:
${fileList}

Output ONLY the corrected files using ===FILE: path=== ... ===END FILE=== format.`
    );

    const fixedFiles = parseFileBlocks(fixResponse);
    if (fixedFiles.size === 0) {
        console.error("    ✗ Fixer agent returned no files.");
        return false;
    }

    console.log(`    Writing ${fixedFiles.size} fixed files:`);
    await writeFiles(siteDir, fixedFiles);
    return true;
}

async function cleanBuildArtifacts(siteDir: string): Promise<void> {
    console.log(`\n🧹 [Clean] Removing build artifacts from ${path.basename(siteDir)}...`);
    const toRemove = ["node_modules", ".next", "package-lock.json", "yarn.lock"];
    for (const name of toRemove) {
        const p = path.join(siteDir, name);
        try {
            await fs.rm(p, { recursive: true, force: true });
            console.log(`    ✓ Removed ${name}`);
        } catch {
            // doesn't exist, that's fine
        }
    }
}

// ═══════════════════════════════════════════════════════════════════
// AGENT 2 — DEPLOYER: Push to GitHub + Deploy via Vercel
// ═══════════════════════════════════════════════════════════════════

async function commitAndPush(siteName: string): Promise<boolean> {
    console.log(`\n📤 [Agent 2 · Git] Committing and pushing entire repo...`);

    const githubToken = getEnvOrThrow("GITHUB_TOKEN");
    const repoFullName = getEnvOrThrow("GITHUB_REPO_FULL_NAME");

    const cmds = [
        `git add -A`,
        `git commit -m "Auto-generated site: ${siteName}"`,
        `git push https://x-access-token:${githubToken}@github.com/${repoFullName}.git main`,
    ].join(" && ");

    try {
        await execAsync(cmds, { cwd: ROOT });
        console.log("    ✓ Code pushed successfully.");
        return true;
    } catch (error: any) {
        console.error("    ✗ Git push failed:", error.message);
        return false;
    }
}

async function createVercelProject(siteName: string): Promise<{ projectId: string }> {
    const vercelToken = getEnvOrThrow("VERCEL_TOKEN");
    const repoFullName = getEnvOrThrow("GITHUB_REPO_FULL_NAME");

    console.log(`    Creating Vercel project "${siteName}"...`);
    const res = await fetch("https://api.vercel.com/v9/projects", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${vercelToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: siteName,
            framework: "nextjs",
            rootDirectory: `sites/${siteName}`,
            gitRepository: { repo: repoFullName, type: "github" },
        }),
    });

    if (!res.ok) {
        throw new Error(`Failed to create Vercel project: ${await res.text()}`);
    }

    const data = (await res.json()) as any;
    console.log(`    ✓ Project created: ${data.id}`);
    return { projectId: data.id };
}

async function triggerDeployment(
    siteName: string,
    projectId: string
): Promise<{ deploymentId: string; url: string }> {
    const vercelToken = getEnvOrThrow("VERCEL_TOKEN");
    const repoFullName = getEnvOrThrow("GITHUB_REPO_FULL_NAME");
    const [org, repo] = repoFullName.split("/");

    console.log("    Triggering deployment...");
    const res = await fetch("https://api.vercel.com/v13/deployments", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${vercelToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: siteName,
            project: projectId,
            gitSource: { type: "github", org, repo, ref: "main" },
        }),
    });

    if (!res.ok) {
        throw new Error(`Failed to trigger deployment: ${await res.text()}`);
    }

    const data = (await res.json()) as any;
    console.log(`    ✓ Deployment triggered: ${data.url} (${data.readyState})`);
    return { deploymentId: data.id, url: data.url };
}

async function pollDeployment(
    deploymentId: string
): Promise<{ state: string; errorMessage?: string }> {
    const vercelToken = getEnvOrThrow("VERCEL_TOKEN");
    const start = Date.now();

    console.log("    Polling deployment status...");
    while (Date.now() - start < DEPLOY_POLL_TIMEOUT_MS) {
        const res = await fetch(
            `https://api.vercel.com/v13/deployments/${deploymentId}`,
            { headers: { Authorization: `Bearer ${vercelToken}` } }
        );
        const data = (await res.json()) as any;
        const state = data.readyState || data.state;

        if (state === "READY") {
            console.log("    ✓ Deployment is READY!");
            return { state: "READY" };
        }
        if (state === "ERROR" || state === "CANCELED") {
            console.log(`    ✗ Deployment failed: ${data.errorMessage || "unknown error"}`);
            return { state, errorMessage: data.errorMessage || "Build failed" };
        }

        process.stdout.write(`    ⏳ ${state}...\r`);
        await sleep(DEPLOY_POLL_INTERVAL_MS);
    }

    return { state: "TIMEOUT", errorMessage: "Deployment polling timed out" };
}

async function fetchBuildLogs(deploymentId: string): Promise<string> {
    const vercelToken = getEnvOrThrow("VERCEL_TOKEN");

    try {
        const res = await fetch(
            `https://api.vercel.com/v3/deployments/${deploymentId}/events?builds=1&limit=200`,
            { headers: { Authorization: `Bearer ${vercelToken}` } }
        );

        const raw = await res.text();
        let logs = "";

        try {
            const events = JSON.parse(raw);
            if (Array.isArray(events)) {
                logs = events
                    .filter((e: any) => e.text)
                    .map((e: any) => e.text)
                    .join("\n");
            } else if (events.error) {
                return `API error: ${events.error.message}`;
            }
        } catch {
            logs = raw
                .split("\n")
                .filter((line) => line.trim())
                .map((line) => {
                    try {
                        return JSON.parse(line).text || "";
                    } catch {
                        return "";
                    }
                })
                .filter(Boolean)
                .join("\n");
        }

        return logs || "No build logs available";
    } catch (err) {
        return `Failed to fetch build logs: ${err}`;
    }
}

async function assignDomain(projectId: string, siteName: string): Promise<string> {
    const vercelToken = getEnvOrThrow("VERCEL_TOKEN");
    const customDomain = `${siteName}.openpages.zetalabs.in`;

    console.log(`    Assigning domain ${customDomain}...`);
    const res = await fetch(
        `https://api.vercel.com/v9/projects/${projectId}/domains`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${vercelToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: customDomain }),
        }
    );

    if (!res.ok) {
        console.warn("    ⚠ Failed to assign custom domain, using default.");
        return `${siteName}.vercel.app`;
    }

    console.log(`    ✓ Domain assigned: ${customDomain}`);
    return customDomain;
}

interface DeployResult {
    success: boolean;
    projectId?: string;
    deploymentId?: string;
    deploymentUrl?: string;
    vercelUrl?: string;
    errorLogs?: string;
}

async function deployToVercel(
    siteName: string,
    existingProjectId?: string
): Promise<DeployResult> {
    console.log(`\n🚀 [Agent 2 · Deploy] Deploying "${siteName}" to Vercel...`);

    try {
        const projectId =
            existingProjectId || (await createVercelProject(siteName)).projectId;
        const { deploymentId, url } = await triggerDeployment(siteName, projectId);
        const result = await pollDeployment(deploymentId);

        if (result.state === "READY") {
            const vercelUrl = await assignDomain(projectId, siteName);
            return {
                success: true,
                projectId,
                deploymentId,
                deploymentUrl: url,
                vercelUrl,
            };
        }

        console.log("    Fetching build logs for analysis...");
        const buildLogs = await fetchBuildLogs(deploymentId);
        return {
            success: false,
            projectId,
            deploymentId,
            errorLogs: `${result.errorMessage}\n\nBuild logs:\n${buildLogs}`,
        };
    } catch (error) {
        console.error("    ✗ Deployment error:", error);
        return { success: false, errorLogs: String(error) };
    }
}

// ═══════════════════════════════════════════════════════════════════
// AGENT 3 — FIX AGENT: Analyze deploy errors, fix code, re-deploy
// ═══════════════════════════════════════════════════════════════════

async function fixDeploymentErrors(
    siteName: string,
    siteDir: string,
    errorLogs: string
): Promise<boolean> {
    console.log(`\n🔧 [Agent 3 · Fixer] Analyzing deployment errors...`);

    // 1. Deployer agent diagnoses the error
    console.log("    Asking deployer agent to analyze error...");
    const analysis = await callOpenClaw(
        "openpages-deployer",
        `Analyze this Vercel build error for a Next.js site called "${siteName}":\n\n${errorLogs.slice(-4000)}`
    );
    console.log(`    Analysis: ${analysis.slice(0, 300)}...`);

    // 2. Read current site files
    const currentFiles = await readSiteFiles(siteDir);
    const fileList = Object.entries(currentFiles)
        .map(([name, content]) => `===FILE: ${name}===\n${content}\n===END FILE===`)
        .join("\n\n");

    // 3. Fixer agent repairs the code
    console.log("    Asking fixer agent to repair code...");
    const fixResponse = await callOpenClaw(
        "openpages-fixer",
        `Fix the following Vercel deployment errors in a Next.js site called "${siteName}".

Error analysis:
${analysis}

Current files:
${fileList}

Output ONLY the corrected files using ===FILE: path=== ... ===END FILE=== format.`
    );

    const fixedFiles = parseFileBlocks(fixResponse);
    if (fixedFiles.size === 0) {
        console.error("    ✗ Fixer agent returned no files.");
        return false;
    }

    console.log(`    Writing ${fixedFiles.size} fixed files:`);
    await writeFiles(siteDir, fixedFiles);
    return true;
}

// ─── Discord Notification ──────────────────────────────────────────

async function notifyDiscord(siteName: string, vercelUrl: string): Promise<void> {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (!webhookUrl || webhookUrl === "your_discord_webhook_url_here") {
        console.log("\n⏭  Skipping Discord notification (no webhook URL).");
        return;
    }

    const repoFullName = getEnvOrThrow("GITHUB_REPO_FULL_NAME");
    console.log("\n💬 Sending Discord notification...");
    try {
        await fetch(webhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                content: [
                    `🚀 **New OpenPages Site Deployed!**`,
                    ``,
                    `**Name:** ${siteName}`,
                    `**Live URL:** https://${vercelUrl}`,
                    `**GitHub:** https://github.com/${repoFullName}/tree/main/sites/${siteName}`,
                    ``,
                    `Generated autonomously by the OpenClaw Agent Orchestra.`,
                ].join("\n"),
            }),
        });
        console.log("    ✓ Discord notification sent.");
    } catch (error) {
        console.error("    ✗ Discord notification failed:", error);
    }
}

// ═══════════════════════════════════════════════════════════════════
// MAIN ORCHESTRATOR
// ═══════════════════════════════════════════════════════════════════

async function main(): Promise<void> {
    const siteName = generateSiteName();
    const siteDir = path.join(ROOT, "sites", siteName);

    console.log(`\n${"═".repeat(60)}`);
    console.log(`  🎼  OpenPages Agent Orchestra`);
    console.log(`  Site: ${siteName}`);
    console.log(`${"═".repeat(60)}`);

    if (DRY_RUN) {
        console.log("\n🏃 DRY RUN — validating env vars and connectivity...");
        getEnvOrThrow("GITHUB_TOKEN");
        getEnvOrThrow("GITHUB_REPO_FULL_NAME");
        getEnvOrThrow("VERCEL_TOKEN");
        getEnvOrThrow("OPENCLAW_GATEWAY_URL");
        getEnvOrThrow("OPENCLAW_GATEWAY_TOKEN");
        console.log("    ✓ All env vars present.");
        console.log("    ✓ Dry run complete. No sites were generated.\n");
        return;
    }

    // ╔═══════════════════════════════════════════════════════════════╗
    // ║  PHASE 1 — Agent 1: Generate + Local Build                  ║
    // ╚═══════════════════════════════════════════════════════════════╝

    const generated = await generateSite(siteName, siteDir);
    if (!generated) {
        console.error("\n❌ Pipeline aborted: Generation failed.");
        return;
    }

    // Build locally with fix-retry loop
    let buildOk = false;
    for (let attempt = 0; attempt <= MAX_LOCAL_FIX_RETRIES; attempt++) {
        if (attempt > 0) {
            console.log(`\n🔁 Local build retry ${attempt}/${MAX_LOCAL_FIX_RETRIES}...`);
        }

        const buildResult = await localBuild(siteDir);
        if (buildResult.ok) {
            buildOk = true;
            break;
        }

        // Try to fix
        if (attempt < MAX_LOCAL_FIX_RETRIES) {
            const fixed = await fixLocalBuild(siteName, siteDir, buildResult.logs);
            if (!fixed) {
                console.error("\n❌ Fixer could not repair the local build. Aborting.");
                return;
            }
        }
    }

    if (!buildOk) {
        console.error(`\n❌ Pipeline aborted: Local build failed after ${MAX_LOCAL_FIX_RETRIES} fix attempts.`);
        return;
    }

    // Clean build artifacts before pushing
    await cleanBuildArtifacts(siteDir);

    // ╔═══════════════════════════════════════════════════════════════╗
    // ║  PHASE 2 — Agent 2: Push to GitHub + Deploy via Vercel      ║
    // ╚═══════════════════════════════════════════════════════════════╝

    const pushed = await commitAndPush(siteName);
    if (!pushed) {
        console.error("\n❌ Pipeline aborted: Git push failed.");
        return;
    }

    // ╔═══════════════════════════════════════════════════════════════╗
    // ║  PHASE 3 — Deploy + Agent 3: Fix deploy errors if needed    ║
    // ╚═══════════════════════════════════════════════════════════════╝

    let projectId: string | undefined;

    for (let attempt = 0; attempt <= MAX_DEPLOY_FIX_RETRIES; attempt++) {
        if (attempt > 0) {
            console.log(`\n🔁 Deployment retry ${attempt}/${MAX_DEPLOY_FIX_RETRIES}...`);
        }

        const deployResult = await deployToVercel(siteName, projectId);
        projectId = deployResult.projectId;

        if (deployResult.success) {
            // 🎉 Success! Notify and exit
            await notifyDiscord(siteName, deployResult.vercelUrl!);

            console.log(`\n${"═".repeat(60)}`);
            console.log(`  ✅  Pipeline completed for ${siteName}`);
            console.log(`  🌐  Live: https://${deployResult.vercelUrl}`);
            console.log(`${"═".repeat(60)}\n`);
            return;
        }

        // Deployment failed — Agent 3 fixes the code
        if (attempt < MAX_DEPLOY_FIX_RETRIES && deployResult.errorLogs) {
            const fixed = await fixDeploymentErrors(
                siteName,
                siteDir,
                deployResult.errorLogs
            );
            if (!fixed) {
                console.error("\n❌ Fix agent couldn't repair the code. Aborting.");
                break;
            }

            // Re-push the fixed code
            const rePushed = await commitAndPush(siteName);
            if (!rePushed) {
                console.error("\n❌ Failed to push fixed code. Aborting.");
                break;
            }
        }
    }

    console.error(
        `\n❌ Pipeline failed after ${MAX_DEPLOY_FIX_RETRIES} deployment fix attempts for ${siteName}.`
    );
}

// ─── Entry Point ────────────────────────────────────────────────────
main().catch((err) => {
    console.error("\n💥 Unhandled error:", err);
    process.exit(1);
});
