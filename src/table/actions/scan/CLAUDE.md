# `scan` — `ScanCommand`

Scans the entire table (or a secondary index) and formats items per matching entity. Sendable, paginated, supports parallel segments.

`.paginate(documentClientOptions?)` (on `IScanCommand`) returns a lazy `AsyncIterableIterator<ScanResponse>` that loops `.send()` internally, rolling each response's `LastEvaluatedKey` into the next `exclusiveStartKey` — yields ≥1 batch, reuses the spy/abort path, and is compatible with parallel `segment` / `totalSegments`. In this mode `maxPages` is the DDB-pages-per-yielded-batch size (not a global cap).

```ts
const { Items } = await table
  .build(ScanCommand)
  .entities(User, Order)
  .options({ limit: 100, segment: 0, totalSegments: 4 })
  .send()
```

## Files

- `scanCommand.ts` — `ScanCommand` class (+ `IScanCommand`); `ScanResponse` type.
- `options.ts` — `ScanOptions` (limit, maxPages, index, consistent, select, filters, segment/totalSegments, ...).
- `scanParams/` — builds the raw AWS SDK `ScanCommandInput`.
- `errors.ts`, `constants.ts`.

`maxPages` bounds auto-pagination; `select` / `attributes` control projection.
