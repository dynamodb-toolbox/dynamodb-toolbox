# `transactCheck` — `ConditionCheck`

Builds a **condition-check** entry for a `TransactWriteItems` call: asserts a condition on an item without writing it, aborting the whole transaction if it fails. Run via `executeTransactWrite`.

```ts
const check = Account.build(ConditionCheck)
  .key({ id: '1' })
  .condition({ attr: 'balance', gte: 100 })
```

## Files

- `conditionCheck.ts` — `ConditionCheck` class.
- `options.ts` — `ConditionCheckOptions`.
- `constants.ts`.
