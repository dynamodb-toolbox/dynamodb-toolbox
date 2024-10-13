---
title: GetItem
sidebar_custom_props:
  sidebarActionType: read
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# GetItemCommand

Performs a [GetItem Operation](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_GetItem.html) on an entity item:

```ts
import { GetItemCommand } from 'dynamodb-toolbox/entity/actions/get'

const getItemCommand = PokemonEntity.build(GetItemCommand)

const params = getItemCommand.params()
await getItemCommand.send()
```

## Request

### `.key(...)`

<p style={{ marginTop: '-15px' }}><i>(required)</i></p>

The key of the item to get (i.e. attributes that are tagged as part of the primary key):

```ts
const { Item } = await PokemonEntity.build(GetItemCommand)
  .key({ pokemonId: 'pikachu1' })
  .send()
```

You can use the `KeyInputItem` generic type to explicitly type an object as a `GetItemCommand` key object:

```ts
import type { KeyInputItem } from 'dynamodb-toolbox/entity'

const key: KeyInputItem<typeof PokemonEntity> = {
  pokemonId: 'pikachu1'
}

const { Item } = await PokemonEntity.build(GetItemCommand)
  .key(key)
  .send()
```

### `.options(...)`

Provides additional options:

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

You can use the `GetItemOptions` type to explicitly type an object as a `GetItemCommand` options object:

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

Available options (see the [DynamoDB documentation](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_GetItem.html#API_GetItem_RequestParameters) for more details):

| Option       |       Type       | Default  | Description                                                                                                                                                                                                               |
| ------------ | :--------------: | :------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `consistent` |    `boolean`     | `false`  | By default, read operations are <b>eventually</b> consistent (which improves performances and reduces costs).<br/><br/>Set to `true` to use <b>strongly</b> consistent reads.                                             |
| `attributes` | `Path<Entity>[]` |    -     | To specify a list of attributes to retrieve (improves performances but does not reduce costs).<br/><br/>See the [`PathParser`](../19-parse-paths/index.md#paths) action for more details on how to write attribute paths. |
| `capacity`   | `CapacityOption` | `"NONE"` | Determines the level of detail about provisioned or on-demand throughput consumption that is returned in the response.<br/><br/>Possible values are `"NONE"`, `"TOTAL"` and `"INDEXES"`.                                  |
| `tableName`  |     `string`     |    -     | Overrides the `Table` name. Mostly useful for [multitenancy](https://en.wikipedia.org/wiki/Multitenancy).                                                                                                                 |

:::noteExamples

<Tabs>
<TabItem value="consistent" label="Consistent read">

```ts
const { Item } = await PokemonEntity.build(GetItemCommand)
  .key({ pokemonId: 'pikachu1' })
  .options({
    consistent: true
  })
  .send()
```

</TabItem>
<TabItem value="attributes" label="Attributes">

```ts
const { Item } = await PokemonEntity.build(GetItemCommand)
  .key({ pokemonId: 'pikachu1' })
  .options({
    attributes: ['type', 'level']
  })
  .send()
```

</TabItem>
<TabItem value="multitenant" label="Multitenant">

```ts
const { Item } = await PokemonEntity.build(GetItemCommand)
  .key({ pokemonId: 'pikachu1' })
  .options({
    tableName: `tenant-${tenantId}-pokemons`
  })
  .send()
```

</TabItem>
</Tabs>

:::

## Response

The data is returned using the same response syntax as the [DynamoDB GetItem API](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_GetItem.html#API_GetItem_ResponseElements). If present, the returned item is formatted by the Entity.

You can use the `GetItemResponse` type to explicitly type an object as a `GetItemCommand` response object:

```ts
import type { GetItemResponse } from 'dynamodb-toolbox/entity/actions/get'

const getItemResponse: GetItemResponse<
  typeof PokemonEntity,
  // 👇 Optional options
  { attributes: ['type', 'level'] }
  // 👇 Typed as Pick<Pokemon, 'type' | 'level'> | undefined
> = { Item: ... }
```
