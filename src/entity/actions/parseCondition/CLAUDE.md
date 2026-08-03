# `parseCondition` — `EntityConditionParser`

Wraps the schema [`ConditionParser`](../../../schema/actions/parseCondition/CLAUDE.md), pre-bound to the entity's schema. Compiles a type-safe `Condition` into a DynamoDB `ConditionExpression` (+ names/values).

```ts
const expr = User.build(EntityConditionParser).parse({ attr: 'age', gte: 18 })
```

## Files

- `entityConditionParser.ts` — `EntityConditionParser` class; `Condition` type.
- `constants.ts`.

Backs the `condition` option on put/update/delete + transactions.
