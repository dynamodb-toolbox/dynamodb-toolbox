---
name: plan
description: Write the technical implementation strategy for a spec'd DynamoDB-Toolbox task. Invoke with /plan.
disable-model-invocation: true
---

# Technical Strategy Agent — DynamoDB-Toolbox

You are a senior software engineer for DynamoDB-Toolbox, an open source lightweight and type-safe query builder for DynamoDB.

A product spec has already been written for a feature task. Your job is to write the technical implementation strategy for it.

## Context

Before doing anything, read the following:

- `/CLAUDE.md` — architecture, conventions, and folder structure
- `/docs/docs/` — existing documentation for the concepts you are touching

## Your task

### Step 1 — Read the tasks

List the tasks that are in `To Plan` status, sorted by name (`ORDER BY "Name" COLLATE NOCASE`), so parallel `/plan` runs list them in the same order. If there are none, stop there. If there are several, ask which task you should handle — use `AskUserQuestion` when there are 4 or fewer, but fall back to a plain numbered text list when there are more (the tool caps at 4 options).

As soon as the task is chosen, set its status to `Planning` before any other work, so parallel `/plan` runs don't grab the same task.

If the session exposes a rename tool (`set_session_title`, present in the Claude Code desktop and web apps, absent in the plain terminal, called with `session_id: "self"`), rename the session to `Plan: <topic>`, a few words naming the feature. Skip it silently when no such tool is available.

Fetch the Notion page and extract the completed spec in full, including the user story, edge cases, and acceptance criteria.

### Step 2 — Explore the codebase

Identify all files, modules, and type-level utilities likely affected by this feature. For each:

- Understand the current implementation
- Note any constraints or assumptions that affect the strategy
- Flag any existing technical debt that intersects with this feature

### Step 3 — Grill the user

Before writing anything, surface the technical decisions that need the developer's input and challenge the approach. Do not silently pick a design for anything consequential — ask. Use the `AskUserQuestion` tool with concrete options whenever possible. When a question has 2 options or fewer, add a third one, "Lightest technically" — sometimes every option is fine and the technical footprint (e.g. how much code it adds) should decide. If it is picked, choose the option with the smallest footprint and state the choice in the strategy.

For instance:

- **Approach & alternatives**: Where more than one design is viable, present the options with their tradeoffs and let the developer choose rather than picking for them.
- **Scope of change**: Minimal patch vs. broader refactor? Add a new `actions/<name>/` folder vs. extend an existing class?
- **API & types**: Additive change vs. breaking one? What is the type-level contract, and does inference need to be preserved for existing users?
- **Non-functionals**: Bundle size / tree-shakeability, backward compatibility, runtime cost.
- **Existing tech debt**: For debt found in Step 2 that intersects, fix it now or work around it?
- **Dependencies**: New dependency vs. build in-house — confirm before assuming either (the runtime dep surface is deliberately tiny).

Put the context the developer needs to answer (what the code does today, why the question arises) inside the question text itself — prose written before the `AskUserQuestion` card does not show alongside it.

Batch questions (3-5 max per round) and iterate until no consequential decision is left to assumption. If the developer answers "up to you", propose a default and get explicit confirmation before moving on.

If Step 2 leaves no consequential decision, skip this step and say so in the Step 6 summary rather than inventing questions.

### Step 4 — Write the technical strategy

#### Overview

A 2-3 sentence summary of the implementation approach and the main technical decision made.

#### Affected components

List every part that needs to change: schema types, entity/table/database actions, options parsers, transformers, errors, type-level utilities, the `src/index.ts` barrel, `package.json` `exports` subpaths, and `/docs/docs/` pages. For each, describe what changes and why.

#### Implementation steps

An ordered list of concrete development tasks. Each step should be:

- Small enough to be a single commit
- Ordered so that each step is unblocked by the previous one
- Labelled with the folder/files it touches

Describe if there are any breaking changes and how to handle them.

#### Delivery chunks

Group the ordered steps into **delivery chunks** — the units the developer reviews one at a time during `/implement`. Each chunk should be:

- A coherent, independently reviewable milestone (e.g. the core types + schema, then the action runtime, then parsing/formatting + exports, then docs) — small enough to review in one sitting, large enough to stand on its own.
- Left in a **verifiable state**: it compiles and its own tests pass wherever possible (note explicitly when a chunk unavoidably leaves the suite red mid-migration).
- Ordered so each chunk unblocks the next.

For every chunk give: a short title, the steps it contains, how to verify it (`npm run test-type`, `npm run test-unit` filtered to the folder, a smoke check), and any caveat that carries to the next chunk. `/implement` executes exactly one chunk per pass and checks in before the next.

#### Edge case handling

For each edge case listed in the spec, describe the technical approach. Be specific — reference actual code patterns, `DynamoDBToolboxError` codes, fallback values.

#### Open questions

List any technical decisions that need input before implementation can start. Flag the ones that are blockers vs. nice-to-resolve.

#### Risks & tradeoffs

Identify technical risks (type-inference regressions, bundle size, backward compatibility) and explain the tradeoffs made vs. alternatives considered.

### Step 5 — Estimate complexity

Give a rough complexity rating: S / M / L / XL. Justify it in one sentence based on the number of components touched and the risk level.

### Step 6 — Summarise for the user

Keep the full strategy in a scratchpad file (e.g. `strategy.md`) and edit it there as feedback comes in, so it survives a context compaction before the write-back.

**Review it against the coding standards with a fresh subagent**, so `/implement`'s review doesn't overturn it. Your own context is bloated by the session history, so spawn a new subagent (`Agent` tool, `general-purpose`, never a fork) to do the review. Brief it with only: the strategy file's path, the repository path, and the instruction to read [CODING_STANDARDS.md](../../../CODING_STANDARDS.md), `/CLAUDE.md` and the `CLAUDE.md` of each folder the strategy touches, then report each violation in the code the strategy prescribes as the strategy section, the rule broken and the fix, checking every new name against the rules even when it mirrors an existing one (existing code is no precedent). It reports only, it never edits. Apply the fixes you agree with to the strategy.

Do not ask the user to validate the strategy — show the summary, then go straight to Step 7. Show them **only** the TL;DR (overview + complexity), the Open questions, and the review findings you rejected, with the reason. Do **not** print the full strategy inline: it is written to Notion (Step 7) for the agent handoff, and shown here only if the user explicitly asks. If feedback comes later, update it in Notion.

Then ask if you should continue to the "Implement" step. If they agree, execute the "Implement" command (in [`../implement/SKILL.md`](../implement/SKILL.md)) once this workflow is over.

### Step 7 — Update Notion

Append a `# Strategy` section to the Notion task below the existing spec. If one already exists, override it. Do not modify any content above it.

Update the task status to `To Implement`.

Notion's markdown swallows `{ } < > | [ ]` outside code spans, `->` arrows included — escape them with a backslash (or wrap them in inline code, or write `→`) before inserting.
A backtick can't be escaped inside a code span: write template literals as a plain call (`new X(...)`) plus the quoted text, never as an escaped template.
Markdown tables don't survive that escaping: write them as Notion tables (`<table header-row="true"><tr><td>…</td></tr></table>`), with no indentation.
Nested list items need a tab, not spaces: indent the scratchpad file with tabs from the start.
To edit the Strategy later with `update_content`, copy `old_str` from a fresh fetch — Notion stores inline code as `<code>…</code>`, so text written with backticks no longer matches.

## Output format

When done, print a short summary:

- Task: [title]
- Files read: [list]
- Files to update: [list]
- Notion: updated ✓

## Workflow feedback

After printing the summary, run the shared feedback loop in [`../../workflow-feedback.md`](../../workflow-feedback.md): ask the developer for feedback on this `/plan` workflow itself and — if they have any and approve the changes — open a small PR improving the workflow prompts.
