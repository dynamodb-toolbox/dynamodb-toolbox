---
title: PutItem
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# PutItemCommand

Performs a [PutItem Operation](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_PutItem.html) on an entity item.

## Usage

```ts
import { PutItemCommand } from 'dynamodb-toolbox/entity/actions/put'

const putItemCommand = PokemonEntity.build(PutItemCommand)

const params = putItemCommand.params()
await putItemCommand.send()
```

## Item

<p style={{ marginTop: '-15px' }}><i>(required)</i></p>

The item to write:

```ts
await PokemonEntity.build(PutItemCommand)
  .item({
    pokemonId: 'pikachu1',
    name: 'Pikachu',
    type: 'electric',
    level: 50
    // ...
  })
  .send()
```

You can use the `PutItemInput` type to explicitely type an object as a `PutItemCommand` item:

```ts
import type { PutItemInput } from 'dynamodb-toolbox/entity/actions/put'

const item: PutItemInput<typeof PokemonEntity> = {
  pokemonId: 'pikachu1',
  name: 'Pikachu',
  ...
}

await PokemonEntity.build(PutItemCommand).item(item).send()
```

:::info

Note that `PutItemInput` differs from `ParsedItem` as defaulted and linked attributes are optional.

:::

## Options

Additional options:

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

You can use the `PutItemOptions` type to explicitely type an object as a `PutItemCommand` options:

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

Available options are (see the [DynamoDB documentation](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_PutItem.html#API_PutItem_RequestParameters) for more details):

| Option         |               Type                | Default  | Description                                                                                                                                                                              |
| -------------- | :-------------------------------: | :------: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `condition`    | `Condition<typeof PokemonEntity>` |    -     | A condition that must be satisfied in order for a conditional PutItem operation to succeed.<br/><br/>See [Condition](TODO) for more details on how to write conditions.                  |
| `returnValues` |       `ReturnValuesOption`        | `"NONE"` | Use `returnValues` if you want to get the item attributes as they appeared before they were updated with the request.<br/><br/>Possible values are `"NONE"` and `"ALL_OLD"`.             |
| `metrics`      |          `MetricsOption`          | `"NONE"` | Determines whether item collection metrics are returned.<br/><br/>Possible values are `"NONE"` and `"SIZE"`.                                                                             |
| `capacity`     |         `CapacityOption`          | `"NONE"` | Determines the level of detail about provisioned or on-demand throughput consumption that is returned in the response.<br/><br/>Possible values are `"NONE"`, `"TOTAL"` and `"INDEXES"`. |

:::noteExamples

<Tabs>
<TabItem value="conditional" label="Conditional write">

```ts
await PokemonEntity.build(PutItemCommand)
  .item({
    pokemonId: 'pikachu1',
    name: 'Pikachu',
    type: 'electric',
    level: 50
  })
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
} = await PokemonEntity.build(PutItemCommand)
  .item({
    pokemonId: 'pikachu1',
    name: 'Pikachu',
    type: 'electric',
    level: 50
  })
  .options({ returnValues: 'ALL_OLD' })
  .send()
```

</TabItem>
</Tabs>

:::

## Response

The data is returned with the same response syntax as the [DynamoDB PutItem API](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_PutItem.html#API_PutItem_ResponseElements). If present, the returned item is formatted by the Entity.

You can use the `PutItemResponse` type to explicitely type an object as a `PutItemCommand` response:

```ts
import type { PutItemResponse } from 'dynamodb-toolbox/entity/actions/put'

const response: PutItemResponse<
  typeof PokemonEntity,
  // 👇 Optional options
  { returnValues: 'ALL_OLD' }
  // 👇 Typed as Pokemon | undefined
> = { Attributes: ... }
```
