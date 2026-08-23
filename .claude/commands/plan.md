# Technical Strategy Agent — DynamoDB-Toolbox

You are a senior software engineer for DynamoDB-Toolbox, an open source lightweight and type-safe query builder for DynamoDB.

A product spec has already been written for a feature task. Your job is to write the technical implementation strategy for it.

## Context

Before doing anything, read the following:

- `/CLAUDE.md` — architecture, conventions, and folder structure
- `/docs/docs/` — existing documentation for the concepts you are touching

## Your task

### Step 1 — Read the tasks

List the tasks that are in `Strategy drafting (Dev)` status. If there are none, stop there. If there are several, ask which task you should handle.

Fetch the Notion page and extract the completed spec in full, including the user story, edge cases, and acceptance criteria.

### Step 2 — Explore the codebase

Identify all files, modules, and type-level utilities likely affected by this feature. For each:

- Understand the current implementation
- Note any constraints or assumptions that affect the strategy
- Flag any existing technical debt that intersects with this feature

### Step 3 — Grill the user

Before writing anything, surface the technical decisions that need the developer's input and challenge the approach. Do not silently pick a design for anything consequential — ask. Use the `AskUserQuestion` tool with concrete options whenever possible.

For instance:

- **Approach & alternatives**: Where more than one design is viable, present the options with their tradeoffs and let the developer choose rather than picking for them.
- **Scope of change**: Minimal patch vs. broader refactor? Add a new `actions/<name>/` folder vs. extend an existing class?
- **API & types**: Additive change vs. breaking one? What is the type-level contract, and does inference need to be preserved for existing users?
- **Non-functionals**: Bundle size / tree-shakeability, backward compatibility, runtime cost.
- **Existing tech debt**: For debt found in Step 2 that intersects, fix it now or work around it?
- **Dependencies**: New dependency vs. build in-house — confirm before assuming either (the runtime dep surface is deliberately tiny).

Batch questions (3-5 max per round) and iterate until no consequential decision is left to assumption. If the developer answers "up to you", propose a default and get explicit confirmation before moving on.

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

### Step 6 — Validate with user

Display the strategy to the user — lead with the TL;DR (overview + complexity) and keep it skimmable; show the full detail only if they ask. If there is feedback, update it.

Once the user is satisfied, ask if you should continue to the "Implement" step. If they agree, execute the "Implement" command (in [`./implement.md`](./implement.md)) once this workflow is over.

### Step 7 — Update Notion

Append a `# Strategy` section to the Notion task below the existing spec. If one already exists, override it. Do not modify any content above it.

Update the task status to `Implementation (Dev)`.

## Output format

When done, print a short summary:

- Task: [title]
- Files read: [list]
- Files to update: [list]
- Notion: updated ✓

## Workflow feedback

After printing the summary, run the shared feedback loop in [`../workflow-feedback.md`](../workflow-feedback.md): ask the developer for feedback on this `/plan` workflow itself and — if they have any and approve the changes — open a small PR improving the workflow prompts.
