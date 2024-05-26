---
title: BatchPut
sidebar_custom_props:
  sidebarActionType: write
---

# BatchPutItemRequest

Build a `PutItem` request on an entity item, to be used within [BatchWriteItem operations](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_BatchWriteItem.html).

:::info

Check the [batching documentation](../5-batching/index.md) to learn how to use `BatchPutItemRequests`.

:::

## Usage

```ts
import { batchWrite } from 'dynamodb-toolbox/entity/actions/batchWrite'
import { BatchPutItemRequest } from 'dynamodb-toolbox/entity/actions/batchPut'

const request = PokemonEntity.build(BatchPutItemRequest)

await batchWrite([request, ...otherRequests])
```

## Item

<p style={{ marginTop: '-15px' }}><i>(required)</i></p>

The item to write:

```ts
const request = PokemonEntity.build(
  BatchPutItemRequest
).item({
  pokemonId: 'pikachu1',
  name: 'Pikachu',
  type: 'electric',
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

Contrary to [`PutItems`](../2-put-item/index.md), batch writes cannot be [conditioned](../17-parse-condition/index.md), nor return the values of the written items.

:::
