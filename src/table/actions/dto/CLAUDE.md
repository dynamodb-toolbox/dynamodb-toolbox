# `dto` — `TableDTO`

Serializes a table definition (keys, indexes, entity-attribute config) into a plain JSON **DTO**. Inverse of [`fromDTO`](../fromDTO/CLAUDE.md). Used by `database` sync / MCP tooling to ship table definitions.

```ts
const dto = MyTable.build(TableDTO).toJSON()   // ITableDTO
```

## Files

- `dto.ts` — `TableDTO` class (a `TableAction`); `ITableDTO` type.

Does **not** serialize the `documentClient` (runtime-only). Keep in sync with `fromDTO`.
