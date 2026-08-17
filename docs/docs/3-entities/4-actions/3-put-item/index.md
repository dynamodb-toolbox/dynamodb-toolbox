---
title: PutItem
sidebar_custom_props:
  sidebarActionType: write
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# PutItemCommand

Performs a [PutItem Operation](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_PutItem.html) on an entity item:

```ts
import { PutItemCommand } from 'dynamodb-toolbox/entity/actions/put'

const putItemCommand = PokemonEntity.build(PutItemCommand)

const params = putItemCommand.params()
await putItemCommand.send()
```

## Request

### `.item(...)`

<p style={{ marginTop: '-15px' }}><i>(required)</i></p>

The item to write:

```ts
await PokemonEntity.build(PutItemCommand)
  .item({
    pokemonId: 'pikachu1',
    name: 'Pikachu',
    pokeType: 'electric',
    level: 50,
    ...
  })
  .send()
```

You can use the `PutItemInput` type to explicitly type an object as a `PutItemCommand` item object:

```ts
import type { PutItemInput } from 'dynamodb-toolbox/entity/actions/put'

const item: PutItemInput<typeof PokemonEntity> = {
  pokemonId: 'pikachu1',
  name: 'Pikachu',
  ...
}

await PokemonEntity.build(PutItemCommand).item(item).send()
```

### `.options(...)`

Provides additional options:

```ts
await PokemonEntity.build(PutItemCommand)
  .item(...)
  .options({
    returnValues: 'ALL_OLD',
    capacity: 'TOTAL',
    ...
  })
  .send()
```

You can **provide a callback** to partially update previous options:

```ts
await putItemCommand
  .options(prevOptions => ({
    ...prevOptions,
    returnValues: 'ALL_OLD'
  }))
  .send()
```

You can use the `PutItemOptions` type to explicitly type an object as a `PutItemCommand` options object:

```ts
import type { PutItemOptions } from 'dynamodb-toolbox/entity/actions/put'

const options: PutItemOptions<typeof PokemonEntity> = {
  returnValues: 'ALL_OLD',
  capacity: 'TOTAL',
  ...
}

await PokemonEntity.build(PutItemCommand)
  .item(...)
  .options(options)
  .send()
```

Available options (see the [DynamoDB documentation](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_PutItem.html#API_PutItem_RequestParameters) for more details):

| Option                                          |               Type                | Default  | Description                                                                                                                                                                                                                   |
| ----------------------------------------------- | :-------------------------------: | :------: | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `condition`                                     | `Condition<typeof PokemonEntity>` |    -     | A condition that must be satisfied in order for the `PutItemCommand` to succeed.<br/><br/>See the [`ConditionParser`](../19-parse-condition/index.md#building-conditions) action for more details on how to write conditions. |
| `returnValues`                                  |       `ReturnValuesOption`        | `"NONE"` | To get the item attributes as they appeared before they were updated with the request.<br/><br/>Possible values are `"NONE"` and `"ALL_OLD"`.                                                                                 |
| <code>returnValuesOn<wbr/>ConditionFalse</code> |       `ReturnValuesOption`        | `"NONE"` | To get the item attributes if the `condition` fails.<br/><br/>Possible values are `"NONE"` and `"ALL_OLD"`.                                                                                                                   |
| `metrics`                                       |          `MetricsOption`          | `"NONE"` | Determines whether item collection metrics are returned.<br/><br/>Possible values are `"NONE"` and `"SIZE"`.                                                                                                                  |
| `capacity`                                      |         `CapacityOption`          | `"NONE"` | Determines the level of detail about provisioned or on-demand throughput consumption that is returned in the response.<br/><br/>Possible values are `"NONE"`, `"TOTAL"` and `"INDEXES"`.                                      |
| `tableName`                                     |             `string`              |    -     | Overrides the `Table` name. Mostly useful for [multitenancy](https://en.wikipedia.org/wiki/Multitenancy).                                                                                                                     |

## Examples

:::note[Examples]

<Tabs>
<TabItem value="basic" label="Basic">

```ts
await PokemonEntity.build(PutItemCommand)
  .item({
    pokemonId: 'pikachu1',
    name: 'Pikachu',
    pokeType: 'electric',
    level: 50
  })
  .send()
```

</TabItem>
<TabItem value="conditional" label="Conditional">

```ts
await PokemonEntity.build(PutItemCommand)
  .item({
    pokemonId: 'pikachu1',
    name: 'Pikachu',
    pokeType: 'electric',
    level: 50
  })
  .options({
    // 👇 Checks that item didn't previously exist
    condition: { attr: 'pokemonId', exists: false },
    // 👇 Includes the Item in the error if so
    returnValuesOnConditionFalse: 'ALL_OLD'
  })
  .send()
```

</TabItem>
<TabItem value="return-values" label="Return values">

```ts
const { Attributes: prevPikachu } =
  await PokemonEntity.build(PutItemCommand)
    .item({
      pokemonId: 'pikachu1',
      name: 'Pikachu',
      pokeType: 'electric',
      level: 50
    })
    .options({ returnValues: 'ALL_OLD' })
    .send()
```

</TabItem>
<TabItem value="multitenant" label="Multitenant">

```ts
await PokemonEntity.build(PutItemCommand)
  .item({
    pokemonId: 'pikachu1',
    name: 'Pikachu',
    pokeType: 'electric',
    level: 50
  })
  .options({ tableName: `tenant-${tenantId}-pokemons` })
  .send()
```

</TabItem>
<TabItem value="aborted" label="Aborted">

```ts
const abortController = new AbortController()
const abortSignal = abortController.signal

await PokemonEntity.build(PutItemCommand)
  .item({
    pokemonId: 'pikachu1',
    name: 'Pikachu',
    pokeType: 'electric',
    level: 50
  })
  .send({ abortSignal })

// 👇 Aborts the command
abortController.abort()
```

</TabItem>
</Tabs>

:::

## Response

The data is returned using the same response syntax as the [DynamoDB PutItem API](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_PutItem.html#API_PutItem_ResponseElements), with an additional `ToolboxItem` property, which allows you to retrieve the item generated by DynamoDB-Toolbox:

```ts
const { ToolboxItem: generatedPokemon } =
  await PokemonEntity.build(PutItemCommand)
    .item(...)
    .send()

// 👇 Great for auto-generated attributes
const createdTimestamp = generatedPokemon.created
```

If present, the returned item is formatted by the Entity.

You can use the `PutItemResponse` type to explicitly type an object as a `PutItemCommand` response object:

```ts
import type { PutItemResponse } from 'dynamodb-toolbox/entity/actions/put'

const response: PutItemResponse<
  typeof PokemonEntity,
  // 👇 Optional options
  { returnValues: 'ALL_OLD' }
  // 👇 Typed as Pokemon | undefined
> = { Attributes: ... }
```

## Error handling

If a `condition` is provided **and** `returnValuesOnConditionFalse` is set to `"ALL_OLD"`, a failing condition makes DynamoDB throw a `ConditionalCheckFailedException` carrying the item that was **not** deleted.

DynamoDB-Toolbox can enrich this exception with a `FormattedItem` property, containing the formatted item. Use the `assertConditionCheckFailed` assertion or the `isConditionCheckFailed` type guard to read it in a type-safe way:

```ts
import {
  assertConditionCheckFailed,
  isConditionCheckFailed
} from 'dynamodb-toolbox/entity/actions/put'

try {
  await PokemonEntity.build(PutItemCommand)
    .item({
      pokemonId: 'pikachu1',
      name: 'Pikachu',
      pokeType: 'electric',
      level: 50
    })
    .options({
      condition: { attr: 'pokemonId', exists: false },
      returnValuesOnConditionFalse: 'ALL_OLD'
    })
    .send()
} catch (error) {
  // 👇 Rethrow other error classes + narrow `error` type
  assertConditionCheckFailed(error, PokemonEntity)
  const prevPikachu = error.FormattedItem // 🙌 Correctly typed

  // ...OR use a type guard
  if (isConditionCheckFailed(error, PokemonEntity)) {
    const prevPikachu = error.FormattedItem // 🙌 Correctly typed
  }
}
```

:::note

`FormattedItem` is always **optional**: Formatting is best-effort, so an exception whose item cannot be formatted by its entity (e.g. an invalid item) is left with no `FormattedItem` property.

:::
