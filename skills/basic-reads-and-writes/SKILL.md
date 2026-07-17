---
name: basic-reads-and-writes
description: >
  Use GetItemCommand, PutItemCommand, UpdateItemCommand, and
  DeleteItemCommand with correct key and item inputs, returnValues,
  conditions, and consistent-read options. Load this for ordinary CRUD flows
  before reaching for repositories, batches, or transactions.
type: core
library: dynamodb-toolbox
library_version: "local"
sources:
  - "dynamodb-toolbox/dynamodb-toolbox:docs/docs/3-entities/4-actions/1-get-item/index.md"
  - "dynamodb-toolbox/dynamodb-toolbox:docs/docs/3-entities/4-actions/3-put-item/index.md"
  - "dynamodb-toolbox/dynamodb-toolbox:docs/docs/3-entities/4-actions/4-update-item/index.md"
  - "dynamodb-toolbox/dynamodb-toolbox:src/entity/actions/get/getItemCommand.ts"
---

# DynamoDB-Toolbox - Basic Reads and Writes

Use command builders directly for the default CRUD path. They keep the key and item contracts explicit and match the library's action-oriented design.

## Setup

```ts
import { DeleteItemCommand } from 'dynamodb-toolbox/entity/actions/delete'
import { GetItemCommand } from 'dynamodb-toolbox/entity/actions/get'
import { PutItemCommand } from 'dynamodb-toolbox/entity/actions/put'
import { UpdateItemCommand } from 'dynamodb-toolbox/entity/actions/update'

await PokemonEntity.build(PutItemCommand)
  .item({ pokemonId: '001', species: 'PIKACHU', level: 10 })
  .send()

await PokemonEntity.build(GetItemCommand)
  .key({ pokemonId: '001', species: 'PIKACHU' })
  .options({ consistent: true })
  .send()

await PokemonEntity.build(UpdateItemCommand)
  .item({ pokemonId: '001', species: 'PIKACHU', level: 11 })
  .options({ returnValues: 'ALL_NEW' })
  .send()

await PokemonEntity.build(DeleteItemCommand)
  .key({ pokemonId: '001', species: 'PIKACHU' })
  .send()
```

## Core Patterns

### Use `.key(...)` for point reads and deletes

```ts
await PokemonEntity.build(GetItemCommand)
  .key({ pokemonId: '001', species: 'PIKACHU' })
  .send()
```

### Use `.item(...)` for puts and updates

```ts
await PokemonEntity.build(PutItemCommand)
  .item({ pokemonId: '001', species: 'PIKACHU', level: 10 })
  .send()
```

### Request returned images explicitly

```ts
await PokemonEntity.build(UpdateItemCommand)
  .item({ pokemonId: '001', species: 'PIKACHU', level: 11 })
  .options({ returnValues: 'ALL_NEW' })
  .send()
```

## Common Mistakes

### HIGH Calling send before the key or item is complete

Wrong:

```ts
await PokemonEntity.build(GetItemCommand).send()
```

Correct:

```ts
await PokemonEntity.build(GetItemCommand)
  .key({ pokemonId: '001', species: 'PIKACHU' })
  .send()
```

Sendable actions intentionally allow incremental construction, so missing required inputs fail late as incomplete actions.

Source: dynamodb-toolbox/dynamodb-toolbox:src/entity/actions/get/getItemCommand.ts

### HIGH Passing values that violate schema parsing

Wrong:

```ts
await PokemonEntity.build(PutItemCommand)
  .item({ pokemonId: '001', species: 'PIKACHU', level: '10' })
  .send()
```

Correct:

```ts
await PokemonEntity.build(PutItemCommand)
  .item({ pokemonId: '001', species: 'PIKACHU', level: 10 })
  .send()
```

Toolbox validates writes against schema types instead of silently coercing them.

Source: dynamodb-toolbox/dynamodb-toolbox:docs/docs/6-error-management/index.md

### MEDIUM Assuming update commands return the new item by default

Wrong:

```ts
const result = await PokemonEntity.build(UpdateItemCommand)
  .item({ pokemonId: '001', species: 'PIKACHU', level: 11 })
  .send()
```

Correct:

```ts
const result = await PokemonEntity.build(UpdateItemCommand)
  .item({ pokemonId: '001', species: 'PIKACHU', level: 11 })
  .options({ returnValues: 'ALL_NEW' })
  .send()
```

Write return images must be requested explicitly.

Source: dynamodb-toolbox/dynamodb-toolbox:docs/docs/3-entities/4-actions/4-update-item/index.md