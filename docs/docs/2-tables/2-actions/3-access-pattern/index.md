---
title: AccessPattern
sidebar_custom_props:
  sidebarActionType: util
---

# AccessPattern

The `AccessPattern` utility allows you to quickly build [`QueryCommands`](../2-query/index.md) on a `Table` :

```ts
import { AccessPattern } from 'dynamodb-toolbox/table/actions/accessPattern'

const highLevelPokemons = PokeTable.build(AccessPattern)
  // Optional: limit scope to specific entities
  .entities(TrainerEntity, PokemonEntity, ...)
  // Define the expected query input schema
  .schema(map({ trainerId: string(), level: number() }))
  // Declare the query pattern
  .pattern(({ trainerId, level }) => ({
    index: 'byLevel',
    partition: trainerId,
    range: { gte: level }
  }))
  // Optional: provide additional options
  .options({ maxPages: 3 })

const { Items } = await highLevelPokemons
  .query({ trainerId, level: 70 })
  .send()
```

:::tip

Remember that schemas can be composed or derived from existing ones:

```ts
const queryPokemonsByLevel = PokeTable.build(AccessPattern)
  .entities(PokemonEntity)
  .schema(pokemonSchema.pick('trainerId', 'level'))
```

:::

:::info

For single `Entity` access patterns, see the dedicated [`AccessPattern`](../../../3-entities/4-actions/2-access-pattern/index.md) Entity Action.

:::

## Methods

### `.entities(...)`

Provides a list of entities to filter the returned items of the resulting `QueryCommand` (via the internal [`entity`](../../../3-entities/2-internal-attributes/index.md#entity) attribute). Also **formats** them and **types** the response (see [`QueryCommands`](../2-query/index.md#entities) for more details):

```ts
const pokemonAccessPattern = PokeTable.build(AccessPattern)
  .entities(TrainerEntity, PokemonEntity, ...)
```

### `.schema(...)`

<p style={{ marginTop: '-15px' }}><i>(required)</i></p>

Defines the input schema for the pattern parameters (see the [Schema Section](../../../4-schemas/1-usage/index.md) for more details):

```ts
import { string } from 'dynamodb-toolbox/schema/string'

const stringAccessPattern =
  PokeTable.build(AccessPattern).schema(string())
```

### `.pattern(...)`

<p style={{ marginTop: '-15px' }}><i>(required)</i></p>

Defines how pattern inputs (parsed by the [`schema`](#schema)) are translated into a [`query`](../2-query/index.md#query), i.e. an object containing:

- `partition`: The partition key to query
- <code>index <i>(optional)</i></code>: The name of a secondary index to query
- <code>range <i>(optional)</i></code>: If the table or index has a sort key, an additional <a href="../../entities/actions/parse-condition#range-conditions">Range or Equality Condition</a>

```ts
const stringAccessPattern = PokeTable.build(AccessPattern)
  .schema(string())
  .pattern(str => ({ partition: str }))
```

:::info

It is advised to provide `entities` and `schema` first as they constrain the `pattern` type.

:::

### `.options(...)`

Provides additional options to the resulting `QueryCommands` (see [`QueryCommands`](../2-query/index.md#options) for more details):

```ts
const projectedPattern = PokeTable.build(AccessPattern)
  .entities(TrainerEntity, PokemonEntity)
  .options({ attributes: ['name', 'trainerId'] })
```

:::info

It is advised to provide `entities` first as it constrains the `options` type.

:::

### `.meta(...)`

Adds metadata to the `AccessPattern`.

The `meta` object can include a `title` and `description`, both of which must be strings. Additional fields can be of any type:

<!-- prettier-ignore -->
```ts
const pokemonsByLevelPattern = PokeTable.build(AccessPattern)
  .meta({
    title: 'Trainer Pokémons by Level',
    description:
      'Returns the pokemons of a trainer (`trainerId`) above a given level (`minLevel`)',
    other: { field: 'of any type' }
  })
```

:::info

Metadata is especially useful when building [`MCPToolkit`](../../../5-databases/2-actions/1-mcp-toolkit/index.md) Actions.

:::

### `.query(...)`

Produces a [`QueryCommand`](../2-query/index.md) from valid pattern inputs:

<!-- prettier-ignore -->
```ts
const queryCommand = highLevelPokemons
  .query({ trainerId, level: 70 })

const { Items } = await queryCommand
  // Optional: Refine queryCommand
  .options({ consistent: true })
  .send()
```
