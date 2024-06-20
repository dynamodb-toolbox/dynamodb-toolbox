---
title: BatchPut
sidebar_custom_props:
  sidebarActionType: write
---

# BatchPutItemRequest

Build a `PutItem` request on an entity item, to be used within [BatchWriteItem operations](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_BatchWriteItem.html).

:::info

Check the [Batching Documentation](../5-batching/index.md) to learn how to use `BatchPutItemRequests`.

:::

```ts
import { batchWrite } from 'dynamodb-toolbox/entity/actions/batchWrite'
import { BatchPutItemRequest } from 'dynamodb-toolbox/entity/actions/batchPut'

const request = PokemonEntity.build(BatchPutItemRequest)

const params = request.params()
await batchWrite([request, ...otherRequests])
```

## Request

### `.item(...)`

<p style={{ marginTop: '-15px' }}><i>(required)</i></p>

The item to write:

```ts
const request = PokemonEntity.build(
  BatchPutItemRequest
).item({
  pokemonId: 'pikachu1',
  name: 'Pikachu',
  pokeType: 'electric',
  level: 50,
  ...
})
```

You can use the `PutItemInput` type from the [`PutItemCommand`](../2-put-item/index.md) action to explicitely type an object as a `BatchPutItemRequest` item:

```ts
import type { PutItemInput } from 'dynamodb-toolbox/entity/actions/put'

const item: PutItemInput<typeof PokemonEntity> = {
  pokemonId: 'pikachu1',
  name: 'Pikachu',
  ...
}

const request = PokemonEntity.build(
  BatchPutItemRequest
).item(item)
```

:::info

Contrary to [`PutItemCommands`](../2-put-item/index.md), batch writes cannot be [conditioned](../17-parse-condition/index.md), nor return the previous values of the written items.

:::
