---
title: Usage 👷
---

# Schema 👷

A `Schema` is a list of attributes that describe the items of an [`Entity`](../../3-entities/1-usage/index.md).

```ts
import { schema } from 'dynamodb-toolbox/schema'
import { string } from 'dynamodb-toolbox/attribute/string'
import { number } from 'dynamodb-toolbox/attribute/number'

const pokemonSchema = schema({
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

**typers**.

As you can see, schemas are composable, re-use them accross entities.

## Typers

You can either import the typers through their dedicated imports, or through the `attribute` or `attr` shorthands. For instance, those declarations output the same schema:

```ts
// 👇 More tree-shakable
import { string } from 'dynamodb-toolbox/attribute/string'

const nameSchema = string()

// 👇 Less tree-shakable, but single import
import { attribute, attr } from 'dynamodb-toolbox/attribute'

const nameSchema = attribute.string()
const nameSchema = attr.string()
```

The output of an attribute method is also an attribute, so you can chain methods:

```ts
const pokeTypeSchema = string()
  .enum('fire', 'water', 'grass')
  .optional()
  .savedAs('t')
```

The list of available attribute types closely mirror the capabilities of DynamoDB. You can find out more on which types are available in the [Attributes section](/docs/schemas-and-attributes).

:::info

Schemas are a standalone feature of DynamoDB-Toolbox. You can use them on their own to validate or format data for instance. We have plan to outsource them in their own library someday.

:::

## Options

You can update attributes properties by using **dedicated methods** or by providing **option objects**.

The former provides a **slick devX** with autocomplete and shorthands, while the latter theoretically requires **less compute time and memory usage**, although it should be very minor:

```ts
// Using methods
const pokemonName = string().required('always')
// Using options
const pokemonName = string({ required: 'always' })
```

## Options

All attributes share the following options:

- `required` _(string?="atLeastOnce")_ Tag a root attribute or Map sub-attribute as **required**. Possible values are:
  - `"atLeastOnce"` Required in `PutItem` commands
  - `"never"`: Optional in all commands
  - `"always"`: Required in all commands

```ts
// Equivalent
const pokemonName = string().required()
const pokemonName = string({ required: 'atLeastOnce' })

// `.optional()` is a shorthand for `.required(”never”)`
const pokemonName = string().optional()
const pokemonName = string({ required: 'never' })
```

:::info

A very important breaking change from previous versions is that **root attributes and Map sub-attributes are now required by default**. This was made so **composition and validation work better together**.

:::

- `hidden` _(boolean?=true)_ Skip attribute when formatting the returned item of a command:

```ts
const pokemonName = string().hidden()
const pokemonName = string({ hidden: true })
```

- `key` _(boolean?=true)_ Tag attribute as needed to compute the primary key:

```ts
// Note: The method also sets the `required` property to "always"
// (it is often the case in practice, you can still use `.optional()` if needed)
const pokemonName = string().key()
const pokemonName = string({
  key: true,
  required: 'always'
})
```

- `savedAs` _(string)_ Previously known as `map`. Rename a root or Map sub-attribute before sending commands:

```ts
const pokemonName = string().savedAs('_n')
const pokemonName = string({ savedAs: '_n' })
```
