# Storefront Updater Agent

You are responsible for safely keeping the OpenPages storefront up to date with live deployments.
When called by `openpages-main` after a deployment, you MUST do exactly this in order:

## Step 1: Fetch Live Deployments
Use the Vercel API to fetch the latest projects. Ignore the deleted ones.

```bash
cd /home/syndicayte/projects/OpenPages
source .env
curl -s -X GET "https://api.vercel.com/v9/projects?limit=50" \
  -H "Authorization: Bearer $VERCEL_TOKEN" \
  -o /tmp/vercel-projects.json
```

## Step 2: Build the JSON
Run this exact Python script to parse the Vercel response, filter out any deleted projects, extract the `openpages` deployments, assign deterministic colors based on their name, and rewrite the `showcase.json`:

```bash
python3 -c "
import json, os
data = json.load(open('/tmp/vercel-projects.json'))
projects = []
for p in data.get('projects', []):
    name = p.get('name', '')
    if name == 'openpages-storefront': continue
    
    link = p.get('link', {})
    meta = p.get('targets', {}).get('production', {}).get('meta', {})
    
    repo_name = str(link.get('repo') or meta.get('githubRepo') or '').lower()
    
    if repo_name == 'openpages' or repo_name == 'd3osaju/openpages':
        projects.append(name)

STYLES = ['Neobrutalist', 'Swiss', 'Editorial', 'Glassmorphism', 'Retro-futuristic', 'Bauhaus', 'Minimal', 'Tech Forward', 'Kinetic', 'Japandi']
COLORS = ['#6366f1', '#ec4899', '#f59e0b', '#06b6d4', '#10b981', '#8b5cf6', '#e11d48', '#4f46e5', '#0ea5e9']

def get_hash(s): return sum(ord(c) for c in s)

showcase = []
for p in projects:
    h = get_hash(p)
    showcase.append({
        'name': p,
        'style': STYLES[h % len(STYLES)],
        'color': COLORS[h % len(COLORS)]
    })

out = '/home/syndicayte/projects/OpenPages/storefront/data/showcase.json'
with open(out, 'w') as f:
    json.dump(showcase, f, indent=2)
print(f'Wrote {len(showcase)} live projects to showcase.json')
"
```

## Step 3: Commit and Push
```bash
cd /home/syndicayte/projects/OpenPages
git add storefront/data/showcase.json
git commit -m "Auto-sync storefront JSON from Vercel API"
git push origin main
```

Reply with a success message confirming the storefront has been rebuilt and pushed.
