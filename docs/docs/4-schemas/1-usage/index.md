---
title: Usage
---

# Schema

`Schemas` are objects that describe the items and attributes of an [`Entity`](../../3-entities/1-usage/index.md):

```ts
import { item } from 'dynamodb-toolbox/schema/item'
import { string } from 'dynamodb-toolbox/schema/string'
import { number } from 'dynamodb-toolbox/schema/number'

const pokemonSchema = item({
  pokemonId: string().key(),
  level: number().default(1),
  pokeType: string()
    .enum('fire', 'water', 'grass')
    .optional()
})

const PokemonEntity = new Entity({
  ...,
  schema: pokemonSchema
})
```

:::info

Note that you can provide a [`map`](../../4-schemas/14-map/index.md) schema to the `Entity` constructor, although only its attributes are kept (not its props):

```ts
import { map } from 'dynamodb-toolbox/schema/map'

const pokemonSchema = map({
  pokemonId: string().key(),
  ...
})

const PokemonEntity = new Entity({
  ...,
  schema: pokemonSchema
})
```

See the [`map`](../14-map/index.md) documentation for more details.

:::

Schemas can be imported by their **dedicated exports**, or through the `schema` or `s` shorthands. For instance, those declarations output the same schema:

```ts
// 👇 More tree-shakable
import { string } from 'dynamodb-toolbox/schema/string'

const nameSchema = string()

// 👇 Single import
import { schema, s } from 'dynamodb-toolbox/schema'

const nameSchema = schema.string()
const nameSchema = s.string()
```

## Schema Types

Available schema types are:

- [**`any`**](../5-any/index.md) - Describes any value
- [**`null`**](../6-null/index.md) - Describes [null](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.NamingRulesDataTypes.html#HowItWorks.DataTypes)
- [**`boolean`**](../7-boolean/index.md) - Describes [booleans](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.NamingRulesDataTypes.html#HowItWorks.DataTypes)
- [**`number`**](../8-number/index.md): Describes [numbers](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.NamingRulesDataTypes.html#HowItWorks.DataTypes)
- [**`string`**](../9-string/index.md): Describes [strings](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.NamingRulesDataTypes.html#HowItWorks.DataTypes)
- [**`binary`**](../10-binary/index.md): Describes [binaries](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.NamingRulesDataTypes.html#HowItWorks.DataTypes)
- [**`set`**](../11-set/index.md): Describes [sets](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.NamingRulesDataTypes.html#HowItWorks.DataTypes) of either `number`, `string`, or `binary` elements
- [**`list`**](../12-list/index.md): Describes [lists](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.NamingRulesDataTypes.html#HowItWorks.DataTypes) of elements
- [**`item`**](../13-item/index.md): Describes [items](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.CoreComponents.html) with a finite list of attributes, i.e. key-schema pairs - Should be at the root of `Entity` schemas
- [**`map`**](../14-map/index.md): Describes [maps](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.NamingRulesDataTypes.html#HowItWorks.DataTypes) - Similar to [`items`](../13-item/index.md), but can be nested within other schemas
- [**`record`**](../15-record/index.md): Describes a different kind of [maps](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.NamingRulesDataTypes.html#HowItWorks.DataTypes) - Records differ from `maps` as they have a non-explicit (potentially infinite) range of keys, but with a single value type
- [**`anyOf`**](../5-any/index.md): Describes a finite **union** of possible schemas

:::info

DynamoDB-Toolbox schema types closely mirror the capabilities of DynamoDB. See the [DynamoDB documentation](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.NamingRulesDataTypes.html#HowItWorks.DataTypes) for more details.

:::

Note that some schema types can be defined with other schemas. For instance, here's a list of string:

```ts
const nameSchema = string()
const namesSchema = list(nameAttr)
```

:::info

Schemas are a standalone feature of DynamoDB-Toolbox (you can use them separately to [parse](../17-actions/1-parse.md) and [format](../17-actions/2-format.md) data for instance) and might even be moved into a separate library one day.

:::

## Schemas Props

You can update schema properties by using **dedicated methods** or by providing **input props**.

The former provides a **slick devX** with autocomplete and shorthands, while the latter theoretically requires **less compute time and memory usage** (although it should be negligible):

```ts
// Using methods
const pokemonNameSchema = string().required('always')
// Using input props
const pokemonNameSchema = string({ required: 'always' })
```

:::info

Methods do not mute the origin schema, but **return a new schema** (hence the impact in memory usage).

:::

The output of an schema method **is also a schema**, so you can **chain methods**:

```ts
const pokeTypeSchema = string()
  .required('always')
  .enum('fire', 'water', 'grass')
  .savedAs('t')
```

## Validating Schemas

You can inspect a schema's properties at runtime and through its types via the `props` attribute:

```ts
const props = pokeTypeSchema.props
// => {
//  required: 'always',
//  enum: ['fire', 'water', 'grass'],
//  savedAs: 't'
// }
```

You can use the `.check()` method to verify the validity of a schema:

```ts
pokeTypeSchema.check()

// 👇 With path for clearer error messages
pokeTypeSchema.check('pokeType')
```

:::info

☝️ Checking a schema also [freezes](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze) its props.

:::

## Using Schemas

To allow for **extensibility**, **better code-splitting** and **lighter bundles**, schemas only expose a `.build(...)` method which acts as a gateway to perform Schema [Actions](../../1-getting-started/3-usage/index.md#how-do-actions-work):

```ts
import { Parser } from 'dynamodb-toolbox/schema/actions/parse'

const pokeType = pokeTypeSchema.build(Parser).parse(string)
```
