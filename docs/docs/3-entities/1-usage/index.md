---
title: Usage
---

# Entity

Entities represent a **typology of Items** in your Table.

An entity must belong to a Table, but the same Table can contain items from several entities. DynamoDB-Toolbox is designed with **Single Tables** in mind, but works just as well with multiple tables, it'll still make your life much easier (`batchGet` and `batchWrite` support multiple tables, so we've got you covered).

```tsx
import { Entity, schema } from 'dynamodb-toolbox';

const PokemonEntity = new Entity({
  name: 'POKEMON',
  table: PokeTable,
  schema: schema({ ... }),
});
```

### Timestamps

DynamoDB-Toolbox automatically adds internal timestamp attributes are also there...

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
