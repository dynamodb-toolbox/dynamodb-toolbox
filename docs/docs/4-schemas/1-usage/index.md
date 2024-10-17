---
title: Usage
---

# Schema

A `Schema` is a list of attributes that describe the items of an [`Entity`](../../3-entities/1-usage/index.md):

```ts
import { schema } from 'dynamodb-toolbox/schema'
import { string } from 'dynamodb-toolbox/attributes/string'
import { number } from 'dynamodb-toolbox/attributes/number'

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

Schemas always start with a **root object**, listing [**attributes**](#attributes) by their names.

## Attribute Types

Schema attributes can be imported by their **dedicated exports**, or through the `attribute` or `attr` shorthands. For instance, those declarations output the same attribute:

```ts
// 👇 More tree-shakable
import { string } from 'dynamodb-toolbox/attributes/string'

const nameAttr = string()

// 👇 Less tree-shakable, but single import
import {
  attribute,
  attr
} from 'dynamodb-toolbox/attributes'

const nameAttr = attribute.string()
const nameAttr = attr.string()
```

Available attribute types are:

- [**`any`**](../5-any/index.md) - Contains any value
- [**`null`**](../6-null/index.md) - Contains [null](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.NamingRulesDataTypes.html#HowItWorks.DataTypes)
- [**`boolean`**](../7-boolean/index.md) - Contains [booleans](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.NamingRulesDataTypes.html#HowItWorks.DataTypes)
- [**`number`**](../8-number/index.md): Contains [numbers](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.NamingRulesDataTypes.html#HowItWorks.DataTypes)
- [**`string`**](../9-string/index.md): Contains [strings](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.NamingRulesDataTypes.html#HowItWorks.DataTypes)
- [**`binary`**](../10-binary/index.md): Contains [binaries](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.NamingRulesDataTypes.html#HowItWorks.DataTypes)
- [**`set`**](../11-set/index.md): Contains [sets](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.NamingRulesDataTypes.html#HowItWorks.DataTypes) of either `number`, `string`, or `binary` elements
- [**`list`**](../12-list/index.md): Contains [lists](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.NamingRulesDataTypes.html#HowItWorks.DataTypes) of elements of any type
- [**`map`**](../13-map/index.md): Contains [maps](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.NamingRulesDataTypes.html#HowItWorks.DataTypes), i.e. a finite list of key-value pairs, values being child attributes of any type
- [**`record`**](../14-record/index.md): Contains a different kind of [maps](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.NamingRulesDataTypes.html#HowItWorks.DataTypes) - Records differ from `maps` as they have a non-explicit (potentially infinite) range of keys, but with a single value type
- [**`anyOf`**](../5-any/index.md): Contains a finite **union** of possible attributes

:::info

DynamoDB-Toolbox attribute types closely mirror the capabilities of DynamoDB. See the [DynamoDB documentation](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.NamingRulesDataTypes.html#HowItWorks.DataTypes) for more details.

:::

Note that some attribute types can be defined with other attributes. For instance, here's a list of string:

```ts
const nameAttr = string()
const namesAttr = list(nameAttr)
```

:::info

Schemas are a standalone feature of DynamoDB-Toolbox (you can use them separately to [parse](../16-actions/1-parse.md) and [format](../16-actions/2-format.md) data for instance) and might even be moved into a separate library one day.

:::

## Fine-Tuning Attributes

You can update attribute properties by using **dedicated methods** or by providing **option objects**.

The former provides a **slick devX** with autocomplete and shorthands, while the latter theoretically requires **less compute time and memory usage** (although it should be negligible):

```ts
// Using methods
const pokemonName = string().required('always')
// Using options
const pokemonName = string({ required: 'always' })
```

:::info

Attribute methods do not mute the origin attribute, but **return a new attribute** (hence the impact in memory usage).

:::

The output of an attribute method **is also an attribute**, so you can **chain methods**:

```ts
const pokeTypeAttr = string()
  .required('always')
  .enum('fire', 'water', 'grass')
  .savedAs('t')
```

## Warm vs Frozen

Prior to being wrapped in a `schema` declaration, attributes are called **warm:** They are **not validated** (at run-time) and can be used to build other schemas. By inspecting their types, you can see that they are prefixed with `$`.

```ts
const $nameSchema = string().required('always')
// => $StringAttribute
```

Once **frozen**, validation is applied and building methods are stripped:

```ts
const nameSchema = $nameSchema.freeze()
// => StringAttribute

nameSchema.required
// => 'always'
nameSchema.required('never')
// => ❌ 'required' is not a function
```

Wrapping attributes in a `schema` declaration **freezes them** under the hood:

```ts
const pokemonSchema = schema({ name: $nameSchema })
// => Schema<{ name: StringAttribute }>

pokemonSchema.attributes.name.required
// => 'always'
```

The main takeaway is that **warm schemas can be composed** while **frozen schemas cannot**:

```ts
const pokemonSchema = schema({
  // 👍 No problemo
  pokemonName: $nameSchema,
  ...
});

const pokedexSchema = schema({
  // ❌ Not possible
  pokemon: pokemonSchema,
  ...
});
```

## Updating Schemas

As we've just seen, once frozen, schemas **cannot be updated**.

However, you can use them to build **new schemas** with the following methods:

### `and(...)`

<p style={{ marginTop: '-15px' }}><i><code>(attr: $NEW_ATTR | (Schema&lt;OLD_ATTR&gt; => $NEW_ATTR)) => Schema&lt;OLD_ATTR & NEW_ATTR&gt;</code></i></p>

Allows **extending** a schema with **new attributes**:

```ts
const extendedSchema = baseSchema.and({
  newAttribute: string(),
  ...
})
```

:::info

In case of naming conflicts, new attributes will **override** the previous ones.

:::

The method also accepts functions that return a (warm) schema. In this case, the previous schema is provided as an argument (which is particularly useful for building [Links](../2-defaults-and-links/index.md#links)):

```ts
const extendedSchema = mySchema.and(prevSchema => ({
  newAttribute: string(),
  ...
}))
```

### `pick(...)`

<p style={{ marginTop: '-15px' }}><i><code>(...attrNames: ATTR_NAMES[]) => Schema&lt;Pick&lt;ATTR, ATTR_NAMES&gt;&gt;</code></i></p>

Produces a **new schema** by keeping only certain **attributes** of the original schema:

```ts
const picked = pokemonSchema.pick('name', 'pokemonLevel')
```

Due to the potential disruptive nature of this method on [links](../2-defaults-and-links/index.md#links), they are **reset** in the process:

```ts
const nameSchema = schema({
  firstName: string(),
  lastName: string(),
  completeName: string().link(({ firstName, lastName }) =>
    [firstName, lastName].join(' ')
  )
})

const picked = nameSchema.pick('lastName', 'completeName')

picked.attributes.completeName.links.put
// => undefined
```

### `omit(...)`

<p style={{ marginTop: '-15px' }}><i><code>(...attrNames: ATTR_NAMES[]) => Schema&lt;Omit&lt;ATTR, ATTR_NAMES&gt;&gt;</code></i></p>

Produces a **new schema** by removing certain **attributes** out of the original schema:

```ts
const omitted = pokemonSchema.omit('name', 'pokemonLevel')
```

Due to the potential disruptive nature of this method on [links](../2-defaults-and-links/index.md#links), they are **reset** in the process:

```ts
const nameSchema = schema({
  firstName: string(),
  lastName: string(),
  completeName: string().link(({ firstName, lastName }) =>
    [firstName, lastName].join(' ')
  )
})

const omitted = nameSchema.omit('firstName')

omitted.attributes.completeName.links.put
// => undefined
```
