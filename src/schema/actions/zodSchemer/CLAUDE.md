# `zodSchemer` — `ZodSchemer`

Derives **zod** schemas from a DDB-TB schema, for validating at the app boundary with the same source of truth. Inverse direction: [`fromZodSchema`](../fromZodSchema/CLAUDE.md).

zod ships two major versions in one package, under the `zod/v3` and `zod/v4` permalinks, so the action has one implementation per version:

- [`v3/`](./v3/CLAUDE.md) — `dynamodb-toolbox/schema/actions/zodSchemer/v3`
- [`v4/`](./v4/CLAUDE.md) — `dynamodb-toolbox/schema/actions/zodSchemer/v4`

## Files

- `index.ts` — the `dynamodb-toolbox/schema/actions/zodSchemer` subpath, kept as a **deprecated** alias of `v3/` so existing imports keep working. It re-declares `ZodSchemer`, `ZodParser` and `ZodFormatter` rather than re-exporting them, which is what carries the `@deprecated` tag to consumers. `ZodSchemer` is a class, hence the const + type pair.

Both versions build their own copy of the Zod issue message raised when a custom validator rejects a value, mirroring the `parse` action's `parsing.customValidationFailed` wording. The duplication is deliberate: a shared helper would couple the two version folders (and a third action) for one template literal.

`zod` is a **dev/peer** concern — imported for types only; not a runtime dependency of the core.
