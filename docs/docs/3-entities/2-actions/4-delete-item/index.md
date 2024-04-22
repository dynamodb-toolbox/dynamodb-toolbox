---
title: DeleteItem
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# DeleteItemCommand

Performs a [DeleteItem Operation](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_DeleteItem.html) on an entity item.

## Usage

```ts
import { DeleteItemCommand } from '@dynamodb-toolbox/entity/actions/delete'

const deleteItemCommand = PokemonEntity.build(
  DeleteItemCommand
)

const params = deleteItemCommand.params()
await deleteItemCommand.send()
```

## Key

<p style={{marginTop: '-15px'}}><i>(required)</i></p>

The key of the item to delete (i.e. attributes that are tagged as part of the primary key):

```ts
await PokemonEntity.build(DeleteItemCommand)
  .key({ pokemonId: 'pikachu1' })
  .send()
```

You can use the `KeyInput` type from the [Parse action](../7-other/1-parse.md) to explicitely type an object as a `DeleteItemCommand` key:

```ts
import type { KeyInput } from '@dynamodb-toolbox/entity/actions/tParse'

const key: KeyInput<typeof PokemonEntity> = {
  pokemonId: 'pikachu1'
}

await PokemonEntity.build(DeleteItemCommand).key(key).send()
```

## Options

Additional options:

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

You can use the `DeleteItemOptions` type to explicitely type an object as `DeleteItemCommand` options:

```ts
import type { DeleteItemOptions } from '@dynamodb-toolbox/entity/actions/delete'

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

Available options are (see the [DynamoDB documentation](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_DeleteItem.html#API_DeleteItem_RequestParameters) for more details):

| Option         |               Type                | Default  | Description                                                                                                                                                                              |
| -------------- | :-------------------------------: | :------: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `condition`    | `Condition<typeof PokemonEntity>` |    -     | A condition that must be satisfied in order for a conditional DeleteItem operation to succeed.<br/><br/>See [Condition](TODO) for more details on how to write conditions.               |
| `returnValues` |       `ReturnValuesOption`        | `"NONE"` | Use `returnValues` if you want to get the item attributes as they appeared before they were deleted with the request.<br/><br/>Possible values are `"NONE"` and `"ALL_OLD"`.             |
| `metrics`      |          `MetricsOption`          | `"NONE"` | Determines whether item collection metrics are returned.<br/><br/>Possible values are `"NONE"` and `"SIZE"`.                                                                             |
| `capacity`     |         `CapacityOption`          | `"NONE"` | Determines the level of detail about provisioned or on-demand throughput consumption that is returned in the response.<br/><br/>Possible values are `"NONE"`, `"TOTAL"` and `"INDEXES"`. |

:::noteExamples

<Tabs>
<TabItem value="conditional" label="Conditional write">

```ts
await PokemonEntity.build(DeleteItemCommand)
  .key({ pokemonId: 'pikachu1' })
  .options({
    condition: { attr: 'level', eq: 49 }
  })
  .send()
```

</TabItem>
<TabItem value="return-values" label="Return values">

```ts
const {
  Attributes: prevPikachu
} = await PokemonEntity.build(DeleteItemCommand)
  .key({ pokemonId: 'pikachu1' })
  .options({ returnValues: 'ALL_OLD' })
  .send()
```

</TabItem>
</Tabs>

:::

## Response

The data is returned with the same response syntax as the [DynamoDB DeleteItem API](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_DeleteItem.html#API_DeleteItem_ResponseElements). If present, the returned item is formatted by the Entity.

You can use the `DeleteItemResponse` type to explicitely type an object as a `DeleteItemCommand` response:

```ts
import type { DeleteItemResponse } from '@dynamodb-toolbox/entity/actions/delete'

const deleteItemResponse: DeleteItemResponse<
  typeof PokemonEntity,
  // 👇 Optional options
  { returnValues: 'ALL_OLD' }
  // 👇 Typed as Pokemon | undefined
> = { Attributes: ... }
```
