---
title: UpdateItem
sidebar_custom_props:
  sidebarActionType: write
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# UpdateItemCommand

Performs an [UpdateItem Operation](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_UpdateItem.html) on an entity item:

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

You can use the `UpdateItemInput` type to explicitly type an object as a `UpdateItemCommand` item object:

```ts
import type { UpdateItemInput } from 'dynamodb-toolbox/entity/actions/update'

const item: UpdateItemInput<typeof PokemonEntity> = {
  pokemonId: 'pikachu1',
  level: $add(1),
  ...
}

await PokemonEntity.build(UpdateItemCommand).item(item).send()
```

`UpdateItemInput` differs from [`PutItemInput`](../2-put-item/index.md#item) as it is **partial by default**, except for `always` required attributes without defaults or links.

It also benefits from an **extended syntax** that reflects the [capabilities of DynamoDB](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.UpdateExpressions.html):

### Removing an attribute

Any optional attribute can be removed with the `$remove` extension:

```ts
import { $remove } from 'dynamodb-toolbox/entity/actions/update'

await PokemonEntity.build(UpdateItemCommand)
  .item({
    pokemonId: 'pikachu1',
    // 👇 clear 'statusEffect' from pokemon
    statusEffect: $remove()
  })
  .send()
```

### References

You can indicate DynamoDB to resolve an attribute **at write time** with the `$get` extension:

```ts
import { $get } from 'dynamodb-toolbox/entity/actions/update'

await PokemonEntity.build(UpdateItemCommand)
  .item({
    ...
    level: 42,
    // 👇 fill 'previousLevel' with current 'level'
    previousLevel: $get('level')
  })
  .send()
```

Self-references are possible. You can also **provide a fallback** as a second argument (which can also be a reference) in case the specified attribute path misses from the item:

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

Note that the attribute path is type-checked, but whether its attribute value extends the updated attribute value is **not** for the moment, so be extra-careful:

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

### Flat attributes

In the case of flat attributes (primitives and `sets`), updates completely override their current values:

```ts
await PokemonEntity.build(UpdateItemCommand)
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

Numbers benefit from additional `$sum`, `$subtract` and `$add` extensions, which can use references:

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

Sets benefit from additional `$add` and `$delete` extensions, which can be used to add or remove specific values:

```ts
import {
  $add,
  $delete
} from 'dynamodb-toolbox/entity/actions/update'

await PokemonEntity.build(UpdateItemCommand)
  .item({
    ...,
    skills: $add(new Set(['thunder', 'dragon-tail'])),
    types: $delete(new Set(['flight']))
  })
  .send()
```

### Deep attributes

In the case of deep attributes (e.g. `lists`, `maps` and `records`), updates are **partial by default**:

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
    // 👇 Map
    some: {
      deep: {
        field: 'foo'
      }
    },
    // 👇 Record
    bestSkillByType: {
      electric: 'thunder',
      flight: $remove()
    }
  })
  .send()
```

You can use the `$set` extension to specify a complete override:

```ts
import { $set } from 'dynamodb-toolbox/entity/actions/update'

// 👇 Complete overrides
await PokemonEntity.build(UpdateItemCommand).item({
 ...
 // Resets list
 skills: $set(['thunder']),
 // Removes all other map attributes
 some: $set({
   deep: {
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

Lists benefit from additional `$append` and `$prepend` extensions, which can use references:

```ts
import {
  $append,
  $prepend
} from 'dynamodb-toolbox/entity/actions/update'

PokemonEntity.build(UpdateItemCommand).item({
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
await PokemonEntity.build(UpdateItemCommand)
  .item(...)
  .options({
    returnValues: 'UPDATED_OLD',
    capacity: 'TOTAL',
    ...
  })
  .send()
```

You can use the `UpdateItemOptions` type to explicitly type an object as an `UpdateItemCommand` options object:

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

Available options (see the [DynamoDB documentation](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_UpdateItem.html#API_UpdateItem_RequestParameters) for more details):

| Option                                |               Type                | Default  | Description                                                                                                                                                                                                                      |
| ------------------------------------- | :-------------------------------: | :------: | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `condition`                           | `Condition<typeof PokemonEntity>` |    -     | A condition that must be satisfied in order for the `UpdateItemCommand` to succeed.<br/><br/>See the [`ConditionParser`](../18-parse-condition/index.md#building-conditions) action for more details on how to write conditions. |
| `returnValues`                        |       `ReturnValuesOption`        | `"NONE"` | To get the item attributes as they appeared before they were updated with the request.<br/><br/>Possible values are `"NONE"`, `"UPDATED_NEW"`, `"ALL_NEW"`, `"UPDATED_OLD"` and `"ALL_OLD"`.                                     |
| `returnValuesOnConditionCheckFailure` |       `ReturnValuesOption`        | `"NONE"` | To get the item attributes if the `condition` fails.<br/><br/>Possible values are `"NONE"` and `"ALL_OLD"`.                                                                                                                      |
| `metrics`                             |          `MetricsOption`          | `"NONE"` | Determines whether item collection metrics are returned.<br/><br/>Possible values are `"NONE"` and `"SIZE"`.                                                                                                                     |
| `capacity`                            |         `CapacityOption`          | `"NONE"` | Determines the level of detail about provisioned or on-demand throughput consumption that is returned in the response.<br/><br/>Possible values are `"NONE"`, `"TOTAL"` and `"INDEXES"`.                                         |
| `tableName`                           |             `string`              |    -     | Overrides the `Table` name. Mostly useful for [multitenancy](https://en.wikipedia.org/wiki/Multitenancy).                                                                                                                        |

:::note[Examples]

<Tabs>
<TabItem value="conditional" label="Conditional write">

```ts
await PokemonEntity.build(UpdateItemCommand)
  .item({
    pokemonId: 'pikachu1',
    level: $add(1)
  })
  .options({
    // 👇 Makes sure that 'level' stays <= 99
    condition: { attr: 'level', lt: 99 },
    // 👇 Includes the Item in the error if not so
    returnValuesOnConditionCheckFailed: 'ALL_OLD'
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
    .options({
      returnValues: 'ALL_OLD'
    })
    .send()
```

</TabItem>
<TabItem value="multitenant" label="Multitenant">

```ts
await PokemonEntity.build(UpdateItemCommand)
  .item({
    pokemonId: 'pikachu1',
    level: $add(1)
  })
  .options({
    tableName: `tenant-${tenantId}-pokemons`
  })
  .send()
```

</TabItem>
<TabItem value="aborted" label="Aborted">

```ts
const abortController = new AbortController()
const abortSignal = abortController.signal

await PokemonEntity.build(UpdateItemCommand)
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
  await PokemonEntity.build(UpdateItemCommand)
    .item(...)
    .send()

// 👇 Great for auto-generated attributes
const modifiedTimestamp = generatedPokemon.modified
```

If present, the returned attributes are formatted by the Entity.

You can use the `UpdateItemResponse` type to explicitly type an object as an `UpdateItemCommand` response object:

```ts
import type { UpdateItemResponse } from 'dynamodb-toolbox/entity/actions/update'

const response: UpdateItemResponse<
  typeof PokemonEntity,
  // 👇 Optional options
  { returnValues: 'ALL_OLD' }
  // 👇 Typed as Pokemon | undefined
> = { Attributes: ... }
```

## Extended Syntax

In some contexts, like when defining [`updateLinks`](../../../4-schemas/2-defaults-and-links/index.md), it may be useful to understand extended syntax in greater details.

To avoid conflicts with regular syntax, extensions are defined through **objects** with [symbols](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol) as keys:

```ts
import {
  $add,
  // 👇 Unique symbols
  $ADD,
  $IS_EXTENSION
} from 'dynamodb-toolbox/entity/actions/update/symbols'

const addOne = $add(1)

// 👇 Equivalent to
const addOne = {
  [$ADD]: 1,
  [$IS_EXTENSION]: true
}
```

If you need to build complex update links, **all those symbols are exported**, as well as **dedicated type guards**. If you don't, you can **exclude extended syntax** altogether with the `isExtension` type guard.

Here's an example in which we automatically derive pokemon level upgrades:

```ts
import {
  $add,
  $get,
  $subtract,
  isAddition,
  isExtension,
  isGetting,
  $ADD
} from 'dynamodb-toolbox/entity/actions/update/symbols'

const pokemonSchema = schema({
  ...
  level: number()
}).and(prevSchema => ({
  lastLevelUpgrade: number().updateLink<typeof prevSchema>(
    ({ level }) => {
      if (level === undefined) {
        return undefined
      }

      if (isAddition(level)) {
        return level[$ADD]
      }

      if (!isExtension(level) || isGetting(level)) {
        return $subtract(level, $get('level'))
      }
    }
  )
}))

await PokemonEntity.build(UpdateItemCommand)
  .item({
    pokemonId,
    // 👇 lastLevelUpgrade = 3
    level: $add(3)
    // 👇 lastLevelUpgrade = $subtract(10, $get('level'))
    level: 10,
    // 👇 lastLevelUpgrade = $subtract($get('otherAttr'), $get('level'))
    level: $get('otherAttr'),
  })
  .send()
```

:::note[Example]

<details className="details-in-admonition">
<summary>🔎 <b>$remove</b></summary>

```ts
import {
  $remove,
  $REMOVE,
  $IS_EXTENSION,
  isRemoval
} from 'dynamodb-toolbox/entity/actions/update/symbols'

const removal = $remove()

// 👇 Equivalent to
const removal = {
  [$REMOVE]: true,
  [$IS_EXTENSION]: true
}

const link = (input: UpdateItemInput) => {
  if (isRemoval(input)) {
    input[$REMOVE] // => true
  }
}
```

</details>

<details className="details-in-admonition">
<summary>🔎 <b>$get</b></summary>

```ts
import {
  $get,
  $GET,
  $IS_EXTENSION,
  isGetting
} from 'dynamodb-toolbox/entity/actions/update/symbols'

const getting = $get('attr', 'fallback')

// 👇 Equivalent to
const getting = {
  [$GET]: ['attr', 'fallback'],
  [$IS_EXTENSION]: true
}

const link = (input: UpdateItemInput) => {
  if (isGetting(input)) {
    input[$GET] // => ['attr', 'fallback']
  }
}
```

</details>

<details className="details-in-admonition">
<summary>🔎 <b>$sum</b></summary>

```ts
import {
  $sum,
  $SUM,
  $IS_EXTENSION,
  isSum
} from 'dynamodb-toolbox/entity/actions/update/symbols'

const sum = $sum(1, 2)

// 👇 Equivalent to
const sum = {
  [$SUM]: [1, 2],
  [$IS_EXTENSION]: true
}

const link = (input: UpdateItemInput) => {
  if (isSum(input)) {
    input[$SUM] // => [1, 2]
  }
}
```

</details>

<details className="details-in-admonition">
<summary>🔎 <b>$subtract</b></summary>

```ts
import {
  $subtract,
  $SUBTRACT,
  $IS_EXTENSION,
  isSubtraction
} from 'dynamodb-toolbox/entity/actions/update/symbols'

const subtraction = $subtract(1, 2)

// 👇 Equivalent to
const subtraction = {
  [$SUBTRACT]: [1, 2],
  [$IS_EXTENSION]: true
}

const link = (input: UpdateItemInput) => {
  if (isSubtraction(input)) {
    input[$SUBTRACT] // => [1, 2]
  }
}
```

</details>

<details className="details-in-admonition">
<summary>🔎 <b>$add</b></summary>

```ts
import {
  $add,
  $ADD,
  $IS_EXTENSION,
  isAddition
} from 'dynamodb-toolbox/entity/actions/update/symbols'

const addition = $add(1)

// 👇 Equivalent to
const addition = {
  [$ADD]: 1,
  [$IS_EXTENSION]: true
}

const link = (input: UpdateItemInput) => {
  if (isAddition(input)) {
    input[$ADD] // => 1
  }
}
```

</details>

<details className="details-in-admonition">
<summary>🔎 <b>$delete</b></summary>

```ts
import {
  $delete,
  $DELETE,
  $IS_EXTENSION,
  isDeletion
} from 'dynamodb-toolbox/entity/actions/update/symbols'

const deletion = $delete(new Set(['flight']))

// 👇 Equivalent to
const deletion = {
  [$DELETE]: new Set(['flight']),
  [$IS_EXTENSION]: true
}

const link = (input: UpdateItemInput) => {
  if (isDeletion(input)) {
    input[$DELETE] // => new Set(['flight'])
  }
}
```

</details>

<details className="details-in-admonition">
<summary>🔎 <b>$set</b></summary>

```ts
import {
  $set,
  $SET,
  $IS_EXTENSION,
  isSetting
} from 'dynamodb-toolbox/entity/actions/update/symbols'

const setting = $set({
  deep: {
    field: 'foo',
    otherField: 42
  }
})

// 👇 Equivalent to
const setting = {
  [$SET]: {
    deep: {
      field: 'foo',
      otherField: 42
    }
  },
  [$IS_EXTENSION]: true
}

const link = (input: UpdateItemInput) => {
  if (isSetting(input)) {
    input[$SET] // => {
    //   deep: {
    //     field: 'foo',
    //     otherField: 42
    //   }
    // }
  }
}
```

</details>

<details className="details-in-admonition">
<summary>🔎 <b>$append</b></summary>

```ts
import {
  $append,
  $APPEND,
  $IS_EXTENSION,
  isAppending
} from 'dynamodb-toolbox/entity/actions/update/symbols'

const appending = $append(['thunder', 'dragon-tail'])

// 👇 Equivalent to
const appending = {
  [$APPEND]: ['thunder', 'dragon-tail'],
  [$IS_EXTENSION]: true
}

const link = (input: UpdateItemInput) => {
  if (isAppending(input)) {
    input[$APPEND] // => ['thunder', 'dragon-tail']
  }
}
```

</details>

<details className="details-in-admonition">
<summary>🔎 <b>$prepend</b></summary>

```ts
import {
  $prepend,
  $PREPEND,
  $IS_EXTENSION,
  isPrepending
} from 'dynamodb-toolbox/entity/actions/update/symbols'

const prepending = $prepend(['thunder', 'dragon-tail'])

// 👇 Equivalent to
const prepending = {
  [$PREPEND]: ['thunder', 'dragon-tail'],
  [$IS_EXTENSION]: true
}

const link = (input: UpdateItemInput) => {
  if (isPrepending(input)) {
    input[$PREPEND] // => ['thunder', 'dragon-tail']
  }
}
```

</details>
