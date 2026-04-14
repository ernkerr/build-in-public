# History Mode

## Flow

Read `data/published.md` and display the user's publication history.

```
Published posts:

| # | Date | Platform | Content | URL |
|---|------|----------|---------|-----|
| 5 | Apr 14 | x | "Just shipped cross-platform..." | x.com/i/status/... |
| 4 | Apr 13 | linkedin | "This week I built..." | linkedin.com/feed/... |
| 3 | Apr 13 | bluesky | "shipped a thing today..." | bsky.app/... |
| 2 | Apr 11 | x | "Day 12 of building..." | x.com/i/status/... |
| 1 | Apr 10 | x | "Started a new project..." | x.com/i/status/... |

5 posts published across 3 platforms.
Last post: 1 day ago.
```

If the user asks about engagement or performance, check if there's data in the Engagement column. If not:

```
I don't have engagement data yet. You can add it manually by editing data/published.md,
or I can check your recent posts if you have API access configured.
```

The user can also ask:
- "What did I post last week?" → filter by date
- "Show me my X posts" → filter by platform
- "Which posts did best?" → sort by engagement if available
