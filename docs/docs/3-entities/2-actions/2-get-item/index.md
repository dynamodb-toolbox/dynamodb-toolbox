---
title: GetItem
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

# GetItemCommand

Performs a [GetItem Operation](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_GetItem.html) on an entity.

## Usage

```ts
import { GetItemCommand } from '@dynamodb-toolbox/entity/actions/get'

const getItemCommand = PokemonEntity.build(GetItemCommand)

const params = getItemCommand.params()
await getItemCommand.send()
```

## Key

REQUIRED.

The key attributes of the item, required to build the primary key.

```ts
const { Item } = await PokemonEntity.build(GetItemCommand)
  .key({ pokemonId: 'pikachu1' })
  .send()
```

If needed, you can use the `KeyInput` type from the [`Parse` action](../7-other/1-parse.md) to explicitely type an object as a `GetItemCommand` key:

```ts
import type { KeyInput } from '@dynamodb-toolbox/entity/actions/tParse'

const pikachuKey: KeyInput<typeof PokemonEntity> = {
  pokemonId: 'pikachu1'
}

const { Item } = await PokemonEntity.build(GetItemCommand)
  .key(pikachuKey)
  .send()
```

## Options

You can set additional options via the `options` setter:

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

If needed, you can use the `GetItemOptions` type to explicitely type an object as `GetItemCommand` options:

```ts
import type { GetItemOptions } from '@dynamodb-toolbox/entity/actions/get'

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

List of available options:

| Option       |       Type       | Default  | Description                                                                               |
| ------------ | :--------------: | :------: | ----------------------------------------------------------------------------------------- |
| `consistent` |    `boolean`     | `false`  | Wether to read consistently or not.                                                       |
| `attributes` | `Path<Entity>[]` |    -     | A list of attributes (potentially nested) to retrieve. See [Projection expression](TODO). |
| `capacity`   | `CapacityOption` | `"NONE"` | See [Capacity](TODO)                                                                      |

:::noteExamples

<Tabs>
<TabItem value="consistent" label="Consistent">

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

The data is returned with the same response syntax as the [DynamoDB GetItem API](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_GetItem.html#API_GetItem_ResponseElements).

You can use the `GetItemResponse` type to explicitely type an object as a `GetItemCommand` response:

```ts
import type { GetItemResponse } from '@dynamodb-toolbox/entity/actions/get'

const getItemResponse: GetItemResponse<
  typeof PokemonEntity,
  // 👇 Optional options
  { attributes: ['type', 'level'] }
> = { Item: ... }
```
