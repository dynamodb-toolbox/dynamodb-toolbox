# `fromDTO` — `fromSchemaDTO`

Rebuilds a live schema from a JSON DTO. Inverse of [`dto`](../dto/CLAUDE.md).

A plain function (not a `SchemaAction` — there's no schema to build *from* yet), aliased `fromDTO`.

```ts
const schema = fromSchemaDTO(itemSchemaDTO)   // ItemSchemaDTO -> ItemSchema
```

## Files

- `fromSchemaDTO.ts` — `fromSchemaDTO` entry.
- `fromSchemaDTO/` — per-schema-type reconstruction, mirroring `dto/getSchemaDTO/`.

Serializable transformers are rehydrated by `transformerId`. Keep in lockstep with `dto`: any DTO shape change must be handled on both sides.
