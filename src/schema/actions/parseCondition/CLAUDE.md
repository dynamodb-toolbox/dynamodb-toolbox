# `parseCondition` — `ConditionParser`

Compiles a type-safe `SchemaCondition` into a DynamoDB `ConditionExpression` string plus `ExpressionAttributeNames` / `ExpressionAttributeValues`.

```ts
const parser = schema.build(ConditionParser)
const { ConditionExpression, ExpressionAttributeNames, ExpressionAttributeValues } =
  parser.parse({ attr: 'age', gte: 18 })
```

Used by every command that accepts a `condition` (put/update/delete, transactions, `transactCheck`) and by `query`/`scan` filters.

## Files

- `conditionParser.ts` — `ConditionParser` class (`actionName = 'parseCondition'`) + `ParseConditionOptions`.
- `condition.ts` — the `SchemaCondition` type: the full grammar of supported operators.
- `types.ts` — `ConditionExpression` output type.
- `expressCondition/` — turns a parsed condition into the expression string + name/value maps.
- `transformCondition/` — applies schema transformers to condition operands so comparisons match stored values.

## Supported operators (see the `*.unit.test.ts` per operator)

comparisons (`eq/ne/lt/lte/gt/gte`), `between`, `beginsWith`, `contains`, `in`, `exists`, `attr`/`size`, logical `and`/`or`/`not`.
