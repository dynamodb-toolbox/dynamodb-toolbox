---
sidebar_position: 8
title: Migration Guide
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Migration Guide

If you used the v0 of DynamoDB-Toolbox, here are the changes you need to be aware of when migrating to the v1.

The good news is that the breaking changes **only concern the API**: You won't need any data migration 🥳

:::caution

Well, probably... as there are two exceptions:

- If you de-activated the internal [`entity`](../../3-entities/2-internal-attributes/index.md#entity) attribute (by setting `entityField` to `false`), it is now required, so must be re-introduced in the data
- If you used the `saved: false` option on an attribute, there is no equivalent yet

:::

## `Table`

### Primary Key

Primary Key attributes now have a `type` along with their `names`:

```diff
import { Table } from 'dynamodb-toolbox/table'

const MyTable = new Table({
- partitionKey: 'pk',
+ partitionKey: { name: 'pk', type: 'string' },
- sortKey: 'sk',
+ sortKey: { name: 'sk', type: 'string' },
  ...
})
```

### Indexes

In the same way, index attributes now have a `type` property as well as an explicit `type` (`global` or `local`):

<Tabs>
<TabItem value="gsi" label="Global Index">

```diff
const MyTable = new Table({
  indexes: {
-   byTrainerId: { partitionKey: 'trainerId', sortKey: 'level' },
+   byTrainerId: {
+     type: 'global',
+     partitionKey: { name: 'trainerId', type: 'string' },
+     sortKey: { name: 'level', type: 'number' }
+   },
  },
  ...
})
```

</TabItem>
<TabItem value="lsi" label="Local index">

```diff
const MyTable = new Table({
  indexes: {
-   byLevel: { sortKey: 'level' },
+   byLevel: {
+     type: 'local',
+     sortKey: { name: 'level', type: 'number' }
+   },
  },
  ...
})
```

</TabItem>
</Tabs>

### `entityField`

`entityField` has been renamed to `entityAttributeSavedAs` to be more closely aligned with the new `schema` syntax.

It cannot be set to `false` anymore (as it is required to infer correct formatting during [Scans](../../2-tables/2-actions/1-scan/index.md) and [Queries](../../2-tables/2-actions/2-query/index.md)):

```diff
const MyTable = new Table({
  ...,
- entityField: '__entity__',
+ entityAttributeSavedAs: '__entity__',
})
```

### Misc.

The `autoExecute` and `autoParse` options have been removed for the sake of simplicity: All commands have a `.params()` method to inspect the resulting query. This query can also be used directly to fetch the unformatted response.

The `removeNullAttributes` option has been removed. Attribute removals benefit from a dedicated `$remove` symbol.

The `alias` option has also been removed. Feel free to [open a discussion](https://github.com/jeremydaly/dynamodb-toolbox/discussions/new/choose) if you need it back.

Finally, table `attributes` have not been re-implemented yet (but you can still share attribute schemas between entities, see the [Schema documentation](../../4-schemas/1-usage/index.md) for more details)

## `Entity`

### Entity attribute

The `typeAlias` and `typeHidden` have respectively been renamed to `entityAttributeName` and `entityAttributeHidden`:

```diff
const PokemonEntity = new Entity({
  ...,
- typeAlias: 'ent',
- typeHidden: true,
+ entityAttributeName: 'ent',
+ entityAttributeHidden: true,
})
```

### Timestamps attribute

The `timestamps`, `created`, `modified`, `createdAlias`, `modifiedAlias` options have been merged in a single `timestamps` option that is either a `boolean` or a configuration object.

Timestamp attributes can also be hidden and independently disabled:

<Tabs>
<TabItem value="fine-tuned" label="Configured">

```diff
const PokemonEntity = new Entity({
  ...,
- timestamps: true,
- created: '__created__',
- createdAlias: 'creationDate',
- modified: '__modified__',
- modifiedAlias: 'modifiedDate',
+ timestamps: {
+   created: {
+     savedAs: '__created__',
+     name: 'creationDate'
+   },
+   modified: {
+     savedAs: '__modified__',
+     name: 'modifiedDate',
+     hidden: true
+   }
+ }
})
```

</TabItem>
<TabItem value="disabled" label="Enabled/Disabled">

```diff
const PokemonEntity = new Entity({
  ...,
- timestamps: false,
+ timestamps: {
+   created: true,
+   modified: false
+ }
})
```

</TabItem>
</Tabs>

### Misc.

The `autoExecute` and `autoParse` options have been removed for the sake of simplicity: All commands have a `.params()` method to inspect the resulting query. This query can also be used directly to fetch the unformatted response.

## Attributes

The schema definition API (previous `attributes`) is the part that received the most significant overhaul:

```diff
+ import { schema } from 'dynamodb-toolbox/schema'
+ import { string } from 'dynamodb-toolbox/attributes/string'

const PokemonEntity = new Entity({
  ...,
- attributes: {
-   trainer: { type: 'string', map: '_t' },
-   _p: { type: 'string', alias: 'pokemon' }
-   ...,
- },
+ schema: schema({
+   trainer: string().optional().savedAs('_t'),
+   pokemon: string().optional().savedAs('_p'),
+   ...
+ }),
})
```

See the [Schema documentation](../../4-schemas/1-usage/index.md) for a complete documentation on the new syntax.

### `map` & `alias`

`map` and `alias` options have been simplified to a single `savedAs` options:

```diff
const PokemonEntity = new Entity({
  ...,
- attributes: {
-   trainer: { type: 'string', required: true, map: '_t' },
-   _p: { type: 'string', required: true, alias: 'pokemon' },
-   ...,
- },
+ schema: schema({
+   trainer: string().savedAs('_t'),
+   pokemon: string().savedAs('_p'),
+   ...,
+ }),
})
```

### `partitionKey` & `sortKey`

Instead of `partitionKey` and `sortKey` booleans that mapped attributes to the primary key attributes, the v1 exposes a `key` boolean option to tag attributes as being part of the primary key.

The renaming can simply be done through the `savedAs` option, which is more explicit:

```diff
const PokemonEntity = new Entity({
  ...,
- attributes: {
-   trainerId: { type: 'string', partitionKey: true },
-   pokemonId: { type: 'string', sortKey: true },
-   ...,
- }
+ schema: schema({
+   trainerId: string().key().savedAs('pk'),
+   pokemonId: string().key().savedAs('sk'),
+   ...,
+ })
})
```

The schema is validated against the `Table` primary key. A `computeKey` function is required if it doesn't match:

```diff
const PokemonEntity = new Entity({
  ...,
  schema: schema({
-   trainerId: string().key().savedAs('pk'),
-   pokemonId: string().key().savedAs('sk'),
+   trainerId: string().key(),
+   pokemonId: string().key()
    ...,
  }),
+ // 🙌 Type-safe!
+ computeKey: ({ trainerId, pokemonId }) => ({
+   pk: trainerId,
+   sk: pokemonId
+ })
})
```

### `saved`

There are no equivalent to the `saved: false` option for the moment. Feel free to [open a discussion](https://github.com/jeremydaly/dynamodb-toolbox/discussions/new/choose) if you need it back.

### `required`

Attributes are now **required by default**. You can tag them as optional via the `.required("never")` method (or the equivalent `.optional()` shorthand):

```diff
const PokemonEntity = new Entity({
  ...,
- attributes: {
-   optional: { type: 'string' },
-   required: { type: 'string', required: true },
-   always: { type: 'string', required: 'always' },
-   ...,
- }
+ schema: schema({
+   optional: string().optional(),
+   required: string(),
+   always: string().required('always'),
+   ...,
+ })
})
```

### `default` & `onUpdate`

The `default` and `onUpdate` options have been reworked into the following options:

- `putDefault`: Applied on put actions (e.g. [`PutItemCommand`](../../3-entities/3-actions/2-put-item/index.md))
- `updateDefault`: Applied on update actions (e.g. [`UpdateItemCommand`](../../3-entities/3-actions/3-update-item/index.md))
- `keyDefault`: Overrides other defaults on key attributes (ignored otherwise)
- `default`: Shorthand that acts as `keyDefault` on key attributes and `putDefault` otherwise

```diff
const PokemonEntity = new Entity({
  ...,
- attributes: {
-   level: { type: 'number', required: true, default: 1 },
-   created: {
-     type: 'string',
-     required: true,
-     default: () => new Date().toISOString()
-   },
-   ...,
- }
+ schema: schema({
+   level: number().default(1),
+   created: string().default(() => new Date().toISOString()),
+   ...,
+ })
})
```

If a default value is derived from other attributes, the v1 introduces a new notion called `links`. See the [Defaults & Links section](../../4-schemas/3-defaults-and-links/index.md) for more details:

- `putLink`: Applied on put actions (e.g. [`PutItemCommand`](../../3-entities/3-actions/2-put-item/index.md))
- `updateLink`: Applied on update actions (e.g. [`UpdateItemCommand`](../../3-entities/3-actions/3-update-item/index.md))
- `keyLink`: Overrides other links on key attributes (ignored otherwise)
- `link`: Shorthand that acts as `keyLink` on key attributes and `putLink` otherwise

```diff
const PokemonEntity = new Entity({
  ...,
- attributes: {
-   level: { type: 'number', required: true },
-   levelPlusOne: {
-     type: 'number',
-     required: true,
-     default: ({ level }) => level + 1,
-   },
-   ...,
- }
+ schema: schema({
+   level: number(),
+   ...,
+ }).and(prevSchema => ({
+   levelPlusOne: number().link<typeof prevSchema>(
+     ({ level }) => level + 1
+   ),
+ })),
})
```

:::note

In vanilla JS, `links` can be used directly in the original schema.

:::

For example, we can make use of links to compute the primary key instead of using the `computeKey` function:

```diff
const PokemonEntity = new Entity({
  ...,
- computeKey: ({ trainerId, pokemonId }) => ({
-   pk: trainerId,
-   sk: pokemonId
- })
  schema: schema({
    trainerId: string().key(),
    pokemonId: string().key()
    ...,
+ }).and(prevSchema => ({
+   pk: string().key().link<typeof prevSchema>(
+     ({ trainerId }) => trainerId
+   ),
+   sk: string().key().link<typeof prevSchema>(
+     ({ pokemonId }) => pokemonId
+   ),
+ })),
})
```

### `dependsOn`

The `dependsOn` option has been removed.

Note that links are applied **after** defaults, but links and defaults in themselves are computed in no guaranteed order.

You can avoid link dependencies by factorizing the underlying code:

```diff
const PokemonEntity = new Entity({
  ...,
- attributes: {
-   level: { type: 'number', required: true },
-   levelPlusOne: {
-     type: 'number',
-     required: true,
-     default: ({ level }) => level + 1,
-   },
-   levelPlusTwo: {
-     type: 'number',
-     required: true,
-     default: ({ levelPlusOne }) => levelPlusOne + 1,
-     dependsOn: ['levelPlusOne']
-   },
-   ...,
- }
+ schema: schema({
+   level: number(),
+   ...,
+ }).and(prevSchema => ({
+   levelPlusOne: number().link<typeof prevSchema>(
+     ({ level }) => level + 1
+   ),
+   levelPlusTwo: number().link<typeof prevSchema>(
+     ({ level }) => level + 2
+   ),
+ })),
})
```

### `transform` & `format`

The `transform` and `format` options have been merged into a single `transform` option:

```diff
const PokemonEntity = new Entity({
  ...,
- attributes: {
-   status: {
-     type: 'string',
-     required: true,
-     transform: input => `STATUS#${input}`,
-     format: output => output.slice(7)
-   },
-   ...,
- }
+ schema: schema({
+   status: string().transform({
+     parse: input => `STATUS#${input}`,
+     format: output => output.slice(7)
+   }),
+   ...,
+ })
})
```

The `prefix` and `suffix` options are now examples of transformers (see the [list of available transformers](../../4-schemas/15-transformers/1-usage.md) for more infos).

### `coerce`

The `coerce` option has not been re-implemented yet, but is on the roadmap.

### Misc.

The `type` and `setType` options are not useful and have been removed.

Using an array for composite keys is not supported anymore: Use [links](#default--onupdate) instead.

## Commands

Instead of having dedicated methods, `Tables` and `Entities` now have a single `.build` method which acts as a gateway to perform **actions**:

```diff
+ import { GetItemCommand } from 'dynamodb-toolbox/entity/actions/get'

- const { Item } = await PokemonEntity.get({ pokemonId })
+ const { Item } = await PokemonEntity.build(GetItemCommand)
+   .key({ pokemonId })
+   .send()
```

See the [Getting Started section](../../1-getting-started/3-usage/index.md#methods-vs-actions) for more details on why we think this is a better syntax.

Adding [custom parameters and clauses](../6-custom-parameters/index.md) is not possible anymore, but you can always use the `.params()` methods and build from there.

### Table methods

<table>
    <thead>
        <tr>
            <th>Cat.</th>
            <th>Method</th>
            <th>Action</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td rowSpan="2" align="center" class="vertical"><b>Fetching</b></td>
            <td><code>.scan(...)</code></td>
            <td><a href="/docs/tables/actions/scan"><code>ScanCommand</code></a></td>
            <td>Performs a <a href="https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Scan.html">Scan Operation</a> on a <code>Table</code></td>
        </tr>
        <tr>
            <td><code>.query(...)</code></td>
            <td><a href="/docs/tables/actions/query"><code>QueryCommand</code></a></td>
            <td>Performs a <a href="https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Query.html">Query Operation</a> on a <code>Table</code></td>
        </tr>
        <tr>
            <td rowSpan="2" align="center" class="vertical"><b>Batching</b></td>
            <td><code>.batchGet(...)</code></td>
            <td><a href="/docs/tables/actions/batch-get"><code>BatchGetCommand</code></a></td>
            <td>Groups one or several <a href="/docs/entities/actions/batch-get"><code>BatchGetRequest</code></a> from the <code>Table</code> entities to execute a <a href="https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_BatchGetItem.html"><code>BatchGetItem</code></a></td>
        </tr>
        <tr>
            <td><code>.batchWrite(...)</code></td>
            <td><a href="/docs/tables/actions/batch-write"><code>BatchWriteCommand</code></a></td>
            <td>Groups one or several <a href="/docs/entities/actions/batch-put"><code>BatchPutRequest</code></a> and <a href="/docs/entities/actions/batch-delete"><code>BatchDeleteRequest</code></a> from the <code>Table</code> entities to execute a <a href="https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_BatchWriteItem.html">BatchWriteItem</a> operation</td>
        </tr>
        <tr>
            <td rowSpan="2" align="center" class="vertical"><b>Transactions</b></td>
            <td><code>.transactGet(...)</code></td>
            <td><a href="/docs/entities/actions/transact-get"><code>GetTransaction</code></a></td>
            <td>Builds a transaction to get an entity item, to be used within <a href="https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_TransactGetItems.html">TransactGetItems operations</a></td>
        </tr>
        <tr>
            <td><code>.transactWrite(...)</code></td>
            <td><a href="/docs/entities/actions/transactions#transactwrite"><code>WriteTransaction</code></a></td>
            <td>Builds a transaction to write entity items, to be used within <a href="https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_TransactWriteItems.html">TransactWriteItems operations</a></td>
        </tr>
    </tbody>
</table>

### Entity methods

<table>
    <thead>
        <tr>
            <th>Cat.</th>
            <th>Method</th>
            <th>Action</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td rowSpan="4" align="center" class="vertical"><b>General</b></td>
            <td><code>.get(...)</code></td>
            <td><a href="/docs/entities/actions/get-item"><code>GetItemCommand</code></a></td>
            <td>Performs a <a href="https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_GetItem.html">GetItem Operation</a> on an entity item</td>
        </tr>
        <tr>
            <td><code>.put(...)</code></td>
            <td><a href="/docs/entities/actions/put-item"><code>PutItemCommand</code></a></td>
            <td>Performs a <a href="https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_PutItem.html">PutItem Operation</a> on an entity item</td>
        </tr>
        <tr>
            <td><code>.update(...)</code></td>
            <td><a href="/docs/entities/actions/update-item"><code>UpdateItemCommand</code></a></td>
            <td>Performs a <a href="https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_UpdateItem.html">UpdateItem Operation</a> on an entity item</td>
        </tr>
        <tr>
            <td><code>.delete(...)</code></td>
            <td><a href="/docs/entities/actions/delete-item"><code>DeleteItemCommand</code></a></td>
            <td>Performs a <a href="https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_DeleteItem.html">DeleteItem Operation</a> on an entity item</td>
        </tr>
        <tr>
            <td rowSpan="3" align="center" class="vertical"><b>Batching</b></td>
            <td><code>.getBatch(...)</code></td>
            <td><a href="/docs/entities/actions/batch-get"><code>BatchGetRequest</code></a></td>
            <td>Builds a request to get an entity item, to be used within <a href="/docs/tables/actions/batch-get"><code>BatchGetCommands</code></a></td>
        </tr>
        <tr>
            <td><code>.putBatch(...)</code></td>
            <td><a href="/docs/entities/actions/batch-put"><code>BatchPutRequest</code></a></td>
            <td>Builds a request to put an entity item, to be used within <a href="/docs/tables/actions/batch-write"><code>BatchWriteCommands</code></a></td>
        </tr>
        <tr>
            <td><code>.deleteBatch(...)</code></td>
            <td><a href="/docs/entities/actions/batch-delete"><code>BatchDeleteRequest</code></a></td>
            <td>Builds a request to delete an entity item, to be used within <a href="/docs/tables/actions/batch-write"><code>BatchWriteCommands</code></a></td>
        </tr>
        <tr>
            <td rowSpan="5" align="center" class="vertical"><b>Transactions</b></td>
            <td><code>.getTransaction(...)</code></td>
            <td><a href="/docs/entities/actions/transact-get"><code>GetTransaction</code></a></td>
            <td>Builds a transaction to get an entity item, to be used within <a href="https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_TransactGetItems.html">TransactGetItems operations</a></td>
        </tr>
        <tr>
            <td><code>.putTransaction(...)</code></td>
            <td><a href="/docs/entities/actions/transact-put"><code>PutTransaction</code></a></td>
            <td>Builds a transaction to put an entity item, to be used within <a href="https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_TransactWriteItems.html">TransactWriteItems operations</a></td>
        </tr>
        <tr>
            <td><code>.updateTransaction(...)</code></td>
            <td><a href="/docs/entities/actions/transact-update"><code>UpdateTransaction</code></a></td>
            <td>Builds a transaction to update an entity item, to be used within <a href="https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_TransactWriteItems.html">TransactWriteItems operations</a></td>
        </tr>
        <tr>
            <td><code>.deleteTransaction(...)</code></td>
            <td><a href="/docs/entities/actions/transact-delete"><code>DeleteTransaction</code></a></td>
            <td>Builds a transaction to delete an entity item, to be used within <a href="https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_TransactWriteItems.html">TransactWriteItems operations</a></td>
        </tr>
        <tr>
            <td><code>.conditionCheck(...)</code></td>
            <td><a href="/docs/entities/actions/condition-check"><code>ConditionCheck</code></a></td>
            <td>Builds a condition to check against an entity item for the transaction to succeed, to be used within <a href="https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_TransactWriteItems.html">TransactWriteItems operations</a></td>
        </tr>
        <tr>
            <td rowSpan="2" align="center" class="vertical"><b>Fetching</b></td>
            <td><code>.scan(...)</code></td>
            <td>-</td>
            <td>Not implemented yet, use the Table <a href="/docs/tables/actions/scan"><code>ScanCommand</code></a> instead</td>
        </tr>
        <tr>
            <td><code>.query(...)</code></td>
            <td>-</td>
            <td>Not implemented yet, use the Table <a href="/docs/tables/actions/query"><code>QueryCommand</code></a> instead</td>
        </tr>
    </tbody>
</table>

## Condition Expressions

Conditions benefit from **improved typing**, and **clearer logical combinations**:

```ts
const v0Condition = [
  { attr: 'pokemonId', exists: false },
  // 👇 'and' combination by default
  { attr: 'level', lte: 99 },
  [
    // 👇 'or' in first condition means 'or' for group
    { or: true, negate: true, ... }
    ...,
  ]
]

const v1Condition = {
  and: [
    { attr: 'pokemonId', exists: false },
    // 🙌 "lte" is correcly typed
    { attr: 'level', lte: 99 }
    // 🙌 You can nest logical combinations
    {
      or: [
        { not: { ... } },
        ...,
      ]
    },
  ]
}
```

## Projection Expressions

Projections expressions can now be nested:

```ts
const projection = {
  attributes: [
    'pokemonId',
    'level',
    'some.nested.map.value',
    'some.array[0].element'
  ]
}
```
