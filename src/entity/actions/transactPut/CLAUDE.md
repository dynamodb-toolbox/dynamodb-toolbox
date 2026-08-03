# `transactPut` — `PutTransaction`

Builds a put entry for a `TransactWriteItems` call. Run via `executeTransactWrite` (see [`transactWrite`](../transactWrite/CLAUDE.md)). Supports a per-item condition.

```ts
const put = User.build(PutTransaction)
  .item({ id: '1', name: 'Jane' })
  .options({ condition: { attr: 'id', exists: false } })
```

## Files

- `putTransaction.ts` — `PutTransaction` class.
- `options.ts` — `PutTransactionOptions` (condition).
- `constants.ts`.
