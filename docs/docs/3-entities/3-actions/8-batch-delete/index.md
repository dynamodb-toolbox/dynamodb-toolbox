---
title: BatchDelete
sidebar_custom_props:
  sidebarActionType: delete
---

# BatchDeleteRequest

Builds a request to delete an entity item, to be used within [`BatchWriteCommands`](../../../2-tables/2-actions/5-batch-write/index.md):

```ts
import { BatchDeleteRequest } from 'dynamodb-toolbox/entity/actions/batchDelete'

const request = PokemonEntity.build(BatchDeleteRequest)

const params = request.params()
```

## Request

### `.key(...)`

<p style={{ marginTop: '-15px' }}><i>(required)</i></p>

The key of the item to delete (i.e. attributes that are tagged as part of the primary key):

```ts
const request = PokemonEntity.build(BatchDeleteRequest).key(
  { pokemonId: 'pikachu1' }
)
```

You can use the `KeyInput` type from the [`EntityParser`](../16-parse/index.md) action to explicitly type an object as a `BatchDeleteRequest` key object:

```ts
import type { KeyInput } from 'dynamodb-toolbox/entity/actions/parse'

const key: KeyInput<typeof PokemonEntity> = {
  pokemonId: 'pikachu1'
}

const request = PokemonEntity.build(BatchDeleteRequest).key(
  key
)
```

:::info

Contrary to [`DeleteItemCommands`](../4-delete-item/index.md), batch deletes cannot be [conditioned](../17-parse-condition/index.md), nor return the values of the deleted items.

:::
