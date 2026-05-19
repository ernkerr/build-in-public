---
name: build-in-public
description: Agent-level knowledge and workflows for turning dev work into build-in-public content across multiple channels (social posts, video scripts, captions, hooks — anything where you'd narrate the work).
---

# build-in-public — agent skill

This file is the agent's high-level knowledge surface. CLAUDE.md says *who* this agent is and what constraints it operates under. This file says *what it knows how to do* and *how it works*.

For the user-facing slash command implementation, see [.claude/skills/build-in-public/SKILL.md](.claude/skills/build-in-public/SKILL.md) — that's the Claude Code skill entry point and routing table.

## Channels

The agent treats every output destination as a **channel**. A channel is anything with its own voice, format constraints, and audience. Each channel has its own voice file at `data/voice/{platform}/voice.md` and reference examples at `data/references/{platform}/`.

Active channels:
- **X** — high confidence, 19 reference posts
- **LinkedIn** — high confidence, 15 reference posts
- **Threads** — stub, falls back to X cadence
- **Bluesky** — stub, falls back to X cadence
- **Instagram** — stub; multi-task (`scripting`, `hook`, `text-overlay`, `caption` subfiles)
- **YouTube** — stub
- **TikTok** — stub

Each channel has:
- Format rules (length, structure) — in its `data/voice/{platform}/voice.md`
- Positive voice direction — same file
- Optional task-specific voice files (e.g. `data/voice/instagram/scripting.md`) when the channel has distinct sub-formats
- Reference examples — `data/references/{platform}/`
- A publishing path — script in `scripts/` or manual via the publish mode

## Workspaces

| Directory | Role |
|---|---|
| [data/voice/](data/voice/) | Voice hierarchy: universal → platform → task |
| [data/references/](data/references/) | Annotated post examples per platform |
| [.claude/rules/](.claude/rules/) | Always-on rules + drafting + feedback protocols |
| [.claude/skills/](.claude/skills/) | Executable skills and routing — what Claude Code auto-discovers |
| [inbox/](inbox/) | Raw incoming material awaiting triage |
| [outputs/](outputs/) | Finished work (drafts ready to ship, published artifacts) |
| [archive/](archive/) | Frozen past iterations (old voice profiles, pre-refactor snapshots) |

## Drafting + feedback protocols

Both are imported into CLAUDE.md so they load every session:
- [.claude/rules/voice-lookup.md](.claude/rules/voice-lookup.md) — what to read before drafting (universal → platform → task → references)
- [.claude/rules/feedback-loop.md](.claude/rules/feedback-loop.md) — how to handle feedback (identify scope, append by default, promote on recurrence)

Hard prohibitions live in [.claude/rules/never-words.md](.claude/rules/never-words.md) and [.claude/rules/voice-non-negotiables.md](.claude/rules/voice-non-negotiables.md). Those are referenced from `voice-lookup.md` and loaded on-demand (not at session start) to keep root context lean.

## Major decisions

Logged at [decisions.md](decisions.md). When adding a new architectural choice that took real reasoning, append an entry there.
