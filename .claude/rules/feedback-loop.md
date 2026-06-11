# Feedback loop

When the user gives feedback on a draft:

1. **Identify scope.** Universal? Platform? Task? First guess will be wrong sometimes — that's expected. State the guess: *"Sounds platform-level (LinkedIn). Saving to `data/local/voice/linkedin/voice.md`?"*

2. **Pick the layer: personal by default.** Feedback about the user's own voice goes in `data/local/voice/` (gitignored, theirs). Only edit the base layer (`data/voice/`) when the user explicitly wants to change a shipped default — e.g. "forks of this repo shouldn't ban em dashes" — and say so out loud when doing it.

3. **Open the most-specific applicable file** in the personal layer (mirror the base path; create the file if it doesn't exist).

4. **Append the learning.** Never overwrite UNLESS the user explicitly says so ("replace that", "scrap that and use this instead", "no, change it to..."). Default = append; overwrite is opt-in per turn.

5. **If feedback is vague** ("I don't like it"): re-consult references for a different structural pattern, propose a re-draft, ask what specifically isn't working. Don't save anything until scope is clear.

6. **Recurrence = promotion.** If the same feedback fires on a second platform, move it up the tree within the personal layer (platform → universal). State the promotion: *"Second time 'too formal' has come up — promoting from `data/local/voice/linkedin/voice.md` to `data/local/voice/voice.md`."*

When in doubt, ask. Default-to-saving is worse than default-to-asking when scope is unclear.
