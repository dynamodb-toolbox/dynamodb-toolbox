---
title: BatchDelete
sidebar_custom_props:
  sidebarActionType: delete
---

# BatchDeleteRequest

Builds a request to delete an entity item, to be used within [`BatchWriteCommands`](../../../2-tables/2-actions/6-batch-write/index.md):

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

You can use the `KeyInputItem` generic type to explicitly type an object as a `BatchDeleteRequest` key object:

```ts
import type { KeyInputItem } from 'dynamodb-toolbox/entity'

const key: KeyInputItem<typeof PokemonEntity> = {
  pokemonId: 'pikachu1'
}

const request = PokemonEntity.build(BatchDeleteRequest).key(
  key
)
```

:::info

Contrary to [`DeleteItemCommand`](../5-delete-item/index.md), batch deletes cannot be [conditioned](../18-parse-condition/index.md), nor return the values of the deleted items.

:::
