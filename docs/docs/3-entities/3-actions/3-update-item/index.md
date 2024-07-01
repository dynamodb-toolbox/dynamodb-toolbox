---
title: UpdateItem
sidebar_custom_props:
  sidebarActionType: write
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# UpdateItemCommand

Performs a [UpdateItem Operation](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_UpdateItem.html) on an entity item:

```ts
import { UpdateItemCommand } from 'dynamodb-toolbox/entity/actions/update'

const updateItemCommand = PokemonEntity.build(
  UpdateItemCommand
)

const params = updateItemCommand.params()
await updateItemCommand.send()
```

## Request

### `.item(...)`

<p style={{ marginTop: '-15px' }}><i>(required)</i></p>

The attributes to update, including the key:

```ts
import { UpdateItemCommand, $add } from 'dynamodb-toolbox/entity/actions/update'

await PokemonEntity.build(UpdateItemCommand)
  .item({
    pokemonId: 'pikachu1',
    level: $add(1),
    ...
  })
  .send()
```

You can use the `UpdateItemInput` type to explicitely type an object as a `UpdateItemCommand` item:

```ts
import type { UpdateItemInput } from 'dynamodb-toolbox/entity/actions/update'

const item: UpdateItemInput<typeof PokemonEntity> = {
  pokemonId: 'pikachu1',
  level: $add(1),
  ...
}

await PokemonEntity.build(UpdateItemCommand).item(item).send()
```

### Removing an attribute

Any optional attribute can be removed with the `$remove` verb:

```ts
import { $remove } from 'dynamodb-toolbox'

await PokemonEntity.build(UpdateItemCommand)
  .item({
    pokemonId: 'pikachu1',
    // 👇 clear 'statusEffect' from pokemon
    statusEffect: $remove()
  })
  .send()
```

### References

You can indicate DynamoDB to resolve an attribute **at write time** with the `$get` verb:

```ts
import { $get } from 'dynamodb-toolbox'

await PokemonEntity.build(UpdateItemCommand)
  .item({
    ...
    level: 42,
    // 👇 fill 'previousLevel' with current 'level'
    previousLevel: $get('level')
  })
  .send()
```

Self-references are possible. You can also **provide a fallback** as second argument (which can also be a reference) in case the specified attribute path misses from the item:

```ts
await PokemonEntity.build(UpdateItemCommand)
  .item({
    ...
    previousLevel: $get('level', 1),
    // 👇 fallback can also be a reference!
    chainedRefs: $get(
      'firstRef',
      $get('secondRef', 'Sky is the limit!')
    )
  })
  .send()
```

Note that the attribute path is type-checked, but wether its attribute value extends the updated attribute value is **not** for the moment, so be extra-careful:

```ts
await PokemonEntity.build(UpdateItemCommand)
  .item({
    // ❌ Raises a type error
    name: $get('non.existing[0].attribute'),
    // ...but overriding a number by a string doesn't 🙈
    level: $get('name')
  })
  .send()
```

### Non-recursive attributes

In the case of non-recursive attributes (primitives and `sets`), updates completely override their current values:

```ts
await PokemonEntity.build(UpdateItemCommand)
  .item({
    ...
    // 👇 Set fields to desired values
    isLegendary: true,
    nextLevel: 42,
    name: 'Pikachu',
    binEncoded: Buffer.from(...),
    skills: new Set(['thunder'])
  })
  .send()
```

Numbers benefit from additional `$sum`, `$subtract` and `$add` verbs, which can use references:

```ts
import {
  $add,
  $subtract,
  $get
} from 'dynamodb-toolbox/entity/actions/update'

await PokemonEntity.build(UpdateItemCommand)
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

Sets benefit from additional `$add` and `$delete` verbs, which can be used to add or remove specific values:

```ts
import {
  $add,
  $delete
} from 'dynamodb-toolbox/entity/actions/update'

await PokemonEntity.build(UpdateItemCommand)
  .item({
    ...
    skills: $add('thunder', 'dragon-tail'),
    types: $delete('flight')
  })
  .send()
```

### Recursive attributes

In the case of recursive attributes, e.g. `lists`, `maps` and `records`, updates are **partial by default**. You can use the `$set` verb to specify a complete override:

```ts
// 👇 Partial overrides
await PokemonEntity.build(UpdateItemCommand)
  .item({
    ...
    // 👇 Elements 0 and 2 are updated
    skills: ['thunder', undefined, $remove()],
    // ...similar to
    skills: {
      0: 'thunder',
      2: $remove()
    },
    // 👇 map example
    some: {
      nested: {
        field: 'foo'
      }
    },
    // Record
    bestSkillByType: {
      electric: 'thunder',
      flight: $remove()
    }
  })
  .send()

import { $set } from 'dynamodb-toolbox'

// 👇 Complete overrides
await PokemonEntity.build(UpdateItemCommand).item({
  ...
  // reset list
  skills: $set(['thunder']),
  // Removes all other map attributes
  some: $set({
    nested: {
      field: 'foo',
      otherField: 42
    }
  }),
  // Removes all other record keys
  bestSkillByType: $set({
    electric: 'thunder'
  })
})
```

Lists benefit from additional `$append` and `$prepend` verbs, which can use references:

```ts
PokemonEntity.build(UpdateItemCommand).item({
  ...
  skills: $append(['thunder', 'dragon-tail']),
  levelHistory: $append($get('level')),
  types: $prepend(['flight']),
});
```

### `.options(...)`

Provides additional options:

```ts
await PokemonEntity.build(UpdateItemCommand)
  .item(...)
  .options({
    returnValues: 'UPDATED_OLD',
    capacity: 'TOTAL',
    ...
  })
  .send()
```

You can use the `UpdateItemOptions` type to explicitely type an object as an `UpdateItemCommand` options:

```ts
import type { UpdateItemOptions } from 'dynamodb-toolbox/entity/actions/update'

const options: UpdateItemOptions<typeof PokemonEntity> = {
  returnValues: 'UPDATED_OLD',
  capacity: 'TOTAL',
  ...
}

await PokemonEntity.build(UpdateItemCommand)
  .item(...)
  .options(options)
  .send()
```

Available options are (see the [DynamoDB documentation](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_UpdateItem.html#API_UpdateItem_RequestParameters) for more details):

| Option         |               Type                | Default  | Description                                                                                                                                                                                                                      |
| -------------- | :-------------------------------: | :------: | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `condition`    | `Condition<typeof PokemonEntity>` |    -     | A condition that must be satisfied in order for the `UpdateItemCommand` to succeed.<br/><br/>See the [`ConditionParser`](../17-parse-condition/index.md#building-conditions) action for more details on how to write conditions. |
| `returnValues` |       `ReturnValuesOption`        | `"NONE"` | To get the item attributes as they appeared before they were updated with the request.<br/><br/>Possible values are `"NONE"`, `"UPDATED_NEW"`, `"ALL_NEW"`, `"UPDATED_OLD"` and `"ALL_OLD"`.                                     |
| `metrics`      |          `MetricsOption`          | `"NONE"` | Determines whether item collection metrics are returned.<br/><br/>Possible values are `"NONE"` and `"SIZE"`.                                                                                                                     |
| `capacity`     |         `CapacityOption`          | `"NONE"` | Determines the level of detail about provisioned or on-demand throughput consumption that is returned in the response.<br/><br/>Possible values are `"NONE"`, `"TOTAL"` and `"INDEXES"`.                                         |

:::noteExamples

<Tabs>
<TabItem value="conditional" label="Conditional write">

```ts
await PokemonEntity.build(UpdateItemCommand)
  .item({
    pokemonId: 'pikachu1',
    level: $add(1)
  })
  .options({
    // 👇 Make sure that 'level' stays <= 99
    condition: { attr: 'level', lt: 99 }
  })
  .send()
```

</TabItem>
<TabItem value="return-values" label="Return values">

```ts
const { Attributes: prevPikachu } =
  await PokemonEntity.build(UpdateItemCommand)
    .item({
      pokemonId: 'pikachu1',
      level: $add(1)
    })
    .options({ returnValues: 'ALL_OLD' })
    .send()
```

</TabItem>
</Tabs>

:::

## Response

The data is returned with the same response syntax as the [DynamoDB UpdateItem API](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_UpdateItem.html#API_UpdateItem_ResponseElements). If present, the returned attributes are formatted by the Entity.

You can use the `UpdateItemResponse` type to explicitely type an object as a `UpdateItemCommand` response:

```ts
import type { UpdateItemResponse } from 'dynamodb-toolbox/entity/actions/update'

const response: UpdateItemResponse<
  typeof PokemonEntity,
  // 👇 Optional options
  { returnValues: 'ALL_OLD' }
  // 👇 Typed as Pokemon | undefined
> = { Attributes: ... }
```
