---
title: Usage 👷
---

# Entity 👷

Entities represent a **typology of Items** in your Table, i.e. have the same schema.

An entity must belong to a Table, but the same Table can contain items from several entities. DynamoDB-Toolbox is designed with **Single Tables** in mind, but works just as well with multiple tables, it'll still make your life much easier (`batchGet` and `batchWrite` support multiple tables, so we've got you covered).

```tsx
import { Entity, schema } from 'dynamodb-toolbox';

const PokemonEntity = new Entity({
  name: 'POKEMON',
  table: PokeTable,
  schema: schema(...)
});
```

## Schema

See the [📐 `Schemas` sections](../../4-schemas/1-usage/index.md) for more details on how to build schemas.

### Matching Table schemas

The schema of an `Entity` may match the schema of its `Table` primary key:

```tsx
const PokeTable = new Table({
  partitionKey: { name: 'pk', type: 'string' },
  sortKey: { name: 'sk', type: 'number' },
  ...
})

const PokemonEntity = new Entity({
  table: PokeTable,
  schema: schema({
    pk: string().key(),
    sk: number().key(),
    ...
  }),
})

// 👇 'savedAs' will also work
const PokemonEntity = new Entity({
  table: PokeTable,
  schema: schema({
    id: string().key().savedAs('pk'),
    level: number().key().savedAs('sk'),
    ...
  }),
})
```

If it doesn't, the `Entity` constructor will require a `computeKey` function to derive the primary key from the item key attributes:

```tsx
const PokemonEntity = new Entity({
  table: PokeTable,
  schema: schema({
    id: string().key(),
    level: number().key(),
    ...
  }),
  // 🙌 Type will be correctly inferred!
  computeKey: ({ id, level }) => ({
    pokemonId: id,
    level
  })
})
```

This is useful to compose a key from ...

```tsx
Example with
```

## Internal Attributes

### Entity Attribute

### Timestamp Attributes

DynamoDB-Toolbox automatically adds internal timestamp attributes...

`modified` attribute , `created` is updated with the current time in [ISO 8].

Both attributes can be disabled or customized.

You can set the `timestamps` to `false` to disable them (default value is `true`), or fine-tune the `created` and `modified` attributes names:

```tsx
const PokemonEntity = new Entity({
  ...
  // 👇 de-activate timestamps altogether
  timestamps: false
})

const PokemonEntity = new Entity({
  ...
  timestamps: {
    // 👇 de-activate only `created` attribute
    created: false,
    modified: true
  }
})

const PokemonEntity = new Entity({
  ...
  timestamps: {
    created: {
      // 👇 defaults to `created`
      name: 'creationDate',
      // 👇 defaults to `_ct`
      savedAs: '__createdAt__',
      // 👇 defaults to `false`
      hidden: true
    },
    modified: {
      // 👇 defaults to `modified`
      name: 'lastModificationDate',
      // 👇 defaults to `_md`
      savedAs: '__lastMod__',
      // 👇 defaults to `false`
      hidden: true
    }
  }
})
```

Note that timestamp options can be partially provided.

## Matching the Table schema

Key attributes are validated against the `Table` schema, both through types and at run-time. There are two ways to match the table schema:

- The simplest one is to have an entity schema that **already matches the table schema** (see the [schemas section](TODO)). The Entity is then considered valid and no other argument is required:

```tsx
import { string } from 'dynamodb-toolbox';

const pokemonEntity = new EntityV2({
  name: 'Pokemon',
  table: myTable, // <= { partitionKey: string, sortKey: string }
  schema: schema({
    // Provide a schema that matches the primary key
    partitionKey: string().key(),
    // 🙌 using `savedAs` will also work
    pokemonId: string().key().savedAs('sortKey'),
    ...
  }),
});
```

- If the entity key attributes don't match the table schema, the `Entity` class will require you to add a `computeKey` property which must derive the primary key from them:

```tsx
const pokemonEntity = new EntityV2({
  ...
  table: myTable, // <= { partitionKey: string, sortKey: string }
  schema: schema({
    pokemonClass: string().key(),
    pokemonId: string().key(),
    ...
  }),
  // 🙌 `computeKey` is correctly typed
  computeKey: ({ pokemonClass, pokemonId }) => ({
    partitionKey: pokemonClass,
    sortKey: pokemonId,
  }),
});
```

## Typed Items

```tsx
import type {
  FormattedItem,
  SavedItem
} from 'dynamodb-toolbox'

const pokemonEntity = new EntityV2({
  name: 'Pokemon',
  timestamps: true,
  table: myTable,
  schema: schema({
    pokemonClass: string().key().savedAs('partitionKey'),
    pokemonId: string().key().savedAs('sortKey'),
    level: number().default(1),
    customName: string().optional(),
    internalField: string().hidden()
  })
})

// What Pokemons will look like in DynamoDB
type SavedPokemon = SavedItem<typeof pokemonEntity>
// 🙌 Equivalent to:
// {
//   _et: "Pokemon",
//   _ct: string,
//   _md: string,
//   PK: string,
//   SK: string,
//   level: number,
//   customName?: string | undefined,
//   internalField: string | undefined,
// }

// What fetched Pokemons will look like in your code
type FormattedPokemon = FormattedItem<typeof pokemonEntity>
// 🙌 Equivalent to:
// {
//   created: string,
//   modified: string,
//   pokemonClass: string,
//   pokemonId: string,
//   level: number,
//   customName?: string | undefined,
// }
```
