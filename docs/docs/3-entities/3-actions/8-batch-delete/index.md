---
title: BatchDelete
sidebar_custom_props:
  sidebarActionType: delete
---

# BatchDeleteItemRequest

Build a `DeleteItem` request on an entity item, to be used within [BatchWriteItem operations](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_BatchWriteItem.html).

:::info

Check the [Batching Documentation](../5-batching/index.md) to learn how to use `BatchDeleteItemRequests`.

:::

```ts
import { batchWrite } from 'dynamodb-toolbox/entity/actions/batchWrite'
import { BatchDeleteItemRequest } from 'dynamodb-toolbox/entity/actions/batchDelete'

const request = PokemonEntity.build(BatchDeleteItemRequest)

const params = request.params()
await batchWrite([request, ...otherRequests])
```

## Request

### `.key(...)`

<p style={{ marginTop: '-15px' }}><i>(required)</i></p>

The key of the item to delete (i.e. attributes that are tagged as part of the primary key):

```ts
const request = PokemonEntity.build(
  BatchDeleteItemRequest
).key({ pokemonId: 'pikachu1' })
```

You can use the `KeyInput` type from the [`EntityParser`](../16-parse/index.md) action to explicitely type an object as a `BatchDeleteItemRequest` key:

```ts
import type { KeyInput } from 'dynamodb-toolbox/entity/actions/parse'

const key: KeyInput<typeof PokemonEntity> = {
  pokemonId: 'pikachu1'
}

const request = PokemonEntity.build(
  BatchDeleteItemRequest
).key(key)
```

:::info

Contrary to [`DeleteItemCommands`](../4-delete-item/index.md), batch deletes cannot be [conditioned](../17-parse-condition/index.md), nor return the values of the deleted items.

:::
