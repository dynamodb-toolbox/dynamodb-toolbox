---
title: Usage
---

# Database

Serves as a single entry point for a collection of `Tables`, `Entities`, and `AccessPatterns` via the [`Registry`](../../2-tables/2-actions/9-registry/index.md) Table Action:

```ts
import { Database } from 'dynamodb-toolbox/database'

// Build `Registry` first
const PokeRegistry = PokeTable.build(Registry)
  .registerEntities(TrainerEntity, PokemonEntity)
  .registerAccessPatterns({ trainers, trainerPokemons })

const PokeDB = new Database({
  pokedex: PokeRegistry
})

// Get a Registry by key
PokeDB.tables.pokedex

// Get an Entity by `entityName`
PokeDB.tables.pokedex.entities.trainer

// Get an AccessPattern by key
PokeDB.tables.pokedex.accessPatterns.trainers.query(...)

// Or use the `.query` shorthand
PokeDB.tables.pokedex.query.trainers(...)
```

:::info

Because Database can reduce the effectiveness of tree-shaking, we recommend using it only:

- If bundle size isn't a concern
- For specific use cases such as:
  - [Describing an MCP server](../../5-databases/2-actions/1-mcp-toolkit/index.md)
  - [Synchronizing with DynamoDB-Toolshack](../../5-databases//2-actions/2-synchronize/index.md)

:::

## Constructor

The `Database` constructor takes two parameters: `tables` and optional `options`.

### `tables`

<p style={{ marginTop: '-15px' }}><i>(required)</i></p>

The Tables contained in the `Database`. Each can be either a [`Table`](../../2-tables/1-usage/index.md) or a [`Registry`](../../2-tables/2-actions/9-registry/index.md):

```ts
const tables = {
  pokedex: PokeRegistry
  other: OtherRegistry
}

const PokeDB = new Database(tables)
```

### `options`

Additional options _(optional)_:

#### `meta`

Attaches metadata to the `Database` (as an object property).

The `meta` object can include a `title` and `description`, both of which must be strings. Additional fields can be of any type:

```ts
const PokeDB = new Database(
  ...,
  {
    meta: {
      title: 'Pokedex',
      description:
        'An Awesome Database for development use',
      other: { field: 'of any type' }
    }
  }
)

// 👇 Directly access/modify metadata
console.log(PokeDB.meta)
PokeDB.meta.foo = 'A new field'
```

## Building Database Actions

To allow for **extensibility**, **better code-splitting** and **lighter bundles**, `Database` only expose a `.build(...)` method which acts as a gateway to perform Database [Actions](../../1-getting-started/3-usage/index.md#how-do-actions-work):

```ts
import { MCPToolkit } from 'dynamodb-toolbox/database/actions/mcpToolkit'

const mcpToolkit = PokeDB.build(MCPToolkit)
```
