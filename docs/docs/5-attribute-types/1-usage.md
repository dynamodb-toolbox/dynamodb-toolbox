---
title: Usage
---

You can either import the attribute builders through their dedicated imports, or through the `attribute` or `attr` shorthands. For instance, those declarations will output the same attribute schema:

```tsx
// 👇 More tree-shakable
import { string } from 'dynamodb-toolbox/attribute/string'

const pokemonName = string()

// 👇 Less tree-shakable, but single import
import { attribute, attr } from 'dynamodb-toolbox/attribute'

const pokemonName = attribute.string()
const pokemonName = attr.string()
```

Prior to being wrapped in a `schema` declaration, attributes are called **warm:** They are **not validated** (at run-time) and can be used to build other schemas. By inspecting their types, you will see that they are prefixed with `$`. Once **frozen**, validation is applied and building methods are stripped:

The main takeaway is that **warm schemas can be composed** while **frozen schemas cannot**:

```tsx
import { schema } from 'dynamodb-toolbox';

const pokemonName = string();

const pokemonSchema = schema({
  // 👍 No problem
  pokemonName,
  ...
});

const pokedexSchema = schema({
  // ❌ Not possible
  pokemon: pokemonSchema,
  ...
});
```

You can create/update warm attributes by using dedicated methods or by providing option objects. The former provides a **slick devX** with autocomplete and shorthands, while the latter theoretically requires **less compute time and memory usage**, although it should be very minor (validation being only applied on freeze):

```tsx
// Using methods
const pokemonName = string().required('always')
// Using options
const pokemonName = string({ required: 'always' })
```

## Common options

All attributes share the following options:

- `required` _(string?="atLeastOnce")_ Tag a root attribute or Map sub-attribute as **required**. Possible values are:
  - `"atLeastOnce"` Required in `PutItem` commands
  - `"never"`: Optional in all commands
  - `"always"`: Required in all commands

```tsx
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

```tsx
const pokemonName = string().hidden()
const pokemonName = string({ hidden: true })
```

- `key` _(boolean?=true)_ Tag attribute as needed to compute the primary key:

```tsx
// Note: The method will also modify the `required` property to "always"
// (it is often the case in practice, you can still use `.optional()` if needed)
const pokemonName = string().key()
const pokemonName = string({
  key: true,
  required: 'always'
})
```

- `savedAs` _(string)_ Previously known as `map`. Rename a root or Map sub-attribute before sending commands:

```tsx
const pokemonName = string().savedAs('_n')
const pokemonName = string({ savedAs: '_n' })
```

#### Looking forward

I’m planning on including new `null`, `tuple` and `allOf` attributes at some point.

If there are other types you’d like to see, feel free to leave a comment on this article and/or [open a discussion on the official repo](https://github.com/jeremydaly/dynamodb-toolbox) with the `v1` label 👍
