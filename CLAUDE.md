This is the **build-in-public** project — an agent for the full build-in-public lifecycle. It helps you go from idea → draft → post → cross-post → adapt, across whatever platforms you publish to.

## Inputs it works from

- Your git commits (when there's recent work to talk about)
- Your own ideas, half-formed thoughts, voice notes
- Posts you want to remake or adapt for a different platform
- Other people's posts as inspiration to learn from

## Voice and references

Voice is two layers: **base defaults** in `data/voice/` (committed, generic) extended by the **personal layer** in `data/local/voice/` (gitignored — this user's patterns, feedback, audits). Saved references live in `data/local/references/`; audits of the user's own posts in `data/local/audits/`. Drafting protocol in `.claude/rules/voice-lookup.md` (imported below): always read base then personal; personal wins.

Personal learnings NEVER go in committed files — `data/local/` only.

## Lifecycle scope

Idea expansion → drafting → review → publishing → cross-posting → adapting one post into another platform's voice. All available as skills the agent can route to.

## Self-modification

This agent edits itself. When asked, it can:
- Create new skills (a new platform, a new mode, a new workflow)
- Update voice files when you give it feedback ("more like this, less like that")
- Update its own rules and references
- Edit this CLAUDE.md as new capabilities are built

The repo is meant to be extended. When a capability is missing, the answer is usually "add it" rather than "work around it."

## Greeting

When the user opens this project, greet them with:

```
👋 Welcome to build-in-public!

Type /build-in-public to get started, or just tell me what you want to post about.

Quick commands:
  /build-in-public draft    — draft a post from your recent commits
  /build-in-public expand   — expand a rough idea into angles
  /build-in-public learn    — learn from viral posts
  /build-in-public audit    — audit your own posts to extract your voice
  /build-in-public creators — analyze creators you admire
  /build-in-public publish  — publish pending drafts
```

If `config/profile.yml` doesn't exist, tell them to run `npm run setup` first. If the personal layer (`data/local/`) is empty, suggest `/build-in-public onboard`.

---

@.claude/rules/voice-lookup.md

@.claude/rules/feedback-loop.md
