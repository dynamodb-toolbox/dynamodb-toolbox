# `deletePartition` — `DeletePartitionCommand`

Deletes every item in a partition: internally queries the partition, then batch-deletes the matched keys (paginating until drained). Sendable.

```ts
await table
  .build(DeletePartitionCommand)
  .query({ partition: 'USER#123' })
  .send()
```

## Files

- `deletePartitionCommand.ts` — `DeletePartitionCommand` class.
- `options.ts` — `DeletePartitionOptions`; `DeletePartitionResponse` type.
- `constants.ts`.

Composes `query` (find) + `batchWrite` delete under the hood. Not atomic — a best-effort bulk delete, not a transaction.
