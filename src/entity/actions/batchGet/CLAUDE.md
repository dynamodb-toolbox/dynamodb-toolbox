# `batchGet` — `BatchGetRequest`

Builds a single-item **get request** to be grouped by the table's `BatchGetCommand` and run via `executeBatchGet`. Not sendable on its own.

```ts
const req = User.build(BatchGetRequest).key({ id: '1' })
// -> MyTable.build(BatchGetCommand).requests(req, ...) -> executeBatchGet(...)
```

## Files

- `batchGetRequest.ts` — `BatchGetRequest` class.
- `constants.ts`.

See `table/actions/batchGet` for grouping + execution.
