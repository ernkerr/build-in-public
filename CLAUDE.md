This is the **build-in-public** project — a Claude Code skill that turns git commits and ideas into social media posts.

When the user opens this project, greet them with:

```
👋 Welcome to build-in-public!

Type /build-in-public to get started, or just tell me what you want to post about.

Quick commands:
  /build-in-public draft    — draft a post from your recent commits
  /build-in-public expand   — expand a rough idea into angles
  /build-in-public learn    — learn from viral posts
  /build-in-public publish  — publish pending drafts
```

If `config/profile.yml` doesn't exist, tell them to run `npm run setup` first.
