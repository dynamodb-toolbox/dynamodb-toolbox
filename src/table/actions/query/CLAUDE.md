# `query` — `QueryCommand`

Queries a partition on the table's primary key or a secondary index, then formats matched items per the entity each belongs to. Sendable (`.send()`), paginated.

```ts
const { Items } = await table
  .build(QueryCommand)
  .query({ partition: 'USER#123', range: { beginsWith: 'ORDER#' } })
  .entities(User, Order)          // narrow + type the returned items
  .options({ limit: 20, index: 'GSI1' })
  .send()
```

## Files

- `queryCommand.ts` — `QueryCommand` class (+ `IQueryCommand` interface); `Query`, `QueryResponse` types.
- `options.ts` — `QueryOptions` (limit, index, consistent, select, filters, exclusiveStartKey, ...).
- `queryParams/` — builds the raw AWS SDK `QueryCommandInput` (key condition + filter expressions).
- `types.ts` — `Query` input grammar (`partition` / `range` operators).
- `errors.ts`, `constants.ts`.

Cross-entity: results are formatted using whichever entity matches each item's entity attribute (`.entities(...)` narrows the set).
