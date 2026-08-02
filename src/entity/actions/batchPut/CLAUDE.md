# `batchPut` — `BatchPutRequest`

Builds a single-item **put request** (parsing/transforming the item) to be grouped by the table's `BatchWriteCommand` and run via `executeBatchWrite`. Not sendable on its own.

```ts
const req = User.build(BatchPutRequest).item({ id: '1', name: 'Jane' })
```

## Files

- `batchPutRequest.ts` — `BatchPutRequest` class.
- `constants.ts`.

No conditions (BatchWriteItem limitation). See `table/actions/batchWrite`.
