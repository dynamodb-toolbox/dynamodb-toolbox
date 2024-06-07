---
title: anyOf
sidebar_custom_props:
  code: true
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# AnyOf

Defines a union of types, i.e. a range of possible types:

```ts
import { anyOf } from 'dynamodb-toolbox/attribute/anyOf'

const pokemonSchema = schema({
  ...
  pokeType: anyOf(
    string().const('fire'),
    string().const('grass'),
    string().const('water')
  )
})

type FormattedPokemon = FormattedItem<typeof PokemonEntity>
// => {
//   ...
//   pokeType: 'fire' | 'grass' | 'water'
// }
```

In this particular case, an `enum` would have done the trick. However, `anyOf` becomes particularly powerful when used in conjunction with a `map` and the `enum` or `const` directives of a primitive attribute, to implement [**polymorphism**](<https://en.wikipedia.org/wiki/Polymorphism_(computer_science)>):

```ts
const pokemonSchema = schema({
  ...
  captureState: anyOf([
    map({
      status: string().const('caught'),
      // 👇 captureState.trainerId exists if status is "caught"...
      trainerId: string()
    }),
    // ...but not otherwise! 🙌
    map({ status: string().const('wild') })
  ])
})

type FormattedPokemon = FormattedItem<typeof PokemonEntity>
// => {
//   ...
//   captureState:
//     | { status: "caught", trainerId: string }
//     | { status: "wild" }
// }
```

:::info

For the moment, `anyOf` properties can only be set by using methods.

:::

AnyOf elements can have any type. However, they must respect some constraints:

- They cannot be `optional` or always required
- They cannot be `hidden` or `key` (tagging the `record` itself as `key` is enough)
- They cannot have `default` or `links`

```ts
// ❌ Raises a type AND a run-time error
const union = anyOf(number(), string().optional())
const union = anyOf(number(), string().hidden())
const union = anyOf(number(), string().key())
const union = anyOf(number(), string().default('foo'))
```

## Options

### `.required()`

<p style={{ marginTop: '-15px' }}><i><code>string | undefined</code></i></p>

Tags the attribute as **required** (at root level or within [Maps](./8-maps.md)). Possible values are:

- <code>"atLeastOnce" <i>(default)</i></code>: Required
- `"always"`: Always required (including updates)
- `"never"`: Optional

```ts
const pokeTypeSchema = anyOf(
  string().const('fire'),
  string().const('grass'),
  string().const('water')
).required()

// shorthand for `.required("never")`
const pokeTypeSchema = anyOf(...).optional()
```

### `.hidden()`

<p style={{ marginTop: '-15px' }}><i><code>boolean | undefined</code></i></p>

Skips the attribute when formatting items:

```ts
const pokeTypeSchema = anyOf(
  string().const('fire'),
  string().const('grass'),
  string().const('water')
).hidden()
```

### `.key()`

<p style={{ marginTop: '-15px' }}><i><code>boolean | undefined</code></i></p>

Tags the attribute as needed to compute the primary key:

```ts
// Note: The method also sets the `required` property to "always"
// (it is often the case in practice, you can still use `.optional()` if needed)
const pokeTypeSchema = anyOf(
  string().const('fire'),
  string().const('grass'),
  string().const('water')
).key()
```

### `.savedAs(...)`

<p style={{ marginTop: '-15px' }}><i><code>string</code></i></p>

Renames the attribute during the [transformation step](../4-schemas/14-actions/1-parse.md) (at root level or within [Maps](./8-maps.md)):

```ts
const pokeTypeSchema = anyOf(
  string().const('fire'),
  string().const('grass'),
  string().const('water')
).savedAs('pkt')
```

### `.default(...)`

<p style={{ marginTop: '-15px' }}><i><code>ValueOrGetter&lt;ATTRIBUTES&gt;</code></i></p>

Specifies default values for the attribute. There are three kinds of defaults:

- `putDefault`: Applied on put actions (e.g. [`PutItemCommand`](../3-entities/3-actions/2-put-item/index.md))
- `updateDefault`: Applied on update actions (e.g. [`UpdateItemCommand`](../3-entities/3-actions/3-update-item/index.md))
- `keyDefault`: Overrides other defaults on [key](#key) attributes (ignored otherwise)

The `default` method is a shorthand that acts as `keyDefault` on key attributes and `putDefault` otherwise:

:::noteExamples

<Tabs>
<TabItem value="put-update" label="Put/Update">

```ts
const now = () => new Date().toISOString()

const hasUpdateSchema = anyOf(
  map({ hasUpdate: boolean().const(false) }),
  map({ hasUpdate: boolean().const(true), date: string() })
)
  .default(() => ({ hasUpdate: false }))
  .updateDefault(() => ({ hasUpdate: true, date: now() }))
// 👇 Similar to
const timestampsSchema = anyOf('...')
  .putDefault(() => ({ hasUpdate: false }))
  .updateDefault(() => ({ hasUpdate: true, date: now() }))
```

</TabItem>
<TabItem value="key" label="Key">

```ts
const idsSchema = anyOf(
  map({
    hasSubId: boolean().const(false),
    id: string()
  }),
  map({
    hasSubId: boolean().const(true),
    id: string(),
    subId: string()
  })
)
  .key()
  .default({ hasSubId: false, id: '123' })
// 👇 Similar to
const idsSchema = anyOf(...)
  .key()
  .keyDefault({ hasSubId: false, id: '123' })
```

</TabItem>
</Tabs>

:::

### `.link<Schema>(...)`

<p style={{ marginTop: '-15px' }}><i><code>Link&lt;SCHEMA, ELEMENTS&gt;</code></i></p>

Similar to [`.default(...)`](#default) but allows deriving the default value from other attributes. See [Defaults and Links](../4-schemas/3-defaults-and-links/index.md) for more details:

```ts
const pokemonSchema = schema({
  name: string().optional(),
  level: number()
}).and(prevSchema => ({
  metadata: anyOf(string(), number()).link<
    typeof prevSchema
  >(
    // 🙌 Correctly typed!
    ({ name, level }) => name ?? level
  )
}))
```
