# `batchWrite` — `BatchWriteCommand` + `execute`

Groups entity-level batch put/delete requests (`BatchPutRequest` / `BatchDeleteRequest`) into a single-table `BatchWriteItem` call. The standalone `execute` (exported `executeBatchWrite`) runs commands across tables with pagination + `UnprocessedItems` retries.

```ts
const command = MyTable.build(BatchWriteCommand).requests(
  User.build(BatchPutRequest).item(user),
  User.build(BatchDeleteRequest).key({ id: '9' })
)
await executeBatchWrite(command)
```

## Files

- `batchWriteCommand.ts` — `BatchWriteCommand` (a `TableAction`); `BatchWriteCommandOptions`.
- `execute.ts` — `execute` / `executeBatchWrite`; `ExecuteBatchWriteInput/Options` types.
- `constants.ts`.

`BatchWriteItem` has no conditions and no per-item return values — use transactions for those.
