# `scan` — `ScanCommand`

Scans the entire table (or a secondary index) and formats items per matching entity. Sendable, paginated, supports parallel segments.

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
