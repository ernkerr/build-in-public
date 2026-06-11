# Feedback loop

When the user gives feedback on a draft:

1. **Identify scope.** Universal? Platform? Task? First guess will be wrong sometimes — that's expected. State the guess: *"Sounds platform-level (LinkedIn). Saving to `data/local/voice/linkedin/voice.md`?"*

2. **Pick the layer — classify, state it, save.** Two destinations:
   - **Base** (`data/voice/`, committed, ships to forks): generalized craft and platform knowledge that stays true with the user's name removed — platform mechanics ("~5 hashtags max"), hook formats and the psychology behind them, structural principles. The user improving base = improving the product for everyone.
   - **Personal** (`data/local/voice/`): taste, cadence, bans, audience specifics, receipts — anything where "whose rule is this?" answers with a person. ("Sentences don't end in full stops" is personal even though it sounds like a rule.)
   - **Litmus:** would this line make sense in a stranger's instance of this repo? Yes → base. No → personal.
   - **State the classification in one line when saving** (*"Generic hook craft → base `hook.md` (ships with the repo); the fits-you note → your local mirror."*). The user can flip it; flipping is a cut-paste between mirrors.
   - One piece of advice often splits: the general rule → base, the "how this applies to me" annotation → personal. Do both in the same turn.
   - When genuinely ambiguous, default personal — nothing personal can leak from there, and promotion to base stays one move away.

3. **Open the most-specific applicable file** in the personal layer (mirror the base path; create the file if it doesn't exist).

4. **Append the learning.** Never overwrite UNLESS the user explicitly says so ("replace that", "scrap that and use this instead", "no, change it to..."). Default = append; overwrite is opt-in per turn.

5. **If feedback is vague** ("I don't like it"): re-consult references for a different structural pattern, propose a re-draft, ask what specifically isn't working. Don't save anything until scope is clear.

6. **Recurrence = promotion.** If the same feedback fires on a second platform, move it up the tree within the personal layer (platform → universal). State the promotion: *"Second time 'too formal' has come up — promoting from `data/local/voice/linkedin/voice.md` to `data/local/voice/voice.md`."*

When in doubt, ask. Default-to-saving is worse than default-to-asking when scope is unclear.
