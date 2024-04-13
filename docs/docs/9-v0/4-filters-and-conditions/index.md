---
sidebar_position: 4
title: Filters & Conditions
---

# Filters and Conditions

DynamoDB supports [**Filter**](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Query.html#Query.FilterExpression) and [**Condition**](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.ConditionExpressions.html) expressions. **Filter Expressions** are used to limit data returned by `query` and `scan` operations. **Condition Expressions** are used for data manipulation operations (`put`, `update`, `delete` and `batchWrite`), allowing you to specify a condition to determine which items should be modified.

## Expression Builder

The DynamoDB Toolbox provides an **Expression Builder** that allows you to generate complex filters and conditions based on your Entity definitions. Any method that requires `filters` or `conditions` accepts an `array` of _conditions_, or a single _condition_. _Condition_ objects support the following properties:

| Property   |   Type    | Description                                                                                                                                                                                                                                                                                                                                                                                                       |
| ---------- | :-------: | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| attr       | `string`  | Specifies the attribute to filter on. If an `entity` property is provided (or inherited from the calling operation), aliases can be used. Either `attr` or `size` must be provided.                                                                                                                                                                                                                               |
| size       | `string`  | Specifies which attribute's calculated size to filter on (see [Operators and Functions](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.OperatorsAndFunctions.html#Expressions.OperatorsAndFunctions.Functions) for more information). If an `entity` property is provided (or inherited from the calling operation), aliases can be used. Either `attr` or `size` must be provided. |
| eq         |    \*2    | Specifies value to _equal_ attribute or size of attribute.                                                                                                                                                                                                                                                                                                                                                        |
| ne         |    \*2    | Specifies value to _not equal_ attribute or size of attribute.                                                                                                                                                                                                                                                                                                                                                    |
| lt         |    \*2    | Specifies value for attribute or size to be _less than_.                                                                                                                                                                                                                                                                                                                                                          |
| lte        |    \*2    | Specifies value for attribute or size to be _less than or equal to_.                                                                                                                                                                                                                                                                                                                                              |
| gt         |    \*2    | Specifies value for attribute or size to be _greater than_.                                                                                                                                                                                                                                                                                                                                                       |
| gte        |    \*2    | Specifies value for attribute or size to be _greater than or equal to_.                                                                                                                                                                                                                                                                                                                                           |
| between    |  `array`  | Specifies values for attribute or size to be _between_. E.g. `[18,49]`.                                                                                                                                                                                                                                                                                                                                           |
| beginsWith |    \*1    | Specifies value for the attribute to _begin with_                                                                                                                                                                                                                                                                                                                                                                 |
| in         |  `array`  | Specifies and `array` of values that the attribute or size must match one value.                                                                                                                                                                                                                                                                                                                                  |
| contains   | `string`  | Specifies value that must be contained within a string or Set. (see [Operators and Functions](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.OperatorsAndFunctions.html#Expressions.OperatorsAndFunctions.Functions) for more information)                                                                                                                                          |
| exists     | `boolean` | Checks whether or not the attribute exists for an item. A value of `true` uses the `attribute_exists()` function and a value of `false` uses the `attribute_not_exists()` function (see [Operators and Functions](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.OperatorsAndFunctions.html#Expressions.OperatorsAndFunctions.Functions) for more information)                      |
| type       | `string`  | A value that compares the attribute's type. Value must be one of `S`,`SS`, `N`, `NS`, `B`, `BS`, `BOOL`, `NULL`, `L`, or `M` (see [Operators and Functions](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.OperatorsAndFunctions.html#Expressions.OperatorsAndFunctions.Functions) for more information)                                                                            |
| or         | `boolean` | Changes the logical evaluation to `OR` (by default it's `AND`)                                                                                                                                                                                                                                                                                                                                                    |
| negate     | `boolean` | Adds `NOT` to the condition.                                                                                                                                                                                                                                                                                                                                                                                      |
| entity     | `string`  | The entity this attribute applies to. If supplied (or inherited from the calling operation), `attr` and `size` properties can use the entity's aliases to reference attributes.                                                                                                                                                                                                                                   |

*1 Comparison values should equal the type of the attribute you are comparing against. If you are using the `size` property, the value should be a `number`.  
*2 In addition to \*1, these also allow an object value with a key 'attr' and its value referencing another attribute of the same entity for comparing against.
Example condition containing an attribute reference:

```javascript
conditions: { attr: 'capacity', gt: { attr: 'reservations' } }
```

## Complex Filters and Conditions

In order to create complex filters and conditions, the DynamoDB Toolbox allows you to nest and combine filters by using nested `array`s. Array brackets (`[` and `]`) act as parentheses when constructing your condition. Using `or` in the first condition within an array will change the logical evaluation for group of conditions.

Condition where `age` is between 18 and 54 **AND** `region` equals "US":

```typescript
MyTable.query(
  // ...,
  {
    filters: [
      { attr: 'age', between: [18, 54] },
      { attr: 'region', eq: 'US' }
    ]
  }
)
```

Condition where `age` is between 18 and 54 **AND** `region` equals "US" **OR** "EU":

```typescript
MyTable.query(
  // ...,
  {
    filters: [
      { attr: 'age', between: [18, 54] },
      [
        { attr: 'region', eq: 'US' },
        { or: true, attr: 'region', eq: 'EU' }
      ]
    ]
  }
)
```

Condition where `age` is greater than 21 **OR** ((`region` equals "US" **AND** `interests` size is greater than 10) **AND** `interests` contain `nodejs`, `dynamodb`, or `serverless`):

```typescript
MyTable.query(
  // ...,
  {
    filters: [
      { attr: 'age', gt: 21 },
      [
        [
          { or: true, attr: 'region', eq: 'US' },
          { size: 'interests', gt: 10 }
        ],
        [
          { attr: 'interests', contains: 'nodejs' },
          { or: true, attr: 'interests', contains: 'dynamodb' },
          { or: true, attr: 'interests', contains: 'serverless' }
        ]
      ]
    ]
  }
)
```
