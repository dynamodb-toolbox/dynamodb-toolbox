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

You can get familiar with the internal attributes by using the `FormattedItem` and `SavedItem` types, respectively from the [`Formatter`](../3-actions/19-format/index.md) and [`Parser`](../3-actions/16-parse/index.md) actions.

<details className="details-in-admonition">
<summary>🔎 <b>Show code</b></summary>

```ts
import type { FormattedItem } from 'dynamodb-toolbox/entity/actions/format'
import type { SavedItem } from 'dynamodb-toolbox/entity/actions/parse'

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

By default, the attribute is named `entity`. It can be overridden via the `entityAttributeName` property:

```ts
const PokemonEntity = new Entity({
  name: 'Pokemon',
  entityAttributeName: 'item',
  ...
})
```

The `savedAs` property can be specified at the `Table` level, via the [`entityAttributeSavedAs`](../../2-tables/1-usage/index.md) property.

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
