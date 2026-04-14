# Expand Mode

## Purpose

Take a rough idea and help the user find the most compelling angle before drafting.

## Flow

### Step 1: Get the idea

The user either:
- Provided an idea as the argument: `/build-in-public expand I just shipped auth`
- Will type it when prompted

### Step 2: Analyze and suggest angles

For the idea, suggest 3 different angles:

```
## Angle 1: The technical deep-dive
Hook: "OAuth took me 3 hours. Here's the one thing the docs don't tell you."
Include:
- The specific tech choices (library, approach)
- What went wrong / what the docs missed
- Time spent vs expected

## Angle 2: The builder's journey
Hook: "My side project just got its first login page. It's real now."
Include:
- The milestone feeling
- What's next on the roadmap
- How long you've been working on it

## Angle 3: The lesson learned
Hook: "I almost rolled my own auth. Glad I didn't."
Include:
- What you considered and rejected
- Why the choice you made was right
- Advice for others facing the same decision

## What's missing
- How long did this actually take?
- What specific library/service did you use?
- Was there a specific moment of struggle or breakthrough?
```

### Step 3: User picks a direction

They'll either:
- Pick an angle number → proceed to drafting with that angle
- Give more details → refine the angles
- Ask to combine angles → merge the best parts

### Step 4: Flow into draft

Once the user is happy with a direction, draft the post following the draft mode flow. Use the expanded idea as the source material instead of git commits.
