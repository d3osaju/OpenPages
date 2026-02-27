import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";
import path from "path";
import fetch from "node-fetch";

const execAsync = promisify(exec);

const MAX_FIX_RETRIES = 3;
const DEPLOY_POLL_INTERVAL_MS = 15000; // 15 seconds
const DEPLOY_POLL_TIMEOUT_MS = 300000; // 5 minutes

// ─── Helpers ───────────────────────────────────────────────────────

function generateSiteName() {
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

// Parse ===FILE: path=== ... ===END FILE=== blocks
function parseFileBlocks(text: string): Map<string, string> {
    const files = new Map<string, string>();
    const re = /===FILE:\s*(.+?)===\n([\s\S]*?)===END FILE===/g;
    let m;
    while ((m = re.exec(text)) !== null) {
        files.set(m[1].trim(), m[2]);
    }
    return files;
}

async function writeFiles(outputDir: string, files: Map<string, string>) {
    for (const [filePath, content] of files) {
        const full = path.join(outputDir, filePath);
        await fs.mkdir(path.dirname(full), { recursive: true });
        await fs.writeFile(full, content);
        console.log(`  ✓ ${filePath}`);
    }
}

async function callOpenClaw(agentId: string, prompt: string): Promise<string> {
    const url = getEnvOrThrow("OPENCLAW_GATEWAY_URL");
    const token = getEnvOrThrow("OPENCLAW_GATEWAY_TOKEN");

    const res = await fetch(`${url}/v1/chat/completions`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
            "x-openclaw-agent-id": agentId
        },
        body: JSON.stringify({
            model: `openclaw:${agentId}`,
            messages: [{ role: "user", content: prompt }],
            max_tokens: 16000,
            temperature: 0.7
        })
    });

    if (!res.ok) {
        throw new Error(`OpenClaw API error (${res.status}): ${await res.text()}`);
    }

    const data = await res.json() as any;
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new Error("OpenClaw returned empty content");
    return content;
}

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ─── Agent 1: Site Generator ───────────────────────────────────────

async function generateSite(siteName: string, outputDir: string): Promise<boolean> {
    console.log(`\n🎨 [Generator] Creating landing page for "${siteName}"...`);

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
- Use next.config.js (CommonJS with module.exports), NOT next.config.ts or next.config.mjs.
- Use Next.js 14.x (e.g. "next": "^14.2.0") for maximum compatibility.

Output ALL files using the ===FILE: path=== ... ===END FILE=== format as instructed in your identity.`;

    try {
        const content = await callOpenClaw("openpages", prompt);
        console.log(`  Received ${content.length} characters from OpenClaw.`);

        const files = parseFileBlocks(content);
        if (files.size === 0) {
            console.error("  ✗ Failed to parse files from response.");
            await fs.mkdir(outputDir, { recursive: true });
            await fs.writeFile(path.join(outputDir, "_raw_response.txt"), content);
            return false;
        }

        console.log(`  Parsed ${files.size} files:`);
        await writeFiles(outputDir, files);
        return true;
    } catch (error) {
        console.error("  ✗ Generation failed:", error);
        return false;
    }
}

// ─── Vercel Compatibility ──────────────────────────────────────────

async function ensureVercelCompat(outputDir: string) {
    console.log(`  Ensuring Vercel compatibility...`);

    // Explicit PostCSS config to prevent Vercel from auto-detecting Tailwind
    const postcssConfig = `module.exports = {
  plugins: {},
};
`;
    await fs.writeFile(path.join(outputDir, "postcss.config.js"), postcssConfig);
    console.log(`  ✓ postcss.config.js (explicit, no Tailwind)`);

    // Remove any next.config.ts if next.config.js exists (can't have both)
    const hasJs = await fs.access(path.join(outputDir, "next.config.js")).then(() => true).catch(() => false);
    const hasTs = await fs.access(path.join(outputDir, "next.config.ts")).then(() => true).catch(() => false);
    const hasMjs = await fs.access(path.join(outputDir, "next.config.mjs")).then(() => true).catch(() => false);
    if (hasJs && hasTs) {
        await fs.unlink(path.join(outputDir, "next.config.ts"));
        console.log(`  ✓ Removed conflicting next.config.ts`);
    }
    if (hasJs && hasMjs) {
        await fs.unlink(path.join(outputDir, "next.config.mjs"));
        console.log(`  ✓ Removed conflicting next.config.mjs`);
    }

    // If no next.config.js, create one
    if (!hasJs) {
        const nextConfig = `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};
module.exports = nextConfig;
`;
        await fs.writeFile(path.join(outputDir, "next.config.js"), nextConfig);
        console.log(`  ✓ Created next.config.js`);
    }
}

// ─── Local Build Verification ──────────────────────────────────────

async function localBuild(outputDir: string): Promise<{ success: boolean; errorOutput?: string }> {
    console.log(`\n🔨 [Build] Running local build verification...`);

    try {
        console.log(`  Installing dependencies...`);
        await execAsync(`npm install`, { cwd: outputDir, timeout: 120000 });
        console.log(`  ✓ Dependencies installed.`);

        console.log(`  Running build...`);
        await execAsync(`npm run build`, { cwd: outputDir, timeout: 120000 });
        console.log(`  ✓ Build succeeded!`);
        return { success: true };
    } catch (error: any) {
        const errorOutput = error.stderr || error.stdout || String(error);
        console.error(`  ✗ Build failed.`);
        return { success: false, errorOutput };
    }
}

async function cleanBuildArtifacts(outputDir: string) {
    console.log(`  Cleaning build artifacts...`);
    const toRemove = ['node_modules', '.next', 'package-lock.json', 'next-env.d.ts'];
    for (const item of toRemove) {
        await fs.rm(path.join(outputDir, item), { recursive: true, force: true }).catch(() => { });
    }
    console.log(`  ✓ Build artifacts cleaned.`);
}

// ─── Git: Commit & Push (entire repo) ──────────────────────────────

async function commitAndPush(siteName: string): Promise<boolean> {
    console.log(`\n📤 [Git] Committing and pushing entire repo...`);

    const githubToken = getEnvOrThrow("GITHUB_TOKEN");
    const repoFullName = getEnvOrThrow("GITHUB_REPO_FULL_NAME");

    const cmds = [
        `git add .`,
        `git commit -m "Auto-generated site: ${siteName}"`,
        `git push https://x-access-token:${githubToken}@github.com/${repoFullName}.git main`
    ].join(" && ");

    try {
        await execAsync(cmds);
        console.log("  ✓ Code pushed successfully.");
        return true;
    } catch (error) {
        console.error("  ✗ Git push failed:", error);
        return false;
    }
}

// ─── Agent 2: Deployment ───────────────────────────────────────────

interface DeployResult {
    success: boolean;
    projectId?: string;
    deploymentId?: string;
    deploymentUrl?: string;
    vercelUrl?: string;
    errorLogs?: string;
}

async function createVercelProject(siteName: string): Promise<{ projectId: string }> {
    const vercelToken = getEnvOrThrow("VERCEL_TOKEN");
    const repoFullName = getEnvOrThrow("GITHUB_REPO_FULL_NAME");
    const [org, repo] = repoFullName.split("/");

    console.log(`  Creating Vercel project "${siteName}"...`);
    const res = await fetch("https://api.vercel.com/v9/projects", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${vercelToken}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: siteName,
            framework: "nextjs",
            rootDirectory: `sites/${siteName}`,
            gitRepository: { repo: repoFullName, type: "github" }
        })
    });

    if (!res.ok) {
        throw new Error(`Failed to create Vercel project: ${await res.text()}`);
    }

    const data = await res.json() as any;
    console.log(`  ✓ Project created: ${data.id}`);
    return { projectId: data.id };
}

async function triggerDeployment(siteName: string, projectId: string): Promise<{ deploymentId: string; url: string }> {
    const vercelToken = getEnvOrThrow("VERCEL_TOKEN");
    const repoFullName = getEnvOrThrow("GITHUB_REPO_FULL_NAME");
    const [org, repo] = repoFullName.split("/");

    console.log(`  Triggering deployment...`);
    const res = await fetch("https://api.vercel.com/v13/deployments", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${vercelToken}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: siteName,
            project: projectId,
            gitSource: { type: "github", org, repo, ref: "main" }
        })
    });

    if (!res.ok) {
        throw new Error(`Failed to trigger deployment: ${await res.text()}`);
    }

    const data = await res.json() as any;
    console.log(`  ✓ Deployment triggered: ${data.url} (${data.readyState})`);
    return { deploymentId: data.id, url: data.url };
}

async function pollDeployment(deploymentId: string): Promise<{ state: string; errorMessage?: string }> {
    const vercelToken = getEnvOrThrow("VERCEL_TOKEN");
    const start = Date.now();

    console.log(`  Polling deployment status...`);
    while (Date.now() - start < DEPLOY_POLL_TIMEOUT_MS) {
        const res = await fetch(`https://api.vercel.com/v13/deployments/${deploymentId}`, {
            headers: { "Authorization": `Bearer ${vercelToken}` }
        });
        const data = await res.json() as any;
        const state = data.readyState || data.state;

        if (state === "READY") {
            console.log(`  ✓ Deployment is READY!`);
            return { state: "READY" };
        }
        if (state === "ERROR" || state === "CANCELED") {
            console.log(`  ✗ Deployment failed: ${data.errorMessage || "unknown error"}`);
            return { state, errorMessage: data.errorMessage || "Build failed" };
        }

        process.stdout.write(`  ⏳ ${state}...`);
        await sleep(DEPLOY_POLL_INTERVAL_MS);
        process.stdout.write("\r");
    }

    return { state: "TIMEOUT", errorMessage: "Deployment polling timed out" };
}

async function fetchBuildLogs(deploymentId: string): Promise<string> {
    const vercelToken = getEnvOrThrow("VERCEL_TOKEN");

    try {
        // Use v3 API with builds=1 to get actual build output
        const res = await fetch(
            `https://api.vercel.com/v3/deployments/${deploymentId}/events?builds=1&limit=200`,
            { headers: { "Authorization": `Bearer ${vercelToken}` } }
        );

        const raw = await res.text();

        // Response may be JSON array or newline-delimited JSON
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
            // Try newline-delimited JSON
            logs = raw.split("\n")
                .filter(line => line.trim())
                .map(line => {
                    try { return JSON.parse(line).text || ""; } catch { return ""; }
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

    console.log(`  Assigning domain ${customDomain}...`);
    const res = await fetch(`https://api.vercel.com/v9/projects/${projectId}/domains`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${vercelToken}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name: customDomain })
    });

    if (!res.ok) {
        console.warn(`  ⚠ Failed to assign custom domain, using default.`);
        return `${siteName}.vercel.app`;
    }

    console.log(`  ✓ Domain assigned: ${customDomain}`);
    return customDomain;
}

async function deployToVercel(siteName: string, existingProjectId?: string): Promise<DeployResult> {
    console.log(`\n🚀 [Deployer] Deploying "${siteName}" to Vercel...`);

    try {
        // Create project (only on first deploy)
        const projectId = existingProjectId || (await createVercelProject(siteName)).projectId;

        // Trigger deployment
        const { deploymentId, url } = await triggerDeployment(siteName, projectId);

        // Poll until READY or ERROR
        const result = await pollDeployment(deploymentId);

        if (result.state === "READY") {
            const vercelUrl = await assignDomain(projectId, siteName);
            return {
                success: true,
                projectId,
                deploymentId,
                deploymentUrl: url,
                vercelUrl
            };
        }

        // Deployment failed — fetch build logs
        console.log(`  Fetching build logs for analysis...`);
        const buildLogs = await fetchBuildLogs(deploymentId);

        return {
            success: false,
            projectId,
            deploymentId,
            errorLogs: `${result.errorMessage}\n\nBuild logs:\n${buildLogs}`
        };
    } catch (error) {
        console.error("  ✗ Deployment error:", error);
        return { success: false, errorLogs: String(error) };
    }
}

// ─── Agent 3: Fix Agent ────────────────────────────────────────────

async function fixBuildErrors(siteName: string, outputDir: string, errorLogs: string): Promise<boolean> {
    console.log(`\n🔧 [Fixer] Analyzing and fixing build errors...`);

    // Step 1: Ask the deployer agent to analyze the error
    console.log(`  Asking deployer agent to analyze error...`);
    const analysis = await callOpenClaw("openpages-deployer",
        `Analyze this Vercel build error for a Next.js site called "${siteName}":\n\n${errorLogs}`
    );
    console.log(`  Analysis:\n${analysis}`);

    // Step 2: Read the current files that might need fixing
    const currentFiles: Record<string, string> = {};
    async function readDir(dir: string, prefix = "") {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        for (const entry of entries) {
            if (entry.name === "node_modules" || entry.name === ".next") continue;
            const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
            if (entry.isDirectory()) {
                await readDir(path.join(dir, entry.name), rel);
            } else {
                currentFiles[rel] = await fs.readFile(path.join(dir, entry.name), "utf-8");
            }
        }
    }
    await readDir(outputDir);

    const fileList = Object.entries(currentFiles)
        .map(([name, content]) => `===FILE: ${name}===\n${content}\n===END FILE===`)
        .join("\n\n");

    // Step 3: Ask the fixer agent to produce corrected files
    console.log(`  Asking fixer agent to repair code...`);
    const fixResponse = await callOpenClaw("openpages-fixer",
        `Fix the following build errors in a Next.js site called "${siteName}".

Error analysis:
${analysis}

Current files:
${fileList}

Output ONLY the corrected files using ===FILE: path=== ... ===END FILE=== format.`
    );

    const fixedFiles = parseFileBlocks(fixResponse);
    if (fixedFiles.size === 0) {
        console.error("  ✗ Fixer agent returned no files.");
        return false;
    }

    console.log(`  Writing ${fixedFiles.size} fixed files:`);
    await writeFiles(outputDir, fixedFiles);
    return true;
}

// ─── Orchestrator ──────────────────────────────────────────────────

async function main() {
    const siteName = generateSiteName();
    const outputDir = path.join(process.cwd(), "sites", siteName);

    console.log(`\n${"═".repeat(60)}`);
    console.log(`  OpenPages Pipeline — ${siteName}`);
    console.log(`${"═".repeat(60)}`);

    // ── Step 1: Generate ──
    const generated = await generateSite(siteName, outputDir);
    if (!generated) {
        console.error("\n❌ Pipeline aborted: Generation failed.");
        return;
    }

    // ── Step 1.5: Ensure Vercel compatibility ──
    await ensureVercelCompat(outputDir);

    // ── Step 2: Local Build Verification (with fix retries) ──
    let buildPassed = false;
    for (let attempt = 0; attempt <= MAX_FIX_RETRIES; attempt++) {
        if (attempt > 0) {
            console.log(`\n🔁 Local build fix attempt ${attempt}/${MAX_FIX_RETRIES}...`);
        }

        const buildResult = await localBuild(outputDir);
        if (buildResult.success) {
            buildPassed = true;
            break;
        }

        // Build failed — try to fix
        if (attempt < MAX_FIX_RETRIES && buildResult.errorOutput) {
            const fixed = await fixBuildErrors(siteName, outputDir, buildResult.errorOutput);
            if (!fixed) {
                console.error("\n❌ Fix agent couldn't repair the code. Aborting.");
                break;
            }
        }
    }

    if (!buildPassed) {
        console.error(`\n❌ Pipeline aborted: Local build failed after ${MAX_FIX_RETRIES} fix attempts.`);
        return;
    }

    // ── Step 3: Clean build artifacts before committing ──
    await cleanBuildArtifacts(outputDir);

    // ── Step 4: Commit & Push ──
    const pushed = await commitAndPush(siteName);
    if (!pushed) {
        console.error("\n❌ Pipeline aborted: Git push failed.");
        return;
    }

    // ── Step 5: Deploy to Vercel ──
    const deployResult = await deployToVercel(siteName);

    if (deployResult.success) {
        // ── Step 6: Success! Notify Discord ──
        await notifyDiscord(siteName, deployResult.vercelUrl!);

        // ── Step 7: Update Database ──
        await updateDatabase(siteName, deployResult.vercelUrl!);

        console.log(`\n${"═".repeat(60)}`);
        console.log(`  ✅ Pipeline completed for ${siteName}`);
        console.log(`  🌐 Live: https://${deployResult.vercelUrl}`);
        console.log(`${"═".repeat(60)}\n`);
    } else {
        console.error(`\n❌ Vercel deployment failed: ${deployResult.errorLogs}`);
    }
}

// ─── Discord & Database ────────────────────────────────────────────

async function notifyDiscord(siteName: string, vercelUrl: string) {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (!webhookUrl) {
        console.log("\n⏭ Skipping Discord notification (no webhook URL).");
        return;
    }

    const repoFullName = getEnvOrThrow("GITHUB_REPO_FULL_NAME");
    console.log("\n💬 Sending Discord notification...");
    try {
        await fetch(webhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                content: `🚀 **New Openpages Site Deployed!**\n\n**Name:** ${siteName}\n**Live URL:** https://${vercelUrl}\n**GitHub:** https://github.com/${repoFullName}/tree/main/sites/${siteName}\n\nGenerated autonomously by OpenClaw.`
            })
        });
        console.log("  ✓ Discord notification sent.");
    } catch (error) {
        console.error("  ✗ Discord notification failed:", error);
    }
}

async function updateDatabase(siteName: string, vercelUrl: string) {
    const repoFullName = getEnvOrThrow("GITHUB_REPO_FULL_NAME");
    console.log("\n💾 Updating database...");
    try {
        const res = await fetch("http://localhost:3000/api/websites", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: siteName,
                githubUrl: `https://github.com/${repoFullName}/tree/main/sites/${siteName}`,
                vercelUrl,
                status: "DEPLOYED",
                screenshot: ""
            })
        });
        if (!res.ok) throw new Error("API error");
        console.log("  ✓ Database updated.");
    } catch (error) {
        console.error("  ⚠ Database update failed (non-fatal):", error);
    }
}

// ─── Entry Point ───────────────────────────────────────────────────

if (require.main === module) {
    main().catch(console.error);
}
