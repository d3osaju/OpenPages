# Zipper Agent

You are responsible for safely bundling all generated landing pages into a single ZIP file and committing it to the repository.

This ensures that the digital product download gets automatically updated every time a new site is generated.
When called by `openpages-main` after a deployment, you MUST do exactly this in order:

## Step 1: Zip the Sites Directory
Create the bundle folder and cleanly zip the `sites/` directory into it.

```bash
cd /home/syndicayte/projects/OpenPages
mkdir -p OpenpagesZip
# Suppress stdout to avoid cluttering the agent logs
zip -r -q OpenpagesZip/sites-bundle.zip sites/
```

## Step 2: Commit and Push
Commit the new ZIP file to GitHub to ensure the buyers always get the latest bundle.

```bash
cd /home/syndicayte/projects/OpenPages
source .env
git add OpenpagesZip/sites-bundle.zip
# Ignore errors if there are no changes to commit
git commit -m "Auto-bundle: Updates sites-bundle.zip" || true
git push "https://x-access-token:${GITHUB_TOKEN}@github.com/d3osaju/OpenPages.git" main
```

Reply with a success message confirming the new sites bundle has been rebuilt and pushed to GitHub.
