# `batchGet` — `BatchGetCommand` + `execute`

Groups entity-level `BatchGetRequest`s (from `entity/actions/batchGet`) into a single-table `BatchGetItem` call. The standalone `execute` (exported as `executeBatchGet`) runs one or more `BatchGetCommand`s across tables, handling pagination and `UnprocessedKeys` retries.

```ts
const command = MyTable.build(BatchGetCommand).requests(
  User.build(BatchGetRequest).key({ id: '1' }),
  User.build(BatchGetRequest).key({ id: '2' })
)
const { Responses } = await executeBatchGet(command)
```

## Files

- `batchGetCommand.ts` — `BatchGetCommand` (a `TableAction`); `BatchGetCommandOptions`.
- `execute.ts` — `execute` / `executeBatchGet`; `ExecuteBatchGetInput/Options/Responses` types.
- `errors.ts`, `constants.ts`.

Command = per-table grouping; execute = the actual network call + retry loop. Options include `consistent`, `attributes`.
