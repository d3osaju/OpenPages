---
name: generate-site
description: Generate a new landing page and deploy to Vercel — fully agent-driven using OpenClaw sub-agents
user-invocable: true
---

# Generate Site — Full Agent Pipeline

Execute this pipeline step by step. You are the orchestrator. Use shell commands for file operations, builds, git, and API calls. Use `sessions_spawn` to delegate work to sub-agents.

## Setup

First, load credentials:

```bash
cd /home/syndicayte/projects/OpenPages
source .env
```

Generate a random site name:

```bash
SITE_NAME="$(shuf -n1 -e rapid swift nova apex zenith hyper ultra lunar solar neon)-$(shuf -n1 -e launch forge wave spark pulse orbit flow nexus core grid)-$(shuf -n1 -e $(seq 100 999))"
echo "Site: $SITE_NAME"
```

Pick a random design style:

```bash
STYLE="$(shuf -n1 -e 'Neobrutalist' 'Swiss/International' 'Editorial' 'Glassmorphism' 'Retro-futuristic' 'Bauhaus' 'Art Deco' 'Minimal' 'Flat' 'Material' 'Neumorphic' 'Monochromatic' 'Scandinavian' 'Japandi' 'Dark Mode First' 'Modernist' 'Organic/Fluid' 'Corporate Professional' 'Tech Forward' 'Luxury Minimal' 'Neo-Geo' 'Kinetic' 'Gradient Modern' 'Typography First' 'Metropolitan')"
echo "Style: $STYLE"
```

Set the site directory:

```bash
SITE_DIR="/home/syndicayte/projects/OpenPages/sites/$SITE_NAME"
mkdir -p "$SITE_DIR"
```

---

## Phase 1 — Generate Landing Page

Use `sessions_spawn` to call the `openpages` agent. This is an OpenClaw tool you have access to.

Call it with:
- `agentId`: `openpages`
- `task`: The generation prompt (include the site name, design style, and technical rules below)
- `runTimeoutSeconds`: `300`

The task prompt to send to the `openpages` agent should be:

> Generate a complete Next.js ONE-PAGE LANDING PAGE for a product called "{SITE_NAME}" using the {STYLE} design style. Make it visually stunning with the mood and feel of that aesthetic.
>
> CRITICAL RULES:
> - Use ONLY vanilla CSS in globals.css. NO Tailwind.
> - Do NOT include tailwindcss, postcss, or autoprefixer.
> - Create next.config.mjs (NOT .ts or .js).
> - Use Next.js 14.x (not 15.x).
> - Include typescript, @types/react, @types/node as devDependencies.
>
> Output ALL files using ===FILE: path=== ... ===END FILE=== format.

After receiving the sub-agent result, parse the `===FILE: path===` blocks from the response and write each file to `$SITE_DIR` using a Python script:

```bash
python3 -c "
import re, os, sys
text = open('/tmp/openpages-response.txt').read()
files = re.findall(r'===FILE:\s*(.+?)===\n([\s\S]*?)===END FILE===', text)
if not files:
    print('ERROR: No files parsed'); sys.exit(1)
for path, content in files:
    path = path.strip()
    full = os.path.join('$SITE_DIR', path)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, 'w') as f:
        f.write(content)
    print(f'  ✓ {path}')
print(f'Parsed {len(files)} files')
"
```

Save the sub-agent response text to `/tmp/openpages-response.txt` first, then run the parser.

---

## Phase 2 — Local Build (with fix loop)

Build locally to verify the code:

```bash
cd "$SITE_DIR"
npm install --legacy-peer-deps 2>&1
npx next build 2>&1
```

**If build succeeds:** Move to Phase 3.

**If build fails** (up to 3 retries):

1. Save the build error output to `/tmp/build-error.txt`
2. Use `sessions_spawn` with `agentId: openpages-deployer` to analyze the error. Task: "Analyze this build error for Next.js site {SITE_NAME}: {build error text}"
3. Read all current site files, then use `sessions_spawn` with `agentId: openpages-fixer` to fix. Task: "Fix build errors in Next.js site {SITE_NAME}. Error analysis: {analysis}. Current files: {file contents in ===FILE=== format}. Output ONLY corrected files using ===FILE: path=== ... ===END FILE=== format."
4. Parse fixed files, overwrite in `$SITE_DIR`, retry build.

---

## Phase 3 — Clean + Push to GitHub

Clean build artifacts:

```bash
cd "$SITE_DIR"
rm -rf node_modules .next package-lock.json yarn.lock
```

Commit and push:

```bash
cd /home/syndicayte/projects/OpenPages
source .env
git add -A
git commit -m "Auto-generated site: $SITE_NAME"
git push "https://x-access-token:${GITHUB_TOKEN}@github.com/d3osaju/OpenPages.git" main
```

---

## Phase 4 — Deploy to Vercel

Create a Vercel project:

```bash
source /home/syndicayte/projects/OpenPages/.env
curl -s -X POST "https://api.vercel.com/v9/projects" \
  -H "Authorization: Bearer $VERCEL_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"name\": \"$SITE_NAME\", \"framework\": \"nextjs\", \"rootDirectory\": \"sites/$SITE_NAME\", \"gitRepository\": {\"repo\": \"d3osaju/OpenPages\", \"type\": \"github\"}}"
```

Extract the `id` from the JSON response. Then trigger deployment:

```bash
curl -s -X POST "https://api.vercel.com/v13/deployments" \
  -H "Authorization: Bearer $VERCEL_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"name\": \"$SITE_NAME\", \"project\": \"$PROJECT_ID\", \"gitSource\": {\"type\": \"github\", \"org\": \"d3osaju\", \"repo\": \"OpenPages\", \"ref\": \"main\"}}"
```

Poll every 15 seconds until `readyState` is `READY` or `ERROR`:

```bash
for i in $(seq 1 20); do
  STATE=$(curl -s "https://api.vercel.com/v13/deployments/$DEPLOY_ID" \
    -H "Authorization: Bearer $VERCEL_TOKEN" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d.get('readyState',d.get('state','')))")
  echo "Status: $STATE"
  [ "$STATE" = "READY" ] && break
  [ "$STATE" = "ERROR" ] || [ "$STATE" = "CANCELED" ] && break
  sleep 15
done
```

If `READY`, assign custom domain:

```bash
curl -s -X POST "https://api.vercel.com/v9/projects/$PROJECT_ID/domains" \
  -H "Authorization: Bearer $VERCEL_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"name\": \"$SITE_NAME.openpages.zetalabs.in\"}"
```

---

## Phase 5 — Fix Deployment Errors (if needed, up to 2 retries)

If Vercel deployment failed:

1. Fetch build logs:
```bash
curl -s "https://api.vercel.com/v3/deployments/$DEPLOY_ID/events?builds=1&limit=200" \
  -H "Authorization: Bearer $VERCEL_TOKEN"
```

2. Use `sessions_spawn` with `openpages-deployer` to diagnose, then `openpages-fixer` to fix (same pattern as Phase 2).
3. Clean build artifacts, commit, push, and re-trigger deployment from Phase 4 (reuse `PROJECT_ID`).

---

## Phase 6 — Notify Discord

```bash
source /home/syndicayte/projects/OpenPages/.env
curl -s -X POST "$DISCORD_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d "{\"content\": \"🚀 **New OpenPages Site Deployed!**\n\n**Name:** $SITE_NAME\n**Style:** $STYLE\n**Live URL:** https://$SITE_NAME.openpages.zetalabs.in\n**GitHub:** https://github.com/d3osaju/OpenPages/tree/main/sites/$SITE_NAME\n\nGenerated autonomously by the OpenClaw Agent Orchestra.\"}"
```

---

## Final Report

After completing, report:
- Site name and design style
- Live URL
- Errors encountered and how they were resolved
- Total phases completed
