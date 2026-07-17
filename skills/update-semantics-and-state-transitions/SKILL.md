---
name: update-semantics-and-state-transitions
description: >
  Use UpdateItemCommand and UpdateAttributesCommand with dynamodb-toolbox
  update operators like $add, $sum, $subtract, $append, $prepend, $delete,
  $remove, and $get. Load this for partial nested updates, counters, set and
  list mutation, and condition-aware state changes.
type: core
library: dynamodb-toolbox
library_version: "local"
sources:
  - "dynamodb-toolbox/dynamodb-toolbox:docs/docs/3-entities/4-actions/4-update-item/index.md"
  - "dynamodb-toolbox/dynamodb-toolbox:src/entity/actions/update/updateItemCommand.ts"
  - "dynamodb-toolbox/dynamodb-toolbox:src/entity/actions/updateAttributes/updateAttributesCommand.ts"
---

# DynamoDB-Toolbox - Update Semantics and State Transitions

Use the update DSL when you need DynamoDB update behavior without assembling raw expressions. The key distinctions are flat versus deep updates and expression operators versus actual reads.

## Setup

```ts
import {
  $add,
  $append,
  $delete,
  $get,
  $remove,
  UpdateItemCommand
} from 'dynamodb-toolbox/entity/actions/update'

await PokemonEntity.build(UpdateItemCommand)
  .item({
    pokemonId: '001',
    species: 'PIKACHU',
    level: $add(1),
    previousLevel: $get('level', 0),
    notes: $append(['captured']),
    tags: $delete(new Set(['injured'])),
    statusEffect: $remove()
  })
  .send()
```

## Core Patterns

### Use `$add` and `$sum` for numeric transitions

```ts
await PokemonEntity.build(UpdateItemCommand)
  .item({ pokemonId: '001', species: 'PIKACHU', level: $add(1) })
  .send()
```

### Use `$remove` to clear optional fields

```ts
await PokemonEntity.build(UpdateItemCommand)
  .item({ pokemonId: '001', species: 'PIKACHU', statusEffect: $remove() })
  .send()
```

### Deep attributes are partial by default

```ts
await PokemonEntity.build(UpdateItemCommand)
  .item({
    pokemonId: '001',
    species: 'PIKACHU',
    stats: { hp: 42 }
  })
  .send()
```

## Common Mistakes

### HIGH Treating update extensions as read-before-write fetches

Wrong:

```ts
await PokemonEntity.build(UpdateItemCommand)
  .item({ previousLevel: $get('level') })
  .send()
```

Correct:

```ts
await PokemonEntity.build(UpdateItemCommand)
  .item({
    pokemonId: '001',
    species: 'PIKACHU',
    previousLevel: $get('level', 0)
  })
  .send()
```

`$get` contributes to the update expression; it does not fetch the current item first.

Source: dynamodb-toolbox/dynamodb-toolbox:docs/docs/3-entities/4-actions/4-update-item/index.md

### MEDIUM Overwriting deep structures when a partial update was intended

Wrong:

```ts
await PokemonEntity.build(UpdateItemCommand)
  .item({
    pokemonId: '001',
    species: 'PIKACHU',
    stats: { hp: 42, atk: 50 }
  })
  .send()
```

Correct:

```ts
await PokemonEntity.build(UpdateItemCommand)
  .item({
    pokemonId: '001',
    species: 'PIKACHU',
    stats: { hp: 42 }
  })
  .send()
```

Deep attributes are partial by default, so include only the fields you want to change instead of reconstructing the whole nested object casually.

Source: dynamodb-toolbox/dynamodb-toolbox:docs/docs/3-entities/4-actions/4-update-item/index.md

### HIGH Using incompatible attribute references in update expressions

Wrong:

```ts
await PokemonEntity.build(UpdateItemCommand)
  .item({ pokemonId: '001', species: 'PIKACHU', level: $get('name') })
  .send()
```

Correct:

```ts
await PokemonEntity.build(UpdateItemCommand)
  .item({
    pokemonId: '001',
    species: 'PIKACHU',
    previousLevel: $get('level', 0)
  })
  .send()
```

Reference paths are checked for existence, but mismatched value semantics still create bad updates.

Source: dynamodb-toolbox/dynamodb-toolbox:src/entity/actions/update/updateItemParams/extension/reference.ts

## References

- [Update extensions](references/update-extensions.md)