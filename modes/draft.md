# Draft Mode

## Flow

### Step 1: Gather context

If the user provided an idea or topic, use that. Otherwise:

1. Run `git log --oneline -10` to see recent commits in the current repo
2. Run `git log --oneline --since="3 days ago"` for recent activity
3. Present the commits to the user:

```
Looking at your recent work...

Recent commits:
- abc1234 feat: add user authentication
- def5678 fix: resolve race condition in queue
- ghi9012 refactor: simplify API routes

What do you want to post about? Or I can suggest an angle.
```

4. If the user says "suggest" or similar, pick the most interesting commit(s) and propose an angle

### Step 2: Read voice and style

1. Read `config/profile.yml` for platforms and preferences
2. Read `data/voice.md` for voice patterns
3. Read `data/style-refs/{platform}.md` for the target platform

### Step 3: Draft the post

Write a draft for the user's PRIMARY platform (first in their platforms list in profile.yml).

Show the draft with character count:

```
Draft for X (274/280 chars):

"Just fixed a nasty race condition in my job queue.

The bug: two workers grabbing the same job. The fix: a single
SELECT...FOR UPDATE. 3 lines of SQL, 2 hours of debugging.

Sometimes the fix is simple. Finding it isn't. #buildinpublic"
```

### Step 4: Get feedback

Ask:
```
Want to:
1. Edit this
2. Publish to X
3. Adapt for [other platforms from profile.yml]
4. Start over
```

- If they want to edit: let them give feedback, redraft
- If they want to publish: switch to publish mode
- If they want to adapt: draft versions for the other platforms, show side by side
- If they want to start over: go back to step 1

### Step 5: Save draft

Save to `data/drafts.md`. Add a new row:

```
| [next #] | [today's date] | [platform] | [content] | pending | |
```

If they adapted to multiple platforms, save each as a separate row with the same date.
