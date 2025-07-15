---
title: UpdateAttributes
sidebar_custom_props:
  sidebarActionType: write
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# UpdateAttributesCommand

Performs an [UpdateAttributes Operation](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_UpdateAttributes.html) on an entity item. Similar to [`UpdateItemCommand`](../4-update-item/index.md) except than deep attribute updates are **non-partial**:

```ts
import { UpdateAttributesCommand } from 'dynamodb-toolbox/entity/actions/updateAttributes'

const updateAttributesCommand = PokemonEntity.build(
  UpdateAttributesCommand
)

const params = updateAttributesCommand.params()
await updateAttributesCommand.send()
```

## Request

### `.item(...)`

<p style={{ marginTop: '-15px' }}><i>(required)</i></p>

The attributes to update, including the key:

```ts
import { UpdateAttributesCommand } from 'dynamodb-toolbox/entity/actions/updateAttributes'

await PokemonEntity.build(UpdateAttributesCommand)
  .item({
    pokemonId: 'pikachu1',
    level: 12,
    ...
  })
  .send()
```

You can use the `UpdateAttributesInput` type to explicitly type an object as a `UpdateAttributesCommand` item object:

```ts
import type { UpdateAttributesInput } from 'dynamodb-toolbox/entity/actions/updateAttributes'

const item: UpdateAttributesInput<typeof PokemonEntity> = {
  pokemonId: 'pikachu1',
  level: 12,
  ...
}

await PokemonEntity.build(UpdateAttributesCommand).item(item).send()
```

`UpdateAttributesInput` differs from [`PutItemInput`](../3-put-item/index.md#item) as the root attributes are **partially required** – except for `always` required attributes without defaults or links – and benefit from an **extended syntax** that reflects the [capabilities of DynamoDB](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.UpdateExpressions.html).

It also differs from [`UpdateItemInput`](../4-update-item/index.md#item) as deep attributes (e.g. `lists`, `maps` and `records`) are always completely overridden by default.

### Root attributes

Root attributes, wether flat or deep, benefit from the same syntax as the [`UpdateItemCommand`](../4-update-item/index.md#removing-an-attribute) command:

:::note[Examples]

<Tabs>
<TabItem value="remove" label="$remove">

```ts
// 👇 Extended syntax is taken from `UpdateItemCommand`
import { $remove } from 'dynamodb-toolbox/entity/actions/update'

await PokemonEntity.build(UpdateAttributesCommand)
  .item({
    pokemonId: 'pikachu1',
    // 👇 clear 'statusEffect' from pokemon
    statusEffect: $remove()
  })
  .send()
```

</TabItem>
<TabItem value="get" label="$get">

```ts
import { $get } from 'dynamodb-toolbox/entity/actions/update'

await PokemonEntity.build(UpdateAttributesCommand)
  .item({
    ...
    level: 42,
    // 👇 fill 'previousLevel' with current 'level'
    previousLevel: $get('level')
  })
  .send()
```

</TabItem>
<TabItem value="flat-attributes" label="Flat attributes">

```ts
await PokemonEntity.build(UpdateAttributesCommand)
  .item({
    ...
    // 👇 Set fields to desired values
    isLegendary: true,
    nextLevel: 42,
    name: 'Pikachu',
    binEncoded: new Uint8Array(...),
    skills: new Set(['thunder'])
  })
  .send()
```

</TabItem>
<TabItem value="numbers" label="Numbers">

```ts
import {
  $add,
  $subtract,
  $get
} from 'dynamodb-toolbox/entity/actions/update'

await PokemonEntity.build(UpdateAttributesCommand)
  .item({
    ...
    // 👇 lose 20 health points
    health: $subtract($get('health'), 20),
    // 👇 gain 1 level
    level: $sum($get('level', 0), 1),
    // ...similar to
    level: $add(1)
  })
  .send()
```

</TabItem>
<TabItem value="sets" label="Sets">

```ts
import {
  $add,
  $delete
} from 'dynamodb-toolbox/entity/actions/update'

await PokemonEntity.build(UpdateAttributesCommand)
  .item({
    ...
    skills: $add(new Set(['thunder', 'dragon-tail'])),
    types: $delete(new Set(['flight']))
  })
  .send()
```

</TabItem>
</Tabs>

:::

### Deep attributes

In the case of deep attributes (e.g. `lists`, `maps`, `records` and potentially `any`), updates are **complete by default**:

```ts
// 👇 Complete overrides
await PokemonEntity.build(UpdateAttributesCommand).item({
 ...
 // Resets list
 skills: ['thunder'],
 // Removes all other map attributes
 some: {
   deep: {
     field: 'foo',
     otherField: 42
   }
 },
 // Removes all other record keys
 bestSkillByType: {
   electric: 'thunder'
 }
})
```

Lists benefit from additional `$append` and `$prepend` extensions, which can use references:

```ts
import {
  $append,
  $prepend
} from 'dynamodb-toolbox/entity/actions/update'

PokemonEntity.build(UpdateAttributesCommand).item({
  ...
  skills: $append(['thunder', 'dragon-tail']),
  levelHistory: $append($get('level')),
  types: $prepend(['flight']),
})
```

:::info

`$append` and `$prepend` are **upserts**: they create a new list if the attribute is missing from the item.

:::

### `.options(...)`

Provides additional options:

```ts
await PokemonEntity.build(UpdateAttributesCommand)
  .item(...)
  .options({
    returnValues: 'UPDATED_OLD',
    capacity: 'TOTAL',
    ...
  })
  .send()
```

You can **provide a callback** to partially update previous options:

```ts
await updateAttributesCommand
  .options(prevOptions => ({
    ...prevOptions,
    returnValues: 'UPDATED_OLD'
  }))
  .send()
```

The options are the same as the [`UpdateItemCommand`](../4-update-item/index.md) action options. Check the [dedicated section](../4-update-item/index.md#options) for more details.

## Examples

:::note[Examples]

<Tabs>
<TabItem value="basic" label="Basic">

```ts
await PokemonEntity.build(UpdateAttributesCommand)
  .item({
    pokemonId: 'pikachu1',
    level: $add(1)
  })
  .send()
```

</TabItem>
<TabItem value="conditional" label="Conditional">

```ts
await PokemonEntity.build(UpdateAttributesCommand)
  .item({
    pokemonId: 'pikachu1',
    level: $add(1)
  })
  .options({
    // 👇 Makes sure that 'level' stays <= 99
    condition: { attr: 'level', lt: 99 },
    // 👇 Includes the Item in the error if not so
    returnValuesOnConditionFalse: 'ALL_OLD'
  })
  .send()
```

</TabItem>
<TabItem value="return-values" label="Return values">

```ts
const { Attributes: prevPikachu } =
  await PokemonEntity.build(UpdateAttributesCommand)
    .item({
      pokemonId: 'pikachu1',
      level: $add(1)
    })
    .options({ returnValues: 'ALL_OLD' })
    .send()
```

</TabItem>
<TabItem value="multitenant" label="Multitenant">

```ts
await PokemonEntity.build(UpdateAttributesCommand)
  .item({
    pokemonId: 'pikachu1',
    level: $add(1)
  })
  .options({ tableName: `tenant-${tenantId}-pokemons` })
  .send()
```

</TabItem>
<TabItem value="aborted" label="Aborted">

```ts
const abortController = new AbortController()
const abortSignal = abortController.signal

await PokemonEntity.build(UpdateAttributesCommand)
  .item({
    pokemonId: 'pikachu1',
    level: $add(1)
  })
  .send({ abortSignal })

// 👇 Aborts the command
abortController.abort()
```

</TabItem>
</Tabs>

:::

## Response

The data is returned using the same response syntax as the [DynamoDB UpdateItem API](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_UpdateItem.html#API_UpdateItem_ResponseElements), with an additional `ToolboxItem` property, which allows you to retrieve the item generated by DynamoDB-Toolbox:

```ts
const { ToolboxItem: generatedPokemon } =
  await PokemonEntity.build(UpdateAttributesCommand)
    .item(...)
    .send()

// 👇 Great for auto-generated attributes
const modifiedTimestamp = generatedPokemon.modified
```

If present, the returned attributes are formatted by the Entity.

You can use the `UpdateAttributesResponse` type to explicitly type an object as an `UpdateAttributesCommand` response object:

```ts
import type { UpdateAttributesResponse } from 'dynamodb-toolbox/entity/actions/updateAttributes'

const response: UpdateAttributesResponse<
  typeof PokemonEntity,
  // 👇 Optional options
  { returnValues: 'ALL_OLD' }
  // 👇 Typed as Pokemon | undefined
> = { Attributes: ... }
```
