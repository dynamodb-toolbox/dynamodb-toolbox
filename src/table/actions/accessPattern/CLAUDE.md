# `accessPattern` — `AccessPattern` (`TableAccessPattern`)

A reusable, named query/scan pattern: bind a typed input schema + a transform that maps input → a `query`/`scan` command. Encodes single-table-design access patterns once, call them by name with type safety.

Exported at the root as `TableAccessPattern` / `ITableAccessPattern` (there's a parallel `EntityAccessPattern`).

```ts
const usersByEmail = MyTable
  .build(AccessPattern)
  .schema(map({ email: string() }))
  .pattern(({ email }) => ({ index: 'GSI1', partition: email }))

const { Items } = await usersByEmail.query({ email: 'a@b.c' }).send()
```

## Files

- `accessPattern.ts` — `AccessPattern` class (a `TableAction`).
- `constants.ts`.
