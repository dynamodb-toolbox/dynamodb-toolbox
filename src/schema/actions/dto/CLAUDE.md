# `dto` — `SchemaDTO`

Serializes a schema into a plain JSON **DTO** (Data Transfer Object): a portable, self-describing definition that can be stored, sent over the wire, or diffed. Inverse of [`fromDTO`](../fromDTO/CLAUDE.md).

```ts
const dto = schema.build(SchemaDTO).toJSON() // ItemSchemaDTO
```

## Files

- `dto.ts` — `SchemaDTO` class (`actionName = 'dto'`, aliased `DTO`). Constrained to `ItemSchema`.
- `getSchemaDTO/` — per-schema-type recursion building the DTO node for each attribute.
- `types.ts` — DTO types: `ISchemaDTO`, `ItemSchemaDTO`, and transformer DTOs (`StringSchemaTransformerDTO`, `AnySchemaTransformerDTO`, ...).

Transformers must be **serializable** (`SerializableTransformer`, carrying a `transformerId`) to survive the round-trip — see `src/transformers`.

Used by `database`'s `synchronize` and `mcpToolkit` actions to ship schema definitions.
