---
title: DeleteItem
sidebar_custom_props:
  sidebarActionType: delete
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# DeleteItemCommand

Performs a [DeleteItem Operation](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_DeleteItem.html) on an entity item:

```ts
import { DeleteItemCommand } from 'dynamodb-toolbox/entity/actions/delete'

const deleteItemCommand = PokemonEntity.build(
  DeleteItemCommand
)

const params = deleteItemCommand.params()
await deleteItemCommand.send()
```

## Request

### `.key(...)`

<p style={{ marginTop: '-15px' }}><i>(required)</i></p>

The key of the item to delete (i.e. attributes that are tagged as part of the primary key):

```ts
await PokemonEntity.build(DeleteItemCommand)
  .key({ pokemonId: 'pikachu1' })
  .send()
```

You can use the `KeyInputItem` generic type to explicitly type an object as a `DeleteItemCommand` key object:

```ts
import type { KeyInputItem } from 'dynamodb-toolbox/entity'

const key: KeyInputItem<typeof PokemonEntity> = {
  pokemonId: 'pikachu1'
}

await PokemonEntity.build(DeleteItemCommand).key(key).send()
```

### `.options(...)`

Provides additional options:

```ts
await PokemonEntity.build(DeleteItemCommand)
  .key(...)
  .options({
    returnValues: 'ALL_OLD',
    capacity: 'TOTAL',
    ...
  })
  .send()
```

You can use the `DeleteItemOptions` type to explicitly type an object as `DeleteItemCommand` options object:

```ts
import type { DeleteItemOptions } from 'dynamodb-toolbox/entity/actions/delete'

const options: DeleteItemOptions<typeof PokemonEntity> = {
  returnValues: 'ALL_OLD',
  capacity: 'TOTAL',
  ...
}

await PokemonEntity.build(DeleteItemCommand)
  .key(...)
  .options(options)
  .send()
```

Available options (see the [DynamoDB documentation](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_DeleteItem.html#API_DeleteItem_RequestParameters) for more details):

| Option                                          |               Type                | Default  | Description                                                                                                                                                                                                                      |
| ----------------------------------------------- | :-------------------------------: | :------: | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `condition`                                     | `Condition<typeof PokemonEntity>` |    -     | A condition that must be satisfied in order for the `DeleteItemCommand` to succeed.<br/><br/>See the [`ConditionParser`](../18-parse-condition/index.md#building-conditions) action for more details on how to write conditions. |
| `returnValues`                                  |       `ReturnValuesOption`        | `"NONE"` | To get the item attributes as they appeared before they were deleted with the request.<br/><br/>Possible values are `"NONE"` and `"ALL_OLD"`.                                                                                    |
| <code>returnValuesOn<wbr/>ConditionFalse</code> |       `ReturnValuesOption`        | `"NONE"` | To get the item attributes if the `condition` fails.<br/><br/>Possible values are `"NONE"` and `"ALL_OLD"`.                                                                                                                      |
| `metrics`                                       |          `MetricsOption`          | `"NONE"` | Determines whether item collection metrics are returned.<br/><br/>Possible values are `"NONE"` and `"SIZE"`.                                                                                                                     |
| `capacity`                                      |         `CapacityOption`          | `"NONE"` | Determines the level of detail about provisioned or on-demand throughput consumption that is returned in the response.<br/><br/>Possible values are `"NONE"`, `"TOTAL"` and `"INDEXES"`.                                         |
| `tableName`                                     |             `string`              |    -     | Overrides the `Table` name. Mostly useful for [multitenancy](https://en.wikipedia.org/wiki/Multitenancy).                                                                                                                        |

:::note[Examples]

<Tabs>
<TabItem value="conditional" label="Conditional write">

```ts
await PokemonEntity.build(DeleteItemCommand)
  .key({ pokemonId: 'pikachu1' })
  .options({
    // 👇 Makes sure pokemon was archived
    condition: { attr: 'archived', eq: true },
    // 👇 Includes the Item in the error if not so
    returnValuesOnConditionFalse: 'ALL_OLD'
  })
  .send()
```

</TabItem>
<TabItem value="return-values" label="Return values">

```ts
const { Attributes: prevPikachu } =
  await PokemonEntity.build(DeleteItemCommand)
    .key({ pokemonId: 'pikachu1' })
    .options({
      returnValues: 'ALL_OLD'
    })
    .send()
```

</TabItem>
<TabItem value="multitenancy" label="Multitenancy">

```ts
await PokemonEntity.build(DeleteItemCommand)
  .key({ pokemonId: 'pikachu1' })
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

await PokemonEntity.build(DeleteItemCommand)
  .key({ pokemonId: 'pikachu1' })
  .send({ abortSignal })

// 👇 Aborts the command
abortController.abort()
```

</TabItem>
</Tabs>

:::

## Response

The data is returned using the same response syntax as the [DynamoDB DeleteItem API](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_DeleteItem.html#API_DeleteItem_ResponseElements). If present, the returned item is formatted by the Entity.

You can use the `DeleteItemResponse` type to explicitly type an object as a `DeleteItemCommand` response object:

```ts
import type { DeleteItemResponse } from 'dynamodb-toolbox/entity/actions/delete'

const deleteItemResponse: DeleteItemResponse<
  typeof PokemonEntity,
  // 👇 Optional options
  { returnValues: 'ALL_OLD' }
  // 👇 Typed as Pokemon | undefined
> = { Attributes: ... }
```
