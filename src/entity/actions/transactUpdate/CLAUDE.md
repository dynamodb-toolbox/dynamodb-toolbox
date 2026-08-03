# `transactUpdate` — `UpdateTransaction`

Builds an update entry for a `TransactWriteItems` call, using the same update grammar/extensions as [`update`](../update/CLAUDE.md). Run via `executeTransactWrite`. Supports a per-item condition.

```ts
const upd = User.build(UpdateTransaction)
  .item({ id: '1', loginCount: $add(1) })
  .options({ condition: { attr: 'id', exists: true } })
```

## Files

- `updateTransaction.ts` — `UpdateTransaction` class.
- `options.ts` — `UpdateTransactionOptions` (condition).
- `constants.ts`.
