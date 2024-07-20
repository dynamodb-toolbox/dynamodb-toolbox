---
title: BatchPut
sidebar_custom_props:
  sidebarActionType: write
---

# BatchPutRequest

Builds a request to put an entity item, to be used within [`BatchWriteCommands`](../../../2-tables/2-actions/5-batch-write/index.md):

```ts
import { BatchPutRequest } from 'dynamodb-toolbox/entity/actions/batchPut'

const request = PokemonEntity.build(BatchPutRequest)

const params = request.params()
```

## Request

### `.item(...)`

<p style={{ marginTop: '-15px' }}><i>(required)</i></p>

The item to write:

```ts
const request = PokemonEntity.build(BatchPutRequest).item({
  pokemonId: 'pikachu1',
  name: 'Pikachu',
  pokeType: 'electric',
  level: 50,
  ...
})
```

You can use the `PutItemInput` type from the [`PutItemCommand`](../2-put-item/index.md) action to explicitly type an object as a `BatchPutRequest` item object:

```ts
import type { PutItemInput } from 'dynamodb-toolbox/entity/actions/put'

const item: PutItemInput<typeof PokemonEntity> = {
  pokemonId: 'pikachu1',
  name: 'Pikachu',
  ...
}

const request =
  PokemonEntity.build(BatchPutRequest).item(item)
```

:::info

Contrary to [`PutItemCommands`](../2-put-item/index.md), batch writes cannot be [conditioned](../17-parse-condition/index.md), nor return the previous values of the written items.

:::
