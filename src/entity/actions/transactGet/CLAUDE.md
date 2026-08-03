# `transactGet` — `GetTransaction` + `execute`

Builds a get-item entry for a `TransactGetItems` call. The standalone `execute` (exported `executeTransactGet`) runs a set of `GetTransaction`s atomically and formats each result.

```ts
const { Responses } = await executeTransactGet(
  User.build(GetTransaction).key({ id: '1' }),
  Order.build(GetTransaction).key({ id: '9' })
)
```

## Files

- `transaction.ts` — `GetTransaction` class.
- `getTransaction/` — builds the transaction item params.
- `execute.ts` — `execute` / `executeTransactGet`; `ExecuteTransactGetInput/Options/Responses` types.
