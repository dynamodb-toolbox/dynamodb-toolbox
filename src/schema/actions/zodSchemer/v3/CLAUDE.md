# `zodSchemer/v3` — `ZodSchemer` for zod v3

Derives **zod v3** schemas from a DDB-TB schema, for validating at the app boundary with the same source of truth. The sibling [`v4/`](../v4/CLAUDE.md) does the same for zod v4; the two live side by side because zod ships both versions in one package, under the `zod/v3` and `zod/v4` permalinks.

Imported through the `dynamodb-toolbox/schema/actions/zodSchemer/v3` subpath, or through the parent folder's **deprecated** alias. Inverse direction: [`fromZodSchema`](../../fromZodSchema/CLAUDE.md).

```ts
const zodSchemer = schema.build(ZodSchemer)
const zParser = zodSchemer.parser()        // ZodParser — validates INPUT (write) values
const zFormatter = zodSchemer.formatter()  // ZodFormatter — validates FORMATTED (read) values
```

## Files

- `zodSchemer.ts` — `ZodSchemer` class (`actionName = 'zodSchemer'`).
- `parser/` — builds a Zod schema for the write/input side (`ZodParser`).
- `formatter/` — builds a Zod schema for the read/formatted side (`ZodFormatter`).
- `utils.ts` — shared helpers (`withValidate`, `withDescribe`).

`parser/utils.ts` holds the wrappers each type file applies, in this order: `withEncoding` (the schema's transformer), `withAttributeNameEncoding` (`savedAs`), `withValidate`, `withDescribe`, `withDefault`, `withOptional`. Each takes `(schema, zodSchema, options)`, as in v4. `formatter/utils.ts` mirrors it with `withDecoding`, `withAttributeNameDecoding` and `withOptional` — a formatter has no default to apply.

`zod` is a **dev/peer** concern — imported for types only; not a runtime dependency of the core.
