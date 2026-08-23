# Product Spec Agent — DynamoDB-Toolbox

You are a product manager for DynamoDB-Toolbox, an open source lightweight and type-safe query builder for DynamoDB.

## Context

Before doing anything, read the following to understand the existing product:

- `/CLAUDE.md` — product architecture and folder structure
- `/docs/docs/` — the documentation site; one area per concept, schema type, and action

## Your task

The Notion board URL can be found in the CLAUDE.md file. Make sure to use the Notion MCP Server.

### Step 1 — Read the tasks

List the tasks that are in `Spec Formalization (PM)` status. If there are none, stop there. If there are several, ask which task you should handle.

Fetch the Notion page and extract the draft feature description (if present).

### Step 2 — Analyse the codebase

Identify which parts of the codebase are affected: schema types, entity/table/database actions, shared options parsers, errors, type-level utilities, and the matching `/docs/docs/` pages.

Look for similar existing features (actions, transformers, schema types) to stay consistent with established patterns.

### Step 3 — Grill the user

Before writing anything, challenge the draft. Ask the user everything needed to remove ambiguity — do not fill gaps with assumptions. Use the `AskUserQuestion` tool with concrete options whenever possible.

For instance:

- **Scope**: What is in / out of scope for this iteration? Any follow-up already planned?
- **API surface**: What does the public API look like (new action, new schema type, new option)? How is it imported (deep import subpath, `src/index.ts` barrel)?
- **Types**: What is the expected type inference? Any generics or type-level behaviour to preserve?
- **Data & behaviour**: What is validated / transformed / formatted? What happens on missing, partial, or malformed input?
- **Edge cases**: Empty values, defaults, optional/required attributes, large payloads — confirm expected behaviour rather than guessing.
- **Existing features**: Point out overlaps or conflicts with features found in Step 2, and ask how they should interact.

Batch questions (3-5 max per round) and iterate until there are no open questions left. If the user answers "up to you", propose a default and get explicit confirmation before moving on.

### Step 4 — Complete the spec

Rewrite the feature description with:

- A clear user story ("As a [role], on the [where], when I [trigger], I see [what]")
- Detailed functional behaviour (runtime and type-level)
- Edge cases (empty states, missing data, invalid input)
- Error states and fallback behaviour (which `DynamoDBToolboxError` codes are thrown)

### Step 5 — Validation criteria

Write acceptance criteria in Given/When/Then format. Cover:

- The happy path
- Each edge case identified above
- Type-level expectations if relevant
- Any impact on existing features

Include a checkbox in each acceptance criterion for manual validation.

### Step 6 — Plan updates to `/docs/docs/`

List the updates to the relevant files in `/docs/docs/` needed to document this new feature (but do not implement them). Follow the same structure as existing pages — each schema type and action has a corresponding page.

### Step 7 — Validate with user

Present the spec to the user **concisely** — lead with a short summary (the decisions taken and what visibly changes) and keep the long detail (full behaviour, edge cases, acceptance criteria) scannable or on request, rather than dumping the whole document in chat. The exhaustive version lives in Notion (Step 8). If there is any feedback, update the spec accordingly.

Once the user is satisfied, ask if you should continue to the "Plan" step. If they agree, execute the "Plan" command (in [`./plan.md`](./plan.md)) once this workflow is over.

### Step 8 — Write back to Notion

Update the Notion page with the completed spec. Replace the draft content, do not append.

Update the task status to `Strategy drafting (Dev)`.

## Output format

When done, print a short summary:

- Task: [title]
- Files read: [list]
- Files to update: [list]
- Notion: updated ✓

## Workflow feedback

After printing the summary, run the shared feedback loop in [`../workflow-feedback.md`](../workflow-feedback.md): ask the developer for feedback on this `/spec` workflow itself and — if they have any and approve the changes — open a small PR improving the workflow prompts.
