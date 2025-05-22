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
    range: { gte: level },
    options: { maxPages: 3 }, // optional
  }))

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
- <code>options <i>(optional)</i></code>: Additional `QueryCommand` options (see [`QueryCommands`](../2-query/index.md#options) for more details)

```ts
const stringAccessPattern = PokeTable.build(AccessPattern)
  .schema(string())
  .pattern(str => ({ partition: str }))
```

:::info

It is advised to provide `entities` and `schema` first as they constrain the query type.

:::

### `.query(...)`

Produces a [`QueryCommand`](../2-query/index.md) from valid pattern inputs:

```ts
const queryCommand = await highLevelPokemons
  .query({ trainerId, level: 70 })
  .options({ consistent: true })

const { Items } = await queryCommand.send()
```
