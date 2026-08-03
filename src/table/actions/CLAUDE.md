# `src/table/actions` — Table actions

Tree-shakable operations on a `Table`, each a class extending `TableAction` (`../table.ts`), bound via `table.build(ActionClass)`. Actions span **all entities** attached to the table (that's why `TableAction` holds the entity list). Each has its own subpath export (`dynamodb-toolbox/table/actions/<name>`).

```ts
const command = table.build(QueryCommand).query({ partition: 'USER#123' })
const { Items } = await command.send()
```

## The actions

| Folder | Export | Purpose |
| --- | --- | --- |
| `query` | `QueryCommand` | Query a partition (primary key or a secondary index), formatting results across entities. |
| `scan` | `ScanCommand` | Scan the whole table / an index. |
| `deletePartition` | `DeletePartitionCommand` | Query then batch-delete every item in a partition. |
| `batchGet` | `BatchGetCommand` + `execute` | Assemble entity `BatchGetRequest`s into a `BatchGetItem` call. |
| `batchWrite` | `BatchWriteCommand` + `execute` | Assemble entity batch put/delete requests into a `BatchWriteItem` call. |
| `accessPattern` | `AccessPattern` | Reusable, named query/scan pattern with a typed input schema. |
| `parsePrimaryKey` | `PrimaryKeyParser` | Validate/extract a table primary key. |
| `spy` | `TableSpy` | Mock/inspect table actions in tests. |
| `repository` | `TableRepository` | Convenience wrapper exposing table actions as methods. |
| `registry` | `Registry` | Registry of entities keyed by their entity attribute. |
| `dto` | `TableDTO` | Serialize a table definition → JSON DTO. |
| `fromDTO` | `fromTableDTO` | Rebuild a table from a DTO. |
| `indexes.ts` | — | Shared index typing (`IndexNames`, `IndexSchema`). |

## Anatomy of a command action

`query`, `scan` and friends share a shape:

- `<name>Command.ts` — the command class (extends `TableAction`, sendable).
- `options.ts` — command options parsing (paired with `src/options`).
- `<name>Params/` — builds the raw AWS SDK input params.
- `constants.ts`, `errors.ts`.

`batchGet` / `batchWrite` additionally export a standalone `execute` (aliased `executeBatchGet` / `executeBatchWrite` at the root) for running the batched request with pagination + retries.

Each action folder has its own `CLAUDE.md`.
