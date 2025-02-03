---
title: Internal Attributes
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Internal Attributes

The `Entity` constructor automatically adds **internal attributes** to your schemas:

- An [Entity Attribute](#entity) _(required)_ that **tags items with the `name` of the entity**.
- Two [Timestamp Attributes](#timestamp-attributes) _(optional)_ that **record when the item was created and last modified** with timestamps in [ISO 8601 format](https://wikipedia.org/wiki/ISO_8601).

If the schema contains a conflicting attribute, the constructor throws a `reservedAttributeName` error. To avoid this, DynamoDB-Toolbox lets you customize the name and `savedAs` property of the internal attributes.

:::tip

You can get familiar with the internal attributes by using the `FormattedItem` and `SavedItem` types (see [Type Inference](../3-type-inference/index.md) for more details):

<details className="details-in-admonition">
<summary>🔎 <b>Show code</b></summary>

```ts
import type { FormattedItem, SavedItem } from 'dynamodb-toolbox/entity'

const PokemonEntity = new Entity({
  name: 'Pokemon',
  schema: schema({
    pokemonClass: string().key().savedAs('pk'),
    pokemonId: string().key().savedAs('sk'),
    level: number()
  }),
  ...
})

// Pokemons in DynamoDB:
type SavedPokemon = SavedItem<typeof PokemonEntity>
// => {
//   pk: string,
//   sk: string,
//   level: number,
//   _et: "Pokemon",
//   _ct: string,
//   _md: string,
// }

// Fetched Pokemons: (`entity` attribute is hidden)
type FormattedPokemon = FormattedItem<typeof PokemonEntity>
// => {
//   pokemonClass: string,
//   pokemonId: string,
//   level: number,
//   created: string,
//   modified: string,
// }
```

</details>

:::

## `entity`

A string attribute that tags your items with the `Entity` name.

This attribute is **required** for some features to work, like allowing for appropriate formatting when fetching multiple items of the same `Table` in a single operation (e.g. [Queries](../../2-tables/2-actions/2-query/index.md) or [Scans](../../2-tables/2-actions/1-scan/index.md)). There are two consequences to that:

- The `name` of an `Entity` **cannot be updated** once it has its first items (at least not without a data migration).
- When migrating existing data to DynamoDB-Toolbox, you also have to add it to your items first.

By default, the attribute is `hidden` and named `entity`. This can be overridden via the `entityAttributeHidden` and `entityAttributeName` properties:

```ts
const PokemonEntity = new Entity({
  name: 'Pokemon',
  entityAttributeHidden: false,
  entityAttributeName: 'item',
  ...
})
```

:::info

The `savedAs` property must be specified at the `Table` level, via the [`entityAttributeSavedAs`](../../2-tables/1-usage/index.md) property.

:::

## Timestamp Attributes

There are two timestamp attributes. Both of them are string attributes containing timestamps in [ISO 8601 format](https://wikipedia.org/wiki/ISO_8601):

- `created` records when the item was **created**
- `modified` records when the item was **last modified**

Timestamp attributes are optional. You can opt out by setting off the `timestamps` property:

```ts
const PokemonEntity = new Entity({
  ...
  // 👇 deactivates both timestamps
  timestamps: false
})
```

You can also manage them independently:

```ts
const PokemonEntity = new Entity({
  ...
  timestamps: {
    created: true,
    // 👇 deactivates `modified` attribute
    modified: false
  }
})
```

<h4 style={{ fontSize: "large" }}>Customizing Timestamps:</h4>

Instead of `true`, you can provide an object to **fine-tune each attribute**. Available options:

### `name`

The name of the attribute:

```ts
const PokemonEntity = new Entity({
  ...
  timestamps: {
    ...
    modified: {
      // `modified` by default
      name: 'lastModified'
    }
  }
})
```

### `savedAs`

The `savedAs` property of the attribute:

```ts
const PokemonEntity = new Entity({
  ...
  timestamps: {
    ...
    modified: {
      // `_md` by default
      savedAs: '__lastMod__'
    }
  }
})
```

### `hidden`

Whether the attribute is hidden or not when formatting:

```ts
const PokemonEntity = new Entity({
  ...
  timestamps: {
    ...
    modified: {
      // `false` by default
      hidden: true
    }
  }
})
```

### Referencing timestamp attributes

It is possible to reference timestamp attributes to be used elsewhere in the schema.
The main use case for this is to sort items efficiently when querying. [Effective data sorting with Amazon DynamoDB
](https://aws.amazon.com/blogs/database/effective-data-sorting-with-amazon-dynamodb/) explains this concept well.

In this example we define a `PostEntity` that can be queried by user sorted by date: it is possible to get a single post by using its `postId`, or query all posts sorted by create date from an `ownerId` by using the GSI:

```ts
const PostEntity = new Entity({
  name: "POST",
  table: UsersTable,
  // We set the created/modified timestamps manually
  timestamps: {
    created: false,
    modified: false,
  },
  schema: schema({
    postId: string().key().required("always"),
    ownerId: string().required("atLeastOnce"),

    // We set the created timestamp manually
    created: string()
      .default(() => new Date().toISOString())
      .savedAs("_ct"),

    // We set the modified timestamp manually (not required for this example - but this is how it's done)
    modified: string()
      .putDefault(() => new Date().toISOString())
      .updateDefault(() => new Date().toISOString())
      .savedAs("_mt"),

  }).and((linkSchema) => ({

    GSIPK: string()
      .link<typeof linkSchema>(({ ownerId }) => ownerId)
      .transform(prefix("UP"))
      .hidden(),

    GSISK: string()
      .putLink<typeof linkSchema>(
        ({ postId, created }) => `${created}#${postId}`,
        //                         ^^^^^^^^ reference to the created attribute
      )
      .hidden(),
  })),
  computeKey: ({ postId }) => ({
    PK: `LINK#${postId}`,
    SK: `LINK#${postId}`,
  }),
})
```

Query the posts by `ownerId`:

```ts
import { QueryCommand } from "dynamodb-toolbox/table/actions/query";

const userId = "123";

await UsersTable.build(QueryCommand)
  .query({
    partition: `UP#${userId}`,
    index: "GSI",
  })
  .entities(LinkEntity)
  .options({
    maxPages: Infinity, // Beware of RAM issues
    reverse: true, // Sort descending (new first)
  })
  .send();

```

