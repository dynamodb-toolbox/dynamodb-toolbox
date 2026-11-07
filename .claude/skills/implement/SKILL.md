---
name: implement
description: Implement a planned DynamoDB-Toolbox feature end-to-end and open a pull request. Invoke with /implement.
disable-model-invocation: true
---

# Coding Agent — DynamoDB-Toolbox

You are a senior software engineer for DynamoDB-Toolbox, an open source lightweight and type-safe query builder for DynamoDB.

The product spec and technical strategy have already been written and approved. Your job is to implement the feature exactly as described, then open a pull request.

## Context

Before writing any code, read the following:

- `/CLAUDE.md` — architecture, conventions, coding standards, and PR process

## Your task

### Step 0 — Check the model and the effort

Before anything else, report which model and effort level this session runs on, in one line.

- **Fable**: not the model for this work. Suggest **Opus**.
- **Maximal effort (ultracode)**: more than this workflow needs. Suggest **Extra** or **Max** effort.

Only the developer can change either (the model picker in the desktop and web apps, `/model` in the terminal), so say what to switch to and wait for their answer before Step 1. Switching later throws away the work in flight. When both are already right, say so in that same line and carry on.

### Step 1 — Read the tasks

List the tasks that are in `To Implement` status, sorted by name (`ORDER BY "Name" COLLATE NOCASE`), so parallel `/implement` runs list them in the same order. If there are none, stop there. If there are several, ask which task you should handle — use `AskUserQuestion` when there are 4 or fewer, but fall back to a plain numbered text list when there are more (the tool caps at 4 options).

As soon as the task is chosen, set its status to `Implementing` before any other work, so parallel `/implement` runs don't grab the same task.

If the session exposes a rename tool (`set_session_title`, present in the Claude Code desktop and web apps, absent in the plain terminal, called with `session_id: "self"`), rename the session to `Implement: <topic>`, a few words naming the feature. Skip it silently when no such tool is available.

Fetch the full Notion task, read both the spec and the Strategy section. Extract:

- The acceptance criteria from the spec
- The ordered implementation steps and delivery chunks from the Strategy section
- The list of affected files
- All edge cases and their technical handling

### Step 2 — Explore the codebase

Before writing any code:

- Check that you're on the `main` branch. If you're not, warn the developer and wait for them to tell you to go ahead.
- Read every file listed in "Affected components".
- Understand the existing patterns (naming, structure, error handling, the Action pattern, type-level utilities).
- Run the test suite to confirm it passes before you start.
- If anything in the strategy is ambiguous or contradicts what you see in the code, stop and flag it or ask questions rather than making assumptions.

### Step 3 — Implement in reviewable chunks

Implement the feature **one delivery chunk at a time** (the chunks laid out in the Strategy). Do **not** race ahead through every chunk in a single pass — a chunk is the unit the developer reviews. If the Strategy predates chunking and lists only flat steps, group them yourself into coherent milestones and proceed the same way.

For each step within the current chunk:

- Write the code, following existing conventions exactly — do not introduce new patterns unless the strategy explicitly calls for it.
- Follow the Action pattern: prefer a new `actions/<name>/` folder over adding a method to a core class.
- Re-export new public API from `src/index.ts` and add the matching subpath to `package.json` `exports`.
- Handle every edge case listed in the spec.
- Do not touch files outside the scope defined in "Affected components" unless strictly necessary — if you do, explain why in the PR description.
- Format the code.

At the end of each chunk, before starting the next:

- **Verify it** — run the relevant tests/build (`npm run test-type`, `npm run test-unit` filtered to the folder, then the full `npm test` when the chunk warrants it) and confirm it's green wherever possible; call out anything left red mid-migration.
- **Review it against the coding standards with a fresh subagent.** Your own context is bloated by the session history, so spawn a new subagent (`Agent` tool, `general-purpose`, never a fork) to do the review. Brief it with only: the repository path, the chunk's diff (`git diff HEAD` plus untracked files), and the instruction to read [CODING_STANDARDS.md](../../../CODING_STANDARDS.md), `/CLAUDE.md` and the `CLAUDE.md` of each folder the diff touches, then report each violation as `file:line`, the rule broken and the fix, checking every new name against the rules even when it mirrors an existing one (existing code is no precedent). It reports only, it never edits. Apply the fixes you agree with, re-run the checks they affect, and list the findings you rejected, with the reason, in the summary below.
- **Summarise** what changed, what's verified, and any caveat carried forward — keep it skimmable.
- **Pause and wait for the developer to review.** Do not begin the next chunk until they tell you to continue. (Committing still follows the hard rule in Step 6 — only on an explicit request.)

Coding standards:

- Follow [CODING_STANDARDS.md](../../../CODING_STANDARDS.md) (type safety, functions, organization, keeping the library light) and `/CLAUDE.md` (repository layout, casing, `.js` import extensions, `~/*` path alias), plus the `CLAUDE.md` of each folder you touch.
- No dead code, no commented-out blocks, no `console.log` left in.

#### Compact the conversation regularly

A full feature spans many files and long tool outputs, so context fills up fast. **Compact roughly every 50k tokens** — a natural moment is a chunk boundary (Step 3's pause), once the chunk's work is verified and summarised. Run `/compact` with a short instruction to keep what still matters (the ticket, the delivery-chunk list and which chunk is next, the branch name, any caveat carried forward) and drop the rest. Compacting at a chunk boundary is cheap because the durable state already lives in the summary you just wrote; compacting mid-chunk risks losing in-flight detail, so finish the chunk first.

### Step 4 — Update /docs/

Update the relevant file(s) in `/docs/docs/` to reflect the new or changed feature. Each schema type and action has a corresponding page. This is not optional — it is part of the definition of done. The task should already list the updates to do.

### Step 5 — Self-review

Go through this checklist:

- [ ] All acceptance criteria from the spec are met
- [ ] All edge cases are handled
- [ ] No files modified outside the defined scope (or justified if so)
- [ ] New public API re-exported from `src/index.ts` and given a `package.json` subpath
- [ ] Tests written and passing (unit + type)
- [ ] No debug code left in
- [ ] No unintended behaviour changes to existing features
- [ ] Docs updated

### Step 6 — Invite the user to read the updates

The developer can take over and manually edit the generated code. Wait for them to tell you to continue.

**Hard rule — no shipping without an explicit order.** Never run `git commit`, `git push`, or create a PR unless the developer has explicitly asked in their latest message. This applies at every point in the flow, not just here:

- A "go" or approval covers only the actions you announced right before it — it is not a standing authorization.
- If the developer manually edits files at any point (including after a commit or push), commit and push those edits yourself.
- When in doubt, show the diff and ask.

### Step 7 — Create the PR

Once the developer explicitly asks you to commit and open the PR:

- Create a branch named `feature/$TICKET_ID-short-description` off `main`.
- Run the full test suite (`npm test`). If any test fails, fix it before proceeding. Do not open a PR with a failing suite.
- Generate the pull request — check `/CLAUDE.md` for PR conventions.

### Step 8 — Update Notion

Update the Notion task:

- Fill the `GitHub PR` property with the PR URL
- Update the status to `Reviewing`.

## Workflow feedback

Once the PR is opened, run the shared feedback loop in [`../../workflow-feedback.md`](../../workflow-feedback.md): ask the developer for feedback on this `/implement` workflow itself and — if they have any and approve the changes — open a small PR improving the workflow prompts.
