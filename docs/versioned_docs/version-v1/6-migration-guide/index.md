---
sidebar_position: 6
title: ⬆ Migration Guide
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Migration Guide

If you're currently using the **v1** of DynamoDB-Toolbox, here are the changes you need to be aware of when **migrating to the v2**.

## Rework of the `entity` attribute

The `entityAttributeName` and `entityAttributeHidden` settings have been **merged into a single `entityAttribute`** setting, similar to the [timestamp attributes](../3-entities/2-internal-attributes/index.md#timestamp-attributes):

```diff
import { Entity } from 'dynamodb-toolbox/entity'

const PokemonEntity = new Entity({
- entityAttributeName: '__entity__',
- entityAttributeHidden: false,
+ entityAttribute: {
+   name: '__entity__',
+   hidden: false
+ },
  ...
})
```

The internal `entity` attribute **can now be disabled** by setting `entityAttribute` to `false`:

```ts
import { Entity } from 'dynamodb-toolbox/entity'

const PokemonEntity = new Entity({
  entityAttribute: false,
  ...
})
```

This change makes **migrating to DynamoDB-Toolbox easier**, especially when using multiple tables (i.e., one `Entity` per `Table`), where the `entity` attribute is often unnecessary.

If you use the Single Table Design approach, we still **strongly recommend using the `entity` attribute**, as it improves performance and enables entity-based filtering when fetching items from multiple entities within the same `Table`.

Indeed, in queries and scans, the behavior regarding `Entities` has changed as follows:

- If all `Entities` use the internal `entity` attribute, a **[Filter Expression](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Scan.html#API_Scan_RequestSyntax) is applied** based on it.
- If at least one `Entity` does not use the internal `entity` attribute, or if `entityAttrFilter` is set to `false`, **no Filter Expression is applied**. In this case:
  - Entity-based filtering is **denied** if more than two `Entities` are provided.
  - Returned items that lack the internal `entity` attribute are **formatted by all `Entities`** in order until formatting succeeds, which can lead to decreased performance.
  - If a returned item cannot be formatted by any `Entity`, DynamoDB-Toolbox **raises an error**. This behavior can be modified by setting the `noEntityMatchBehavior` option to `'DISCARD'`:

```ts
const { Items } = await PokeTable.build(QueryCommand)
  .entities(PokemonEntity, TrainerEntity)
  .query({ partition: 'ashKetchum' })
  .options({
    entityAttrFilter: false,
    noEntityMatchBehavior: 'DISCARD'
  })
  .send()
```

This update provides greater flexibility while maintaining performance optimizations when needed.

## Rework of `Schemas`

In v1, schemas existed in one of two states: **Warm** for building/composition time and **Frozen** for usage.

```ts
import { string } from 'dynamodb-toolbox/attributes/string'

const warmStrSchema = string()
const frozenStrSchema = warmStrSchema.freeze()

const parsed = frozenStrSchema.build(Parser).parse(input)
```

This additional step made schema syntax cumbersome, so in v2, **the freezing step has been removed**:

```ts
// v2 🙌 `string` is directly a "schema"
import { string } from 'dynamodb-toolbox/schema/string'

const parsed = string().build(Parser).parse(input)
```

The `attr` and `attr` shorthands have been renamed to **`schema`** and **`s`**, and the original `schema` declaration has been renamed to **`item`**. It is now **just another type of schema**:

```ts
import { item } from 'dynamodb-toolbox/schema/item'
import { string } from 'dynamodb-toolbox/schema/string'

const pokemonSchema = item({
  name: string()
})

// ...or 👇
import { s } from 'dynamodb-toolbox/schema'

const pokemonSchema = s.item({
  name: s.string()
})
```

Actually, you don't really need to use `item` schemas as `map` schemas now have the **`.pick`, `.omit` and `.and` methods** and **can be used within the `Entity` constructor**:

```ts
import { map } from 'dynamodb-toolbox/schema/map'
import { string } from 'dynamodb-toolbox/schema/string'
import { number } from 'dynamodb-toolbox/schema/number'
import { Entity } from 'dynamodb-toolbox/entity'

const pokemonSchema = map({
  name: string(),
  level: number(),
  ...
})

const PokemonEntity = new Entity({
  // 👇 Creates an `item` schema w. the same attributes + internal attributes
  schema: pokemonSchema,
  ...
})
```

You can still inspect a schema's properties at runtime and through its types via the **`props` attribute**:

```ts
const hiddenStr = string().hidden()
const isHidden = hiddenStr.props.hidden // => true
```

Previously, calling `.freeze()` validated the schema. In v2, validation is now done using the **`check` method** (which is also called in the `Entity` constructor):

```ts
const stringWithDefault = string().default('foo')
const invalidSchema = list(stringWithDefault)

// ❌ List elements cannot have defaults
invalidSchema.check()
```

Hopefully, this makes it easier to build and re-use schemas accross your codebase.

## Rework of `record`

Record schemas now **properly translate to the `Record` type** in TS:

```ts
import { record } from 'dynamodb-toolbox/schema/record'
import { string } from 'dynamodb-toolbox/schema/string'
import { number } from 'dynamodb-toolbox/schema/number'
import { Parser } from 'dynamodb-toolbox/schema/actions/parse'

const rec = record(string(), number())
const parsed = rec.build(Parser).parse(...)
// => Record<string, number>
```

In particular, if the key schema is a `string` enum, the parsing **expects an element to be present for all enum values**:

```ts
const rec = record(string().enum('foo', 'bar'), number())

// ❌ Raises an error as 'bar' is missing
rec.build(Parser).parse({ foo: 42 })
```

You can change this behavior with the **`partial` property**:

```ts
const rec = record(...).partial()

// ✅ Succeeds
rec.build(Parser).parse({ foo: 42 })
```

## Renamings

### `Entity` and `Table` names

The `name` property of `Entity` and `Table` instances have been renamed to `entityName` and `tableName`:

```diff
- const entityName = PokemonEntity.name
+ const entityName = PokemonEntity.entityName

- const tableName = PokeTable.name
+ const tableName = PokeTable.tableName
```

### `Transformers`

Transformers' `parse` and `format` properties have been renamed to **`encode`** and **`decode`** for clarity:

```diff
const prefix = {
- parse: (input: string) => [PREFIX, input].join(''),
+ encode: (input: string) => [PREFIX, input].join(''),
- format: (saved: string) => saved.slice(PREFIX.length),
+ decode: (saved: string) => saved.slice(PREFIX.length),
}

const prefixedStrSchema = string().transform(prefix)
```

Similarly, the `ReadValue` and `ReadItem` types have been renamed to **`DecodedValue`** and **`DecodedItem`**:

```diff
- type ReadPokemonItem = ReadItem<typeof PokemonEntity>
+ type DecodedPokemonItem = DecodedItem<typeof PokemonEntity>

- type ReadPokemonValue = ReadValue<typeof pokemonSchema>
+ type DecodedPokemonValue = DecodedValue<typeof pokemonSchema>
```
