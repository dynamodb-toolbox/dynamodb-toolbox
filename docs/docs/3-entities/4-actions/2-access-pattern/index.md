---
title: AccessPattern
sidebar_custom_props:
  sidebarActionType: util
---

# AccessPattern

The `AccessPattern` utility allows you to quickly build [`QueryCommands`](../../../2-tables/2-actions/2-query/index.md) on the entity `Table` :

```ts
import { AccessPattern } from 'dynamodb-toolbox/entity/actions/accessPattern'

const highLevelPokemons = PokemonEntity.build(AccessPattern)
  // Define the expected query input schema
  .schema(map({ trainerId: string(), level: number() }))
  // Declare the query pattern
  .pattern(({ trainerId, level }) => ({
    index: 'byLevel',
    partition: trainerId,
    range: { gte: level },
    options: { maxPages: 3 } // optional
  }))

const { Items } = await highLevelPokemons
  .query({ trainerId, level: 70 })
  .send()
```

:::tip

Remember that schemas can be composed or derived from existing ones:

<!-- prettier-ignore -->
```ts
const queryPokemonsByLevel = PokemonEntity
  .build(AccessPattern)
  .schema(pokemonSchema.pick('trainerId', 'level'))
```

:::

:::info

For multiple `Entities` access patterns, see the dedicated [`AccessPattern`](../../../2-tables/2-actions/3-access-pattern/index.md) Table Action.

:::

## Methods

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

Defines how pattern inputs (parsed by the [`schema`](#schema)) are translated into a [`query`](../../../2-tables/2-actions/2-query/index.md#query), i.e. an object containing:

- `partition`: The partition key to query
- <code>index <i>(optional)</i></code>: The name of a secondary index to query
- <code>range <i>(optional)</i></code>: If the table or index has a sort key, an additional <a href="../../entities/actions/parse-condition#range-conditions">Range or Equality Condition</a>
- <code>options <i>(optional)</i></code>: Additional `QueryCommand` options (see [`QueryCommands`](../../../2-tables/2-actions/2-query/index.md#options) for more details)

```ts
const stringAccessPattern = PokeTable.build(AccessPattern)
  .schema(string())
  .pattern(str => ({ partition: str }))
```

:::info

It is advised to provide `schema` first as it constrains the query type.

:::

### `.query(...)`

Produces a [`QueryCommand`](../../../2-tables/2-actions/2-query/index.md) from valid pattern inputs:

```ts
const queryCommand = await highLevelPokemons
  .query({ trainerId, level: 70 })
  .options({ consistent: true })

const { Items } = await queryCommand.send()
```
