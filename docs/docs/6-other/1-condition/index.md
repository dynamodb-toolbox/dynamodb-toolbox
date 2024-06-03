---
title: Condition 👷
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Condition 👷

Conditions can be used to conditionally write, update or delete an item. Conditions can also be applied to filter or fine-tune the results of a [Query](/docs/tables/actions/query) or a [Scan](/docs/tables/actions/scan).

You can use the `Condition` type to explicitely type an object as an Entity condition:

```ts
import type { Condition } from 'v1/entity/actions/parseCondition'

const condition: Condition<typeof PokemonEntity> = {
  attr: 'level',
  gte: 50
}
```

:::info

Note that although it is an object, only one condition is applied at a time.

:::

## Value checks

Scalar Types – A scalar type can represent exactly one value. The scalar types are number, string, binary, Boolean, and null.

|     Name      |             Value             | Description                                                                    |
| :-----------: | :---------------------------: | ------------------------------------------------------------------------------ |
|   `exists`    |           `boolean`           | ...                                                                            |
|    `type`     |            `Type`             | ... Can be one of `NULL`, `BOOL`, `N`, `S`, `B`, `NS`, `SS`, `BS`, `L` or `M`. |
|     `eq`      |           `scalar`            | ...                                                                            |
|     `neq`     |           `scalar`            | ...                                                                            |
|  `contains`   | <code>string \| binary</code> | ...                                                                            |
| `notContains` | <code>string \| binary</code> | ...                                                                            |

## Range comparison

Can be applied to [number](/docs/attribute-types/number), [string](/docs/attribute-types/string) and [binary](/docs/attribute-types/binary) attributes, and are the only condition accepted in [`Query` ranges](../../2-tables/2-actions/2-query/index.md).

Sorted Types - A sort type is a scalar type that is also sortable. The sort types are number, string, and binary.

|     Name     |                        Value                         | Description |
| :----------: | :--------------------------------------------------: | ----------- |
|     `gt`     | <code>number \| string \| binary</code> (\*`sorted`) | ...         |
|    `gte`     |                       `sorted`                       | ...         |
|     `lt`     |                       `sorted`                       | ...         |
|    `lte`     |                       `sorted`                       | ...         |
|  `between`   |                  `[sorted, sorted]`                  | ...         |
| `beginsWith` |                  `[sorted, sorted]`                  | ...         |

<!-- NOTE: 'caution' became 'warning' in docusaurus v3 -->

:::caution

Again, only one condition is applied at a time. Using `gte` and `lte` simultaneously does **NOT** result in a `between`.

:::

:::noteExamples

<Tabs>
<TabItem value="greater-than" label="Greater than">

```ts
const levelAbove50: Condition<typeof PokemonEntity> = {
  attr: 'level',
  gt: 50
}
```

</TabItem>
<TabItem value="lower-than" label="Lower than">

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
</Tabs>

:::

## Logical combination

| Name  |     Value     | Description |
| :---: | :-----------: | ----------- |
| `not` |  `Condition`  | ...         |
| `and` | `Condition[]` | ...         |
| `or`  | `Condition[]` | ...         |

:::noteExamples

<Tabs>
<TabItem value="negated" label="Negated">

```ts
const notElectric: Condition<typeof PokemonEntity> = {
  not: {
    attr: 'pokemonType',
    eq: 'electric'
  }
}
```

</TabItem>
<TabItem value="and" label="And">

```ts
const lvlGte50AndElec: Condition<typeof PokemonEntity> = {
  and: [
    { attr: 'level', gte: 50 },
    { attr: 'pokemonType', eq: 'electric' }
  ]
}
```

</TabItem>
<TabItem value="or" label="Or">

```ts
const lvlGte50OrElec: Condition<typeof PokemonEntity> = {
  or: [
    { attr: 'level', gte: 50 },
    { attr: 'pokemonType', eq: 'electric' }
  ]
}
```

</TabItem>
</Tabs>

:::

## Comparing to another attribute

You can compare an attribute to another attribute by providing an object with an `attr` key instead of a direct value:

```ts
const atMaxLevel: Condition<typeof PokemonEntity> = {
  attr: 'level',
  eq: { attr: 'maxLevel' }
}
```

Note that the compared attribute path is type-checked and validated, but wether its type can be compared is **not** for the moment, so be extra-careful:

```ts
const invalidCondition: Condition<typeof PokemonEntity> = {
  attr: 'level',
  // ❌ Reaches DynamoDB and fail
  gte: { attr: 'name' }
}
```

## Using the size of an attribute

In this case, the condition is considered as a number attribute condition. For instance, you can use [range comparisons](#range-comparison):

```ts
const imgLte64KB: Condition<typeof PokemonEntity> = {
  size: 'image',
  lte: 64_000
}
```
