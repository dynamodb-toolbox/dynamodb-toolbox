---
title: Usage
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Entity

Entities represent a **category of items** in your `Table`.

An entity must belong to a `Table`, but a `Table` can **contain items from several entities**. DynamoDB-Toolbox is designed with [Single Tables](https://www.alexdebrie.com/posts/dynamodb-single-table/) in mind, but works just as well with multiple tables and still makes your life much easier (e.g. for [batch operations](../4-actions/6-batching/index.md) or [transactions](../4-actions/10-transactions/index.md)):

```ts
import { Entity } from 'dynamodb-toolbox/entity';
import { schema } from 'dynamodb-toolbox/schema';

const PokemonEntity = new Entity({
  name: 'POKEMON',
  table: PokeTable,
  schema: schema(...)
});
```

## Constructor

`Entity` takes a single parameter of type `object` that accepts the following properties:

### `name`

<p style={{ marginTop: '-15px' }}><i>(required)</i></p>

A `string` that uniquely identifies your entity:

```ts
const PokemonEntity = new Entity({
  name: 'POKEMON',
  ...
})
```

:::caution

DynamoDB-Toolbox automatically tags your items with their respective entity names (see [Internal Attributes](../2-internal-attributes/index.md#entity)).

☝️ The consequence is that `name` **cannot be updated** once your `Entity` has its first items\* (at least not without a data migration first), so choose wisely!

<!-- Required for prettier not to prefix * with anti-slash -->
<!-- prettier-ignore -->
<sup><i>(* This tag is required for some features to work, so you also have to add it if you migrate existing data to DynamoDB-Toolbox.)</i></sup>

:::

### `schema`

<p style={{ marginTop: '-15px' }}><i>(required)</i></p>

The `schema` of the `Entity`. See the [Schema Section](../../4-schemas/1-usage/index.md) for more details on how to define schemas.

### `table`

<p style={{ marginTop: '-15px' }}><i>(required)</i></p>

The [`Table`](../../2-tables/1-usage/index.md) of the `Entity`.

DynamoDB-Toolbox must check that an entity `schema` matches its `Table` primary key somehow. In simple cases, both schemas can **simply fit**:

:::noteExamples

<Tabs>
<TabItem value="direct-match" label="Direct match">

```ts
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
```

</TabItem>
<TabItem value="single-partition" label="Single partition">

```ts
const PokeTable = new Table({
  partitionKey: { name: 'pk', type: 'string' },
  sortKey: { name: 'sk', type: 'number' },
  ...
})

const PokemonEntity = new Entity({
  table: PokeTable,
  schema: schema({
    // 👇 constant partition key
    pk: string().const('POKEMON').key(),
    sk: number().key(),
    ...
  })
})
```

</TabItem>
<TabItem value="saving-as" label="Renaming">

```ts
const PokeTable = new Table({
  partitionKey: { name: 'pk', type: 'string' },
  sortKey: { name: 'sk', type: 'number' },
  ...
})

const PokemonEntity = new Entity({
  table: PokeTable,
  schema: schema({
    // 👇 renaming works
    pokemonId: string().savedAs('pk').key(),
    level: number().savedAs('sk').key(),
    ...
  }),
})
```

</TabItem>
<TabItem value="prefixing" label="Prefixing">

```ts
import { prefix } from 'dynamodb-toolbox/transformers/prefix'

const PokeTable = new Table({
  partitionKey: { name: 'pk', type: 'string' },
  sortKey: { name: 'sk', type: 'number' },
  ...
})

const PokemonEntity = new Entity({
  table: PokeTable,
  schema: schema({
    // 👇 saved as `POKEMON#${pokemonId}`
    pokemonId: string()
      .transform(prefix('POKEMON'))
      .savedAs('pk')
      .key(),
    level: number().savedAs('sk').key(),
    ...
  })
})
```

👉 See the [transformers section](../../4-schemas/18-transformers/1-usage.md) for more details on transformers.

</TabItem>
</Tabs>

:::

### `computeKey`

<p style={{ marginTop: '-15px' }}><i>(potentially required, depending on <code>schema</code>)</i></p>

...but **using schemas that don't fit is OK**.

In this case, the `Entity` constructor requires a `computeKey` function to derive the primary key from the `Entity` key attributes.

This can be useful for more complex cases like mapping several attributes to the same key:

:::noteExamples

<Tabs>
<TabItem value="renaming" label="Renaming">

```ts
const PokemonEntity = new Entity({
  table: PokeTable,
  schema: schema({
    pokemonId: string().key(),
    level: number().key(),
    ...
  }),
  // 🙌 Types are correctly inferred!
  computeKey: ({ pokemonId, level }) => ({
    pk: pokemonId,
    sk: level
  })
})
```

</TabItem>
<TabItem value="composing" label="Composing">

```ts
const PokemonEntity = new Entity({
  table: PokeTable,
  schema: schema({
    specifiers: list(string()).key(),
    sk: number().key(),
    ...
  }),
  computeKey: ({ specifiers, sk }) => ({
    pk: specifiers.join('#'),
    sk
  })
})
```

</TabItem>
</Tabs>

:::

### `entityAttributeName`

A `string` to customize the name of the internal entity attribute (see [Internal Attributes](../2-internal-attributes/index.md#entity)).

### `timestamps`

A `boolean` or `object` to customize the internal `created` and `modified` attributes (see [Internal Attributes](../2-internal-attributes/index.md#timestamp-attributes)).
