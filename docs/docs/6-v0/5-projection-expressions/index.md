---
sidebar_position: 5
title: Projection Expressions
---

# Projection Expressions

DynamoDB supports [Projection Expressions](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.ProjectionExpressions.html) that allow you to selectively return attributes when using the `get`, `query` or `scan` operations.

The DynamoDB Toolbox provides a **Projection Builder** that allows you to generate `ProjectionExpression`s that automatically generates `ExpressionAttributeNames` as placeholders to avoid reservered word collisions. The library allows you to work with both table attribute names and Entity aliases to specify projections.

Read operations that provide an `attributes` property accept an `array` of attribute names and/or objects that specify the Entity as the key with an array of attributes and aliases.

Retrieve the `pk`,`sk`,`name` and `created` attributes for all items:

```typescript
MyTable.query(
  // ...,
  { attributes: ['pk', 'sk', 'name', 'created'] }
)
```

Retrieve the `user_id`,`status`, and `created` attributes for the `User` entity:

```typescript
MyTable.query(
  // ...,
  { attributes: [{ User: ['user_id', 'status', 'created'] }] }
)
```

Retrieve the `pk`, `sk`, and `type` attributes for all items, the `user_id` for the `User` entity, and the `status` and `created` attributes for the the `Order` entity:

```typescript
MyTable.query(
  // ...
  {
    attributes: ['pk', 'sk', 'type', { User: ['user_id'] }, { Order: ['status', 'created'] }]
  }
)
```

When using the `get` method of an entity, the "entity" is assumed for the attributes. This lets you specify attributes and aliases without needing to use the object reference.

**NOTE:** When specifying entities in `query` and `scan` operations, it's possible that shared attributes will retrieve data for other matching entity types. However, the library attempts to return only the attributes specified for each entity when parsing the response.
