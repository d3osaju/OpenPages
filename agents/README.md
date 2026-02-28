# OpenPages Agent Orchestra

This folder contains the identity and skill files for all OpenClaw agents used in the OpenPages pipeline.

## Agents

| Agent | Role | File |
|-------|------|------|
| `openpages` | Generates Next.js landing pages with randomized design styles | [IDENTITY.md](openpages/IDENTITY.md) |
| `openpages-deployer` | Diagnoses build/deployment errors | [IDENTITY.md](openpages-deployer/IDENTITY.md) |
| `openpages-fixer` | Repairs broken code based on error analysis | [IDENTITY.md](openpages-fixer/IDENTITY.md) |
| `openpages-main` | Orchestrator — coordinates the full pipeline | [IDENTITY.md](openpages-main/IDENTITY.md) |

## Skills

| Skill | Agent | File |
|-------|-------|------|
| `generate-site` | `openpages-main` | [SKILL.md](openpages-main/skills/generate-site/SKILL.md) |

## Syncing to OpenClaw

To sync these files to your local OpenClaw workspace:

```bash
# Copy identities
cp agents/openpages/IDENTITY.md ~/.openclaw/workspace-openpages/IDENTITY.md
cp agents/openpages-deployer/IDENTITY.md ~/.openclaw/workspace-openpages-deployer/IDENTITY.md
cp agents/openpages-fixer/IDENTITY.md ~/.openclaw/workspace-openpages-fixer/IDENTITY.md
cp agents/openpages-main/IDENTITY.md ~/.openclaw/workspace-openpages-main/IDENTITY.md

# Copy skills
cp agents/openpages-main/skills/generate-site/SKILL.md ~/.openclaw/workspace-openpages-main/skills/generate-site/SKILL.md
```
