---
title: ParseCondition 👷
sidebar_custom_props:
  sidebarActionType: util
---

# ParseCondition 👷

The `Condition` type and `parseCondition` util are useful to type conditions and build condition expressions:

```ts
import {
  Condition,
  ConditionParser
} from 'dynamodb-toolbox/schema/actions/parseCondition'

const condition: Condition<typeof pokemonEntity> = {
  attr: 'level',
  lte: 42
}

const parsedCondition = parseCondition(
  pokemonEntity,
  condition
)
// => {
//   ConditionExpression: "#c1 <= :c1",
//   ExpressionAttributeNames: { "#c1": "level" },
//   ExpressionAttributeValues: { ":c1": 42 },
// }
```
