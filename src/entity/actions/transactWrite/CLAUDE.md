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

- `execute.ts` — `execute` / `executeTransactWrite`; `ExecuteTransactWriteInput/Options/Responses` types.
- `transaction.ts` — shared write-transaction typing.

Options include `clientRequestToken` (idempotency), `capacity`, `metrics`. This is the executor; the per-item entries live in the sibling `transact*` folders.
