---
title: PutItem
---

# PutItem

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

# ScanCommand

Performs a [PutItem Operation](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_PutItem.html) on an entity.

## Usage

```ts
import { PutItemCommand } from '@dynamodb-toolbox/entity/actions/put'

const putItemCommand = PokemonEntity.build(PutItemCommand)

const params = putItemCommand.params()
await putItemCommand.send()
```

## Item

REQUIRED.

The item, including key attributes.

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

If needed, you can use the `PutItemInput` type to explicitely type an object as a `PutItemCommand` item:

```ts
import type { PutItemInput } from '@dynamodb-toolbox/entity/actions/put'

const item: PutItemInput<typeof PokemonEntity> = {
  pokemonId: 'pikachu1',
  name: 'Pikachu',
  ...
}

const putItemCommand = PokeTable.build(PutItemCommand).item(item)
```

:::info

Note that `PutItemInput` differs from `FormattedItem` as defaults and links will be resolved by the schema when missing.

:::

## Options

You can set additional options via the `options` setter:

```ts
await PokemonEntity.build(PutItemCommand)
  .item(...)
  .options({
    consistent: true,
    returnValues: "ALL_OLD"
    ...
  })
  .send()
```

If needed, you can use the `PutItemOptions` type to explicitely type an object as `PutItemCommand` options:

```ts
import type { PutItemOptions } from '@dynamodb-toolbox/entity/actions/put'

const options: PutItemOptions<typeof PokemonEntity> = {
  consistent: true,
  returnValues: "ALL_OLD"
  ...
}

await PokemonEntity.build(PutItemCommand)
  .item(...)
  .options(options)
  .send()
```

List of available options:

| Option         |               Type                | Default  | Description                                                                                                                                                       |
| -------------- | :-------------------------------: | :------: | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `condition`    | `Condition<typeof PokemonEntity>` |    -     | See [Condition](TODO)                                                                                                                                             |
| `returnValues` |       `ReturnValuesOption`        | `"NONE"` | See [ReturnValues](TODO). Possible values are: <ul><li>`"NONE"`</li><li>`"ALL_OLD"`</li><li>`"UPDATED_OLD"`</li><li>`"ALL_NEW"`</li><li>`"UPDATED_NEW"`</li></ul> |
| `metrics`      |          `MetricsOption`          | `"NONE"` | See [Metrics](TODO)                                                                                                                                               |
| `capacity`     |         `CapacityOption`          | `"NONE"` | See [Capacity](TODO)                                                                                                                                              |

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
  .options({ condition: { attr: 'level', gte: 42 } })
  .send()
```

</TabItem>
<TabItem value="all-old" label="Retrieve previous item">

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

The data is returned with the same response syntax as the [DynamoDB PutItem API](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_PutItem.html#API_PutItem_ResponseElements).

You can use the `PutItemResponse` type to explicitely type an object as a `PutItemCommand` response:

```ts
import type { PutItemResponse } from '@dynamodb-toolbox/entity/actions/put'

const putItemResponse: PutItemResponse<
  typeof PokemonEntity,
  // 👇 Optional options
  { returnValues: "ALL_OLD" }
> = { Attributes: ... }
```
