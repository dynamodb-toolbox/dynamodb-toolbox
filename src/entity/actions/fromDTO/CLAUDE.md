# `fromDTO` — `fromEntityDTO`

Rebuilds an `Entity` from a JSON DTO. Inverse of [`dto`](../dto/CLAUDE.md). A plain function (no entity to `build` from yet). The DTO carries a serialized `table`, which is rebuilt too.

```ts
const User = fromEntityDTO(entityDTO)   // IEntityDTO -> Entity
```

## Files

- `fromEntityDTO.ts` — `fromEntityDTO` entry (destructures `entityName`, `schema`, `table`, `timestamps`, ... from the DTO).

Rehydrates the item schema (via schema `fromDTO`) + entity config. The `documentClient` is runtime-only and must be re-attached. Keep in lockstep with `dto`.
