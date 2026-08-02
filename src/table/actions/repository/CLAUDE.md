# `repository` — `TableRepository`

Ergonomic wrapper exposing the table's actions as plain methods, so callers don't build each command class by hand. A thin convenience facade over `query`/`scan`/`batchGet`/`batchWrite`/etc.

```ts
const repo = MyTable.build(TableRepository)
await repo.query({ partition: 'USER#1' })
```

## Files

- `repository.ts` — `TableRepository` class (a `TableAction`).

Mirror of `entity/actions/repository`.
