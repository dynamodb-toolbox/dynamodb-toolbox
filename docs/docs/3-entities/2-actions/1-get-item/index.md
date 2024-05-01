---
title: GetItem
sidebar_custom_props:
  sidebarActionType: read
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# GetItemCommand

Performs a [GetItem Operation](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_GetItem.html) on an entity item.

## Usage

```ts
import { GetItemCommand } from 'dynamodb-toolbox/entity/actions/get'

const getItemCommand = PokemonEntity.build(GetItemCommand)

const params = getItemCommand.params()
await getItemCommand.send()
```

## Key

<p style={{ marginTop: '-15px' }}><i>(required)</i></p>

The key of the item to get (i.e. attributes that are tagged as part of the primary key):

```ts
const { Item } = await PokemonEntity.build(GetItemCommand)
  .key({ pokemonId: 'pikachu1' })
  .send()
```

You can use the `KeyInput` type from the [Parse action](../16-parse.md) to explicitely type an object as a `GetItemCommand` key:

```ts
import type { KeyInput } from 'dynamodb-toolbox/entity/actions/tParse'

const key: KeyInput<typeof PokemonEntity> = {
  pokemonId: 'pikachu1'
}

const { Item } = await PokemonEntity.build(GetItemCommand)
  .key(key)
  .send()
```

## Options

Additional options:

```ts
const { Item } = await PokemonEntity.build(GetItemCommand)
  .key(...)
  .options({
    consistent: true,
    attributes: ['type', 'level'],
    ...
  })
  .send()
```

You can use the `GetItemOptions` type to explicitely type an object as a `GetItemCommand` options:

```ts
import type { GetItemOptions } from 'dynamodb-toolbox/entity/actions/get'

const options: PutItemOptions<typeof PokemonEntity> = {
  consistent: true,
  attributes: ['type', 'level'],
  ...
}

await PokemonEntity.build(GetItemCommand)
  .key(...)
  .options(options)
  .send()
```

Available options are (see the [DynamoDB documentation](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_GetItem.html#API_GetItem_RequestParameters) for more details):

| Option       |       Type       | Default  | Description                                                                                                                                                                              |
| ------------ | :--------------: | :------: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `consistent` |    `boolean`     | `false`  | By default, read operations are <b>eventually</b> consistent (which improves performances and reduces costs).<br/><br/>Set to `true` to use <b>strongly</b> consistent reads.            |
| `attributes` | `Path<Entity>[]` |    -     | To specify a list of attributes to retrieve (improves performances but does not reduce costs).<br/><br/>See [Filtering Attributes](TODO) for more details on how to filter attributes.   |
| `capacity`   | `CapacityOption` | `"NONE"` | Determines the level of detail about provisioned or on-demand throughput consumption that is returned in the response.<br/><br/>Possible values are `"NONE"`, `"TOTAL"` and `"INDEXES"`. |

:::noteExamples

<Tabs>
<TabItem value="consistent" label="Consistent read">

```ts
const { Item } = await PokemonEntity.build(GetItemCommand)
  .key({ pokemonId: 'pikachu1' })
  .options({ consistent: true })
  .send()
```

</TabItem>
<TabItem value="filtered" label="Filtered">

```ts
const { Item } = await PokemonEntity.build(GetItemCommand)
  .key({ pokemonId: 'pikachu1' })
  .options({ attributes: ['type', 'level'] })
  .send()
```

</TabItem>
</Tabs>

:::

## Response

The data is returned with the same response syntax as the [DynamoDB GetItem API](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_GetItem.html#API_GetItem_ResponseElements). If present, the returned item is formatted by the Entity.

You can use the `GetItemResponse` type to explicitely type an object as a `GetItemCommand` response:

```ts
import type { GetItemResponse } from 'dynamodb-toolbox/entity/actions/get'

const getItemResponse: GetItemResponse<
  typeof PokemonEntity,
  // 👇 Optional options
  { attributes: ['type', 'level'] }
  // 👇 Typed as Pokemon | undefined
> = { Item: ... }
```
