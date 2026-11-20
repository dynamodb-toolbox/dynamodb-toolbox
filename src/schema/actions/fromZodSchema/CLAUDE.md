# `fromZodSchema` — `fromZodSchema`

Converts a **zod** schema into a DDB-TB schema, so an existing zod-defined model can drive DynamoDB. Inverse direction: [`zodSchemer`](../zodSchemer/CLAUDE.md).

zod ships two major versions in one package, under the `zod/v3` and `zod/v4` permalinks, so the action has one implementation per version:

- [`v3/`](./v3/CLAUDE.md) — `dynamodb-toolbox/schema/actions/fromZodSchema/v3`
- [`v4/`](./v4/CLAUDE.md) — `dynamodb-toolbox/schema/actions/fromZodSchema/v4`

## Files

- `index.ts` — the `dynamodb-toolbox/schema/actions/fromZodSchema` subpath, kept as a **deprecated** alias of `v3/` so existing imports keep working. It re-declares `fromZodSchema`, `FromZodSchema` and `FromZodSchemaRec` rather than re-exporting them, which is what carries the `@deprecated` tag to consumers.
- `errors.ts` — the `fromZodSchema.*` error codes, raised by both implementations and wired into the error union by `../errors.ts`. It stays here because the codes are shared: neither version namespaces its own.
