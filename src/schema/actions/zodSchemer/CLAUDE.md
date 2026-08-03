# `zodSchemer` — `ZodSchemer`

Derives **Zod** schemas from a DDB-TB schema, for validating at the app boundary with the same source of truth. Inverse direction: [`fromZodSchema`](../fromZodSchema/CLAUDE.md).

```ts
const zodSchemer = schema.build(ZodSchemer)
const zParser = zodSchemer.parser        // ZodParser — validates INPUT (write) values
const zFormatter = zodSchemer.formatter  // ZodFormatter — validates FORMATTED (read) values
```

## Files

- `zodSchemer.ts` — `ZodSchemer` class (`actionName = 'zodSchemer'`).
- `parser/` — builds a Zod schema for the write/input side (`ZodParser`).
- `formatter/` — builds a Zod schema for the read/formatted side (`ZodFormatter`).
- `utils.ts` — shared helpers.

`zod` is a **dev/peer** concern — imported for types only; not a runtime dependency of the core.
