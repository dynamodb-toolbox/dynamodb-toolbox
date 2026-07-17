---
name: mixed-entity-querying-and-formatting
description: >
  Query or scan multiple entity types in a single dynamodb-toolbox table and
  control entityAttrFilter, noEntityMatchBehavior, projections, formatter
  fallback, and legacy data handling. Load this after single-table modeling
  when one read can return more than one entity type.
type: core
library: dynamodb-toolbox
library_version: "local"
sources:
  - "dynamodb-toolbox/dynamodb-toolbox:docs/docs/3-entities/2-internal-attributes/index.md"
  - "dynamodb-toolbox/dynamodb-toolbox:docs/versioned_docs/version-v1/6-migration-guide/index.md"
  - "dynamodb-toolbox/dynamodb-toolbox:src/options/entityAttrFilter.ts"
  - "dynamodb-toolbox/dynamodb-toolbox:src/table/actions/query/queryCommand.ts"
---

# DynamoDB-Toolbox - Mixed-Entity Querying and Formatting

This skill builds on `dynamodb-toolbox/single-table-modeling-from-scratch`. Read it first for entity tagging, internal attributes, and key design.

## Setup

```ts
import { QueryCommand } from 'dynamodb-toolbox/table/actions/query'

await AppTable.build(QueryCommand)
  .entities(PokemonEntity, TrainerEntity)
  .query({ partition: 'TRAINER#ash' })
  .options({ entityAttrFilter: true, noEntityMatchBehavior: 'THROW' })
  .send()
```

## Core Patterns

### Default normal application paths to `THROW`

```ts
await AppTable.build(QueryCommand)
  .entities(PokemonEntity, TrainerEntity)
  .query({ partition: 'TRAINER#ash' })
  .options({ noEntityMatchBehavior: 'THROW' })
  .send()
```

Use `THROW` when unmatched items indicate a bug in tagging, projection, schema, or entity selection.

### Use `DISCARD` for legacy, migration, or admin reads

```ts
await AppTable.build(QueryCommand)
  .entities(PokemonEntity, TrainerEntity)
  .query({ partition: 'TRAINER#ash' })
  .options({ entityAttrFilter: false, noEntityMatchBehavior: 'DISCARD' })
  .send()
```

This is appropriate when partial results are acceptable.

## Common Mistakes

### CRITICAL Combining multiple entity filters with `entityAttrFilter: false`

Wrong:

```ts
await AppTable.build(QueryCommand)
  .entities(PokemonEntity, TrainerEntity)
  .options({ entityAttrFilter: false })
  .send()
```

Correct:

```ts
await AppTable.build(QueryCommand)
  .entities(PokemonEntity, TrainerEntity)
  .options({ entityAttrFilter: true })
  .send()
```

Source validation requires entityAttrFilter to stay enabled when multiple entity filters are active.

Source: dynamodb-toolbox/dynamodb-toolbox:src/options/entityAttrFilter.ts

### HIGH Expecting `entityAttrFilter` to work when entity tagging is disabled

Wrong:

```ts
await AppTable.build(QueryCommand)
  .entities(PokemonEntityWithoutTag)
  .options({ entityAttrFilter: true })
  .send()
```

Correct:

```ts
await AppTable.build(QueryCommand)
  .entities(PokemonEntityWithoutTag)
  .options({ entityAttrFilter: false, noEntityMatchBehavior: 'DISCARD' })
  .send()
```

Entity-aware filtering cannot rely on an entity attribute that the participating entity does not store.

Source: dynamodb-toolbox/dynamodb-toolbox:src/options/entityAttrFilter.ts

### HIGH Assuming unmatched items are discarded by default

Wrong:

```ts
await AppTable.build(QueryCommand)
  .entities(PokemonEntity, TrainerEntity)
  .send()
```

Correct:

```ts
await AppTable.build(QueryCommand)
  .entities(PokemonEntity, TrainerEntity)
  .options({ noEntityMatchBehavior: 'DISCARD' })
  .send()
```

Use `DISCARD` only when you intentionally accept partial results; otherwise keep `THROW` because an unmatched item is a correctness bug.

Source: maintainer interview

### HIGH Assuming generic filters still behave the same once `entities(...)` is present

Wrong:

```ts
await AppTable.build(QueryCommand)
  .entities(PokemonEntity)
  .options({ filter: { status: 'active' } as never })
  .send()
```

Correct:

```ts
await AppTable.build(QueryCommand)
  .entities(PokemonEntity)
  .options({ entityAttrFilter: true })
  .send()
```

Once entity-aware reads are involved, filter behavior is no longer equivalent to raw DynamoDB intuition, so check the entity-aware options instead of assuming a generic filter will carry the result.

Source: maintainer interview