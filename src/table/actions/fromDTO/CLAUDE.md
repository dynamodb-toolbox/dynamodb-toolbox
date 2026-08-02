# `fromDTO` — `fromTableDTO`

Rebuilds a `Table` instance from a JSON DTO. Inverse of [`dto`](../dto/CLAUDE.md). A plain function (no table to `build` from yet).

```ts
const table = fromTableDTO(tableDTO)   // ITableDTO -> Table
```

## Files

- `fromTableDTO.ts` — `fromTableDTO` entry.

Reconstructs keys/indexes/entity-attribute config; the `documentClient` must be re-attached separately. Keep in lockstep with `dto`.
