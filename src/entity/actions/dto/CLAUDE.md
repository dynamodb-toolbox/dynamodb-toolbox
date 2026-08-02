# `dto` — `EntityDTO`

Serializes an entity definition (name, schema, entity-attribute + timestamps config, key computation) into a plain JSON **DTO**. Inverse of [`fromDTO`](../fromDTO/CLAUDE.md). Used by `database` sync / MCP tooling.

```ts
const dto = User.build(EntityDTO).toJSON()   // IEntityDTO
```

## Files

- `dto.ts` — `EntityDTO` class; `IEntityDTO` type.

Builds on the schema DTO for the item shape. Keep in sync with `fromDTO`.
