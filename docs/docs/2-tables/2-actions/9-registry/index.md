---
title: Registry
sidebar_custom_props:
  sidebarActionType: util
  new: true
---

# Registry

Serves as a single entry point for the Table's [`Entities`](../../../3-entities/1-usage/index.md) and [`AccessPatterns`](../3-access-pattern/index.md) (including [`EntityAccessPatterns`](../../../3-entities/4-actions/2-access-pattern/index.md)):

```ts
import { Registry } from 'dynamodb-toolbox/table/actions/registry'

const PokeRegistry = PokeTable.build(Registry)
  .registerEntities(PokemonEntity, TrainerEntity, ...)
  .registerAccessPatterns({ trainers, pokemonsByTrainerId })

// Get an Entity by `entityName`
PokeRegistry.entities.pokemon

// Get an AccessPattern by key
PokeRegistry.accessPatterns.trainers.query(...)

// Or use the `.query` shorthand
PokeRegistry.query.trainers(...)
```

The `Registry` also exposes a `.build(...)` method compatible with any [`Table Action`](../../../1-getting-started/3-usage/index.md#methods-vs-actions). The `Entities` registered in the `Registry` are directly provided to the Action::

```ts
// 🙌 Directly typed as `Pokemon | Trainer`
const { Items } = await PokeRegistry.build(QueryCommand)
  .query({ partition: trainerId })
  .send()
```

## Methods

### `registerEntities(...)`

<p style={{ marginTop: '-15px' }}><i><code>(entities: ENTITIES) => Registry&lt;TABLE, ENTITIES, ACCESS_PATTERNS&gt;</code></i></p>

Registers the Table's `Entities`:

```ts
const PokeRegistry = PokeTable.build(Registry)
  .registerEntities(PokemonEntity, TrainerEntity, ...)

// Get an Entity by `entityName`
PokeRegistry.entities.pokemon
```

### `registerAccessPatterns(...)`

<p style={{ marginTop: '-15px' }}><i><code>(accessPatterns: ACCESS_PATTERNS) => Registry&lt;TABLE, ENTITIES, ACCESS_PATTERNS&gt;</code></i></p>

Registers the Table's `AccessPatterns`. Accepts both [`TableAccessPatterns`](../3-access-pattern/index.md) and [`EntityAccessPatterns`](../../../3-entities/4-actions/2-access-pattern/index.md):

```ts
const PokeRegistry = PokeTable.build(Registry)
  .registerAccessPatterns({ trainers, pokemonsByTrainerId })

// Get an AccessPattern by key
PokeRegistry.accessPatterns.trainers.query(...)

// ...or directly use the `.query` shorthand
PokeRegistry.query.trainers(...)
```

### `build(...)`

<p style={{ marginTop: '-15px' }}><i><code>(tableAction?: ACTION) => ACTION&lt;TABLE, ENTITIES&gt;</code></i></p>

Builds a [`Table Action`](../../../1-getting-started/3-usage/index.md#methods-vs-actions) on the provided `Table`. The `Entities` registered in the `Registry` are directly provided to the Action:

```ts
// 🙌 Directly typed as `Pokemon | Trainer`
const { Items } = await PokeRegistry.build(QueryCommand)
  .query({ partition: trainerId })
  .send()
```

## Properties

### `entities`

<p style={{ marginTop: '-15px' }}><i><code>Record&lt;string, ENTITIES&gt;</code></i></p>

The `Entities` registered in the `Registry`, accessible by `entityName`:

```ts
const PokeRegistry = PokeTable.build(Registry)
  .registerEntities(PokemonEntity, TrainerEntity, ...)

// Get an Entity by `entityName`
PokeRegistry.entities.pokemon
```

### `accessPatterns`

<p style={{ marginTop: '-15px' }}><i><code>ACCESS_PATTERNS</code></i></p>

The `AccessPatterns` registered in the `Registry`:

```ts
const PokeRegistry = PokeTable.build(Registry)
  .registerAccessPatterns({ trainers, pokemonsByTrainerId })

// Get an AccessPattern by key
PokeRegistry.accessPatterns.trainers.query(...)
```

### `query`

<p style={{ marginTop: '-15px' }}><i><code>Record&lt;string, ACCESS_PATTERNS['query']&gt;</code></i></p>

Shorthand access for the registered `AccessPatterns`' query methods:

```ts
PokeRegistry.query.trainers(...)

// 👇 Equivalent to
PokeRegistry.accessPatterns.trainers.query(...)
```
