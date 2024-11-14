---
title: ParseCondition
sidebar_custom_props:
  sidebarActionType: util
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# ConditionParser

Builds a [Condition Expression](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.ConditionExpressions.html) that can be used to condition write operations, or filter the results of a [Query](../../../2-tables/2-actions/2-query/index.md) or a [Scan](../../../2-tables/2-actions/1-scan/index.md):

```ts
import { ConditionParser } from 'dynamodb-toolbox/entity/actions/parseCondition'

// 👇 To be used in DynamoDB commands
const {
  ConditionExpression,
  ExpressionAttributeNames,
  ExpressionAttributeValues
} = PokemonEntity.build(ConditionParser)
  .parse({
    // Pokemons with levels ≥ 50
    attr: 'level',
    gte: 50
  })
  .toCommandOptions()
```

## Methods

### `parse(...)`

<p style={{ marginTop: '-15px' }}><i><code>(condition: Condition&lt;ENTITY&gt;) => ConditionParser</code></i></p>

Parses a condition. Throws an `invalidCondition` error if the condition is invalid:

```ts
PokemonEntity.build(ConditionParser).parse({
  attr: 'level',
  gte: 50
})
```

Note that the `parse` method should only be used once per instance (for now). See [Building Conditions](#building-conditions) for more details on how to write conditions.

### `toCommandOptions()`

<p style={{ marginTop: '-15px' }}><i><code>() => CommandOptions</code></i></p>

Collapses the `ConditionParser` state to a set of options that can be used in a DynamoDB command:

```ts
const {
  ConditionExpression,
  ExpressionAttributeNames,
  ExpressionAttributeValues
} = PokemonEntity.build(ConditionParser)
  .parse({ attr: 'level', gte: 50 })
  .toCommandOptions()
```

### `setId(...)`

<p style={{ marginTop: '-15px' }}><i><code>(id: string) => ConditionParser</code></i></p>

Adds a prefix to expression attribute keys. Useful to avoid conflicts when using several expressions in a single command:

```ts
PokemonEntity.build(ConditionParser)
  .parse({ attr: 'level', gte: 50 })
  .toCommandOptions()
// => {
//   ConditionExpression: '#c_1 >= :c_1',
//   ExpressionAttributeNames: { '#c_1': 'sk' },
//   ExpressionAttributeValues: { ':c_1': 50 }
// }

PokemonEntity.build(ConditionParser)
  .setId('0')
  .parse({ attr: 'level', gte: 50 })
  .toCommandOptions()
// => {
//   ConditionExpression: '#c0_1 >= :c0_1',
//   ExpressionAttributeNames: { '#c0_1': 'sk' },
//   ExpressionAttributeValues: { ':c0_1': 50 }
// }
```

## Building Conditions

The condition syntax from DynamoDB-Toolbox follows the [DynamoDB specifications](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.OperatorsAndFunctions.html), while making it **type-safe** and much **simpler**:

```ts
import type { Condition } from 'dynamodb-toolbox/entity/actions/parseCondition'

const condition: Condition<typeof PokemonEntity> = {
  attr: 'level',
  gte: 50
}
```

Each condition contains **an attribute path** and an **operator**.

:::info

You can only specify one operator per condition. To combine multiple conditions, use [Logical Combinations](#combining-conditions).

:::

### Paths

`attr` contains the path of the attribute value to check (potentially deep). You can also specify `size` instead of `attr` if you want to check the **size** of an attribute (in which case the attribute type becomes `number`):

:::note[Examples]

<Tabs>
<TabItem value="root" label="Root">

```ts
const nameCheck: Condition<typeof PokemonEntity> = {
  attr: 'name',
  eq: 'Pikachu'
}
```

</TabItem>
<TabItem value="deep-map" label="Deep (Map)">

```ts
const nameCheck: Condition<typeof PokemonEntity> = {
  attr: 'name.firstName',
  eq: 'Pikachu'
}
```

</TabItem>
<TabItem value="deep-list" label="Deep (List)">

```ts
const nameCheck: Condition<typeof PokemonEntity> = {
  attr: 'names[0]',
  eq: 'Pikachu'
}
```

</TabItem>
<TabItem value="special-char" label="Special characters">

```ts
const nameCheck: Condition<typeof PokemonEntity> = {
  attr: "name['.first#Name!']",
  eq: 'Pikachu'
}
```

</TabItem>
<TabItem value="size" label="Size">

```ts
const imgLte64KB: Condition<typeof PokemonEntity> = {
  size: 'image',
  lte: 64_000
}
```

</TabItem>
</Tabs>

:::

### Value conditions

Value conditions evaluate against the **value** of an attribute:

|    Key     |   Value    |       Attribute Type        | Description                                                                                                                                                                                                                                                                                                                     |
| :--------: | :--------: | :-------------------------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|    `eq`    |  `scalar`  |         `scalar`\*          | Checks that the attribute is **equal** to the specified value                                                                                                                                                                                                                                                                   |
|    `ne`    |  `scalar`  |          `scalar`           | Checks that the attribute is **different** than the specified value                                                                                                                                                                                                                                                             |
|    `in`    | `scalar[]` |          `scalar`           | Checks that the attribute is in a **finite range of values** (100 values max)                                                                                                                                                                                                                                                   |
| `contains` |  `scalar`  | `string`, `sets` or `lists` | Checks that the attribute is one of the following:<ul><li>A <code>string</code> that contains a **particular substring**</li><li>A <code>set</code> that contains a **particular element**</li><li>A <code>list</code> that contains a **particular element**</li></ul>                                                         |
|  `exists`  | `boolean`  |              -              | Checks that the attribute is **present in the item** (or not)                                                                                                                                                                                                                                                                   |
|   `type`   |  `string`  |              -              | Checks that the attribute is of a **particular data type**:<ul><li>`"NULL"` = `null`</li><li>`"BOOL"` = `boolean`</li><li>`"N"` = `number`</li><li>`"S"` = `string`</li><li>`"B"` = `binary`</li><li><code>"NS\|SS\|BS"</code> = `set` of `number`, `string` or `binary`</li><li>`"L"` = `list`</li><li>`"M"` = `map`</li></ul> |

<!-- Required for prettier not to prefix * with anti-slash -->
<!-- prettier-ignore -->
<sup><i>*<a href="https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.NamingRulesDataTypes.html#HowItWorks.DataTypes">Scalar</a> = <code>boolean</code>, <code>number</code>, <code>string</code> or <code>binary</code></i></sup>

:::note[Examples]

<Tabs>
<TabItem value="eq" label="Equal">

```ts
const nameCheck: Condition<typeof PokemonEntity> = {
  attr: 'name',
  eq: 'Pikachu'
}
```

</TabItem>
<TabItem value="neq" label="Not equal">

```ts
const nameCheck: Condition<typeof PokemonEntity> = {
  attr: 'name',
  ne: 'Pikachu'
}
```

</TabItem>
<TabItem value="in" label="In">

```ts
const nameCheck: Condition<typeof PokemonEntity> = {
  attr: 'name',
  in: ['Pikachu', 'Charizard', 'MewTwo']
}
```

</TabItem>
<TabItem value="contains-set-list" label="Contains">

```ts
const pokeTypeCheck: Condition<typeof PokemonEntity> = {
  // 👇 `pokeTypes` = list/set of strings
  attr: 'pokeTypes',
  contains: 'fire'
}
```

</TabItem>
<TabItem value="contains-string" label="Contains (string)">

```ts
const nameCheck: Condition<typeof PokemonEntity> = {
  // 👇 string
  attr: 'name',
  contains: 'Pika'
}
```

</TabItem>
<TabItem value="exists" label="Exists">

```ts
const customNameCheck: Condition<typeof PokemonEntity> = {
  attr: 'customName',
  exists: true
}
```

</TabItem>
<TabItem value="type" label="Type">

```ts
const pokeTypeCheck: Condition<typeof PokemonEntity> = {
  // 👇 Checks that `pokeTypes` is a list
  attr: 'pokeTypes',
  type: 'L'
}
```

</TabItem>
</Tabs>

:::

### Range conditions

Range conditions evaluate whether an attribute of sortable type (i.e. [number](../../../4-schemas/8-number/index.md), [string](../../../4-schemas/9-string/index.md) or [binary](../../../4-schemas/10-binary/index.md)) is **within a certain range**.

:::info

Apart from the [`eq` value condition](#value-conditions), only range conditions are accepted in [`Query` ranges](../../../2-tables/2-actions/2-query/index.md#query).

:::

|     Key      |         Value          | Attribute Type | Description                                                                         |
| :----------: | :--------------------: | :------------: | ----------------------------------------------------------------------------------- |
|    `gte`     |       `sortable`       |   `sortable`   | Checks that the attribute is **greater than or equal to** the specified value       |
|     `gt`     |      `sortable`\*      |   `sortable`   | Checks that the attribute is **strictly greater** than the specified value          |
|    `lte`     |       `sortable`       |   `sortable`   | Checks that the attribute is **lower than or equal to** the specified value         |
|     `lt`     |       `sortable`       |   `sortable`   | Checks that the attribute is **strictly lower than** the specified value            |
|  `between`   | `[sortable, sortable]` |   `sortable`   | Checks that the attribute is **between** two values (inclusive)                     |
| `beginsWith` |        `string`        |    `string`    | Checks that the `string` attribute specified **begins with a particular substring** |

<!-- Required for prettier not to prefix * with anti-slash -->
<!-- prettier-ignore -->
<sup><i>* Sortable = <code>number</code>, <code>string</code> or <code>binary</code></i></sup>

:::note[Examples]

<Tabs>
<TabItem value="greater-than" label="≥">

```ts
const levelGte50: Condition<typeof PokemonEntity> = {
  attr: 'level',
  gte: 50
}
```

</TabItem>
<TabItem value="greater-than-strict" label=">">

```ts
const levelAbove50: Condition<typeof PokemonEntity> = {
  attr: 'level',
  gt: 50
}
```

</TabItem>
<TabItem value="lower-than" label="≤">

```ts
const levelLte50: Condition<typeof PokemonEntity> = {
  attr: 'level',
  lte: 50
}
```

</TabItem>
<TabItem value="lower-than-strict" label="<">

```ts
const levelBelow50: Condition<typeof PokemonEntity> = {
  attr: 'level',
  lt: 50
}
```

</TabItem>
<TabItem value="between" label="Between">

```ts
const levelFrom50To70: Condition<typeof PokemonEntity> = {
  attr: 'level',
  between: [50, 70]
}
```

</TabItem>
<TabItem value="begins-with" label="Begins with">

```ts
const capturedIn2024: Condition<typeof PokemonEntity> = {
  attr: 'captureDate',
  beginsWith: '2024'
}
```

</TabItem>
</Tabs>

:::

:::warning

Again, only one operator can be applied per condition: Using `gte` and `lte` simultaneously does **not** result in a `between`.

:::

## Combining Conditions

You can **combine conditions logically** with the `or`, `and` and `not` operators:

| Name  |         Value         | Attribute Type | Description                                                    |
| :---: | :-------------------: | :------------: | -------------------------------------------------------------- |
| `or`  | `Condition<ENTITY>[]` |       -        | Checks that **one of** the child conditions evaluate to `true` |
| `and` | `Condition<ENTITY>[]` |       -        | Checks that **all of** the child conditions evaluate to `true` |
| `not` |  `Condition<ENTITY>`  |       -        | **Negates** the evaluation of the condition                    |

:::note[Examples]

<Tabs>
<TabItem value="or" label="Or">

```ts
const lvlGte50OrElec: Condition<typeof PokemonEntity> = {
  or: [
    { attr: 'level', gte: 50 },
    { attr: 'pokeType', eq: 'electric' }
  ]
}
```

</TabItem>
<TabItem value="and" label="And">

```ts
const lvlGte50AndElec: Condition<typeof PokemonEntity> = {
  and: [
    { attr: 'level', gte: 50 },
    { attr: 'pokeType', eq: 'electric' }
  ]
}
```

</TabItem>
<TabItem value="not" label="Not">

```ts
const notElectric: Condition<typeof PokemonEntity> = {
  not: {
    attr: 'pokeType',
    eq: 'electric'
  }
}
```

</TabItem>
<TabItem value="deep" label="Deep">

```ts
const deepCondition: Condition<typeof PokemonEntity> = {
  and: [
    {
      // Level ≥ 50 or ≤ 20...
      or: [
        { attr: 'level', gte: 50 },
        { not: { attr: 'level', gt: 20 } }
      ]
    },
    // ...and pokeType not 'electric'
    { not: { attr: 'pokeType', eq: 'electric' } }
  ]
}
```

</TabItem>
</Tabs>

:::

## Comparing Attributes

Instead of directly providing values, you can **compare attributes to other attributes** by providing objects with an `attr` key to the operators:

```ts
const atMaxLevel: Condition<typeof PokemonEntity> = {
  attr: 'level',
  eq: { attr: 'maxLevel' }
}
```

:::warning

Note that the compared attribute path is type-checked and validated, but whether its type CAN be compared is **not** for the moment, so be extra-careful:

```ts
const invalidCondition: Condition<typeof PokemonEntity> = {
  attr: 'level',
  // ❌ Reaches DynamoDB and fail
  gte: { attr: 'name' }
}
```

:::
