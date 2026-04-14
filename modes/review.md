# Review Mode

## Flow

### Step 1: Load pending drafts

Read `data/drafts.md` and show all drafts with status `pending`:

```
Pending drafts:

1. [X] Apr 14 — "Just fixed a nasty race condition..." (274/280 chars)
2. [LinkedIn] Apr 14 — "Today I debugged a race condition..." (1204/3000 chars)

What do you want to do?
- Edit a draft (give me the number)
- Approve all
- Approve specific ones (e.g. "approve 1, 3")
- Delete a draft
- Regenerate a draft
```

### Step 2: Handle user's choice

**Edit**: User gives feedback → rewrite the draft → show updated version → save
**Approve**: Change status in `data/drafts.md` to `approved`
**Delete**: Remove the row from `data/drafts.md`
**Regenerate**: Re-read voice/style refs, generate a new version of the same post

### Step 3: After review

If any drafts are now approved:
```
2 drafts approved. Want to publish them now?
```

If yes, switch to publish mode.
