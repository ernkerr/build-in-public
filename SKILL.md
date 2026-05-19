---
name: build-in-public
description: Agent-level knowledge and workflows for turning dev work into build-in-public content across multiple channels (social posts, blog, newsletter, video — anything where you'd narrate the work).
---

# build-in-public — agent skill

This file is the agent's high-level knowledge surface. CLAUDE.md says *who* this agent is and what constraints it operates under. This file says *what it knows how to do* and *how it works*.

For the user-facing slash command implementation, see [.claude/skills/build-in-public/SKILL.md](.claude/skills/build-in-public/SKILL.md) — that's the Claude Code skill entry point and routing table.

## Channels

The agent treats every output destination as a **channel**. A channel is anything with its own voice, format constraints, and audience:

- **Social** — X, LinkedIn, Bluesky, Threads (existing, in `modes/_shared.md`)
- _Planned_ — long-form blog, newsletter, podcast/video scripts, conference talk drafts

Each channel has:
- Format rules (length, structure, tone)
- Voice references (`data/style-refs/{channel}.md` today)
- A publishing path (script in `scripts/` or manual)

## Workspaces

| Directory | Role |
|---|---|
| [inbox/](inbox/) | Raw incoming material — pasted style refs, transcripts, link dumps, half-formed ideas, anything awaiting triage |
| [outputs/](outputs/) | Finished work the agent has produced — drafts ready to ship, published artifacts, generated assets |
| [archive/](archive/) | Frozen past iterations — old voice profiles, retired channel rules, snapshots from before a refactor |
| [.claude/rules/](.claude/rules/) | Always-on directives the agent should never violate (never-words, voice non-negotiables, safety rules) |
| [.claude/skills/](.claude/skills/) | Executable skills and routing — what Claude Code auto-discovers |

## Migration status

The repo is mid-refactor from a social-only structure to a channel-agnostic one. Today's authoritative content still lives in:
- `modes/` — per-mode prompts
- `data/voice.md`, `data/style-refs/` — voice
- `data/drafts.md`, `data/published.md` — workflow state
- `config/profile.yml` — identity & creds

These will migrate into `inbox/`, `outputs/`, `archive/`, and `.claude/rules/` as the new structure proves out. Until then, the existing paths in `.claude/skills/build-in-public/SKILL.md` remain the sources of truth.
