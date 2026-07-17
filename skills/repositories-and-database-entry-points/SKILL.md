---
name: repositories-and-database-entry-points
description: >
  Choose between command builders, EntityRepository, TableRepository,
  Registry, and Database in dynamodb-toolbox. Load this when deciding the
  right abstraction level for repetitive CRUD, table-scoped reads, MCP,
  registry, or sync-style entry points.
type: core
library: dynamodb-toolbox
library_version: "local"
sources:
  - "dynamodb-toolbox/dynamodb-toolbox:docs/docs/2-tables/2-actions/12-repository/index.md"
  - "dynamodb-toolbox/dynamodb-toolbox:docs/docs/3-entities/4-actions/23-repository/index.md"
  - "dynamodb-toolbox/dynamodb-toolbox:docs/docs/5-databases/1-usage/index.md"
  - "dynamodb-toolbox/dynamodb-toolbox:src/table/actions/repository/repository.ts"
---

# DynamoDB-Toolbox - Repositories and Database Entry Points

Default to command builders. Move up only when the repeated calling pattern justifies the abstraction and the bundle-size tradeoff is acceptable.

## Setup

```ts
import { EntityRepository } from 'dynamodb-toolbox/entity/actions/repository'
import { TableRepository } from 'dynamodb-toolbox/table/actions/repository'

const pokemonRepository = PokemonEntity.build(EntityRepository)
const tableRepository = AppTable.build(TableRepository)

await pokemonRepository.get({ pokemonId: '001', species: 'PIKACHU' })
await tableRepository.query({ partition: 'TRAINER#ash' })
```

## Core Patterns

### Default to command builders

```ts
import { GetItemCommand } from 'dynamodb-toolbox/entity/actions/get'

await PokemonEntity.build(GetItemCommand)
  .key({ pokemonId: '001', species: 'PIKACHU' })
  .send()
```

### Use `EntityRepository` for repetitive entity CRUD

```ts
const repository = PokemonEntity.build(EntityRepository)
await repository.get({ pokemonId: '001', species: 'PIKACHU' })
```

### Use `TableRepository` for repetitive table-scoped reads

```ts
const repository = AppTable.build(TableRepository)
await repository.query({ partition: 'TRAINER#ash' })
```

Use `Database` only for registries, tooling, MCP, or sync-style entry points, and ask before introducing it.

## Common Mistakes

### MEDIUM Using `Database` in bundle-sensitive application code by default

Wrong:

```ts
const db = new Database({ pokedex: registry })
export default db
```

Correct:

```ts
const repository = PokemonEntity.build(EntityRepository)
export default repository
```

The docs warn that `Database` reduces tree-shaking effectiveness and is meant for specific higher-level entry points.

Source: dynamodb-toolbox/dynamodb-toolbox:docs/docs/5-databases/1-usage/index.md

### MEDIUM Reaching for repositories when explicit command builders would be clearer

Wrong:

```ts
const repository = PokemonEntity.build(EntityRepository)
await repository.get({ pokemonId: '001', species: 'PIKACHU' })
```

Correct:

```ts
await PokemonEntity.build(GetItemCommand)
  .key({ pokemonId: '001', species: 'PIKACHU' })
  .send()
```

If you are not yet repeating the pattern, stay lower-level rather than more magical.

Source: maintainer interview

### LOW Assuming `Database` replaces table and entity modeling

Wrong:

```ts
const db = new Database({ pokedex: {} as never })
```

Correct:

```ts
const registry = AppTable.build(Registry).registerEntities(PokemonEntity)
const db = new Database({ pokedex: registry })
```

`Database` aggregates registries; it does not define table or entity models itself.

Source: dynamodb-toolbox/dynamodb-toolbox:docs/docs/5-databases/1-usage/index.md

### MEDIUM Jumping to `Database` without asking first

Wrong:

```ts
const db = new Database({ pokedex: registry })
```

Correct:

```ts
const repository = PokemonEntity.build(EntityRepository)
```

Maintainer guidance is to ask before using `Database`, because it should be reserved for registries, tooling, MCP, or sync-style entry points.

Source: maintainer interview