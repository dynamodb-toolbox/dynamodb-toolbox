---
sidebar_position: 6
title: Custom Parameters and Clauses
---

# Adding Custom Parameters and Clauses

This library supports all API options for the available API methods, so it is unnecessary for you to provide additional parameters. However, if you would like to pass custom parameters, simply pass them in an object as the last parameter to any appropriate method.

```typescript
const result = await MyEntity.update(
  item, // the item to update
  { ..options... }, // method options
  { // your custom parameters
    ReturnConsumedCapacity: 'TOTAL',
    ReturnValues: 'ALL_NEW'
  }
)
```

For the `update` method, you can add additional statements to the clauses by specifying arrays as the `SET`, `ADD`, `REMOVE` and `DELETE` properties. You can also specify additional `ExpressionAttributeNames` and `ExpressionAttributeValues` with object values and the system will merge them in with the generated ones.

```typescript
const results = await MyEntity.update(
  item,
  {},
  {
    SET: ['#somefield = :somevalue'],
    ExpressionAttributeNames: { '#somefield': 'somefield' },
    ExpressionAttributeValues: { ':somevalue': 123 }
  }
)
```
