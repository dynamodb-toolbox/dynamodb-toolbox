# Workflow Feedback Loop

A shared routine referenced from the end of the workflow commands (`/spec`, `/plan`, `/implement`). Its purpose is **continuous improvement of the workflow commands themselves** — each run is a chance to refine the prompts based on what felt clunky, missing, or wrong.

Run this only once the main task is finished and Notion has been updated.

## Step 1 — Ask for feedback on the workflow

Ask the developer whether they have any feedback on the **workflow itself** — this command's prompt, its steps, their ordering, anything that was unclear, redundant, or missing. Make it explicit that you are asking about the *process*, not the feature you just delivered.

Use the `AskUserQuestion` tool, e.g. "No, all good" / "Yes, I have some feedback".

- If they have no feedback, thank them and stop. Do not create or change anything.

## Step 2 — Turn the feedback into concrete edits

If they do have feedback:

- Identify which file(s) it affects: `.claude/skills/spec/SKILL.md`, `.claude/skills/plan/SKILL.md`, `.claude/skills/implement/SKILL.md`, this file (`.claude/workflow-feedback.md`), or `/CLAUDE.md`.
- Draft the **smallest** edit that captures the feedback. Preserve the existing tone and structure — make surgical changes, do not rewrite whole sections.
- Show the proposed diff and explain each change in one line.
- Iterate with the developer until they are happy. If a piece of feedback is ambiguous, ask rather than guess.

## Step 3 — Open a small PR (only if the developer approves)

**Hard rule — no shipping without an explicit order.** Only once the developer has explicitly confirmed they are happy with the proposed edits:

- This is a **meta change to the workflow, kept isolated from any feature work.** Do **not** commit these edits onto the current feature branch — they would pollute the feature PR.
- From `main`, make sure it is up to date, then create a dedicated branch off `main`:
  ```bash
  git checkout main
  git pull --ff-only
  git checkout -b chore/workflow-<slug>
  ```
- Apply the edits there, commit, push, and open the PR.
- Keep the PR **small and focused** — only the workflow files, nothing else.
- PR title follows Conventional Commits (see `/CLAUDE.md`). Prompt/doc tweaks use `docs:` (patch).
- Report the PR URL, then stop.
