# `transactWrite` — `execute` (`executeTransactWrite`)

Runs a `TransactWriteItems` call from a mix of write transactions: [`PutTransaction`](../transactPut/CLAUDE.md), [`UpdateTransaction`](../transactUpdate/CLAUDE.md), [`DeleteTransaction`](../transactDelete/CLAUDE.md), and [`ConditionCheck`](../transactCheck/CLAUDE.md). All-or-nothing atomic.

```ts
await executeTransactWrite(
  User.build(PutTransaction).item(user),
  Account.build(UpdateTransaction).item({ id: '1', balance: $subtract(100) }),
  Account.build(ConditionCheck).key({ id: '2' }).condition({ attr: 'balance', gte: 100 })
)
```

## Files

- `execute.ts` — `execute` / `executeTransactWrite`; `ExecuteTransactWriteInput/Options/Responses` types. Options include `clientRequestToken` (idempotency), `capacity`, `metrics`. This is the executor; the per-item entries live in the sibling `transact*` folders.
- `transaction.ts` — shared write-transaction typing.
- `isTransactionCancelled.ts` — root-exported type-guard narrowing a caught `unknown` to a `TransactionCanceledException` whose `CancellationReasons` are a positional tuple aligned with `transactions`. Augments each reason in place (best-effort `unmarshall` + format with the positional entity), lazily, on call. `+ TransactionCancelledError` type.
- `assertTransactionCancelled.ts` — assertion counterpart: re-throws non-transaction errors, otherwise augments (via the guard) + narrows.
