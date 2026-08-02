# `transactDelete` — `DeleteTransaction`

Builds a delete entry for a `TransactWriteItems` call. Run via `executeTransactWrite`. Supports a per-item condition.

```ts
const del = User.build(DeleteTransaction)
  .key({ id: '1' })
  .options({ condition: { attr: 'status', eq: 'archived' } })
```

## Files

- `deleteTransaction.ts` — `DeleteTransaction` class.
- `options.ts` — `DeleteTransactionOptions` (condition).
- `constants.ts`.
