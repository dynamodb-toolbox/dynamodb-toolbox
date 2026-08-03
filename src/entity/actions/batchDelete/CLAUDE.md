# `batchDelete` — `BatchDeleteRequest`

Builds a single-item **delete request** (by key) to be grouped by the table's `BatchWriteCommand` and run via `executeBatchWrite`. Not sendable on its own.

```ts
const req = User.build(BatchDeleteRequest).key({ id: '1' })
```

## Files

- `batchDeleteRequest.ts` — `BatchDeleteRequest` class.
- `constants.ts`.

No conditions (BatchWriteItem limitation). See `table/actions/batchWrite`.
