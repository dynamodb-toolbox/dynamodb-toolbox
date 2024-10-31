---
title: BatchGet
sidebar_custom_props:
  sidebarActionType: read
---

# BatchGetRequest

Builds a request to get an entity item, to be used within [`BatchGetCommands`](../../../2-tables/2-actions/5-batch-get/index.md):

```ts
import { BatchGetRequest } from 'dynamodb-toolbox/entity/actions/batchGet'

const request = PokemonEntity.build(BatchGetRequest)

const params = request.params()
```

## Request

### `.key(...)`

<p style={{ marginTop: '-15px' }}><i>(required)</i></p>

The key of the item to get (i.e. attributes that are tagged as part of the primary key):

```ts
const request = PokemonEntity.build(BatchGetRequest).key({
  pokemonId: 'pikachu1'
})
```

You can use the `KeyInputItem` generic type to explicitly type an object as a `BatchGetRequest` key object:

```ts
import type { KeyInputItem } from 'dynamodb-toolbox/entity'

const key: KeyInputItem<typeof PokemonEntity> = {
  pokemonId: 'pikachu1'
}

const request =
  PokemonEntity.build(BatchGetRequest).key(key)
```
