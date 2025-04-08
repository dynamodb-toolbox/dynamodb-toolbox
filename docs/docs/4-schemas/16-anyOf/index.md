---
title: anyOf
sidebar_custom_props:
  code: true
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# AnyOf

Describes a **union of types**, i.e. a range of possible types:

```ts
import { anyOf } from 'dynamodb-toolbox/schema/anyOf'

const pokeTypeSchema = anyOf(
  string().const('fire'),
  string().const('grass'),
  string().const('water')
)

type PokeType = FormattedValue<typeof pokeTypeSchema>
// => 'fire' | 'grass' | 'water'
```

In this example, an `enum` would have done the trick. However, `anyOf` becomes particularly powerful when used in conjunction with a `map` and the `enum` or `const` directives of a primitive attribute, to implement [**polymorphism**](<https://en.wikipedia.org/wiki/Polymorphism_(computer_science)>):

```ts
const captureSchema = anyOf(
  map({
    status: string().const('caught'),
    // 👇 captureState.trainerId exists if status is "caught"...
    trainerId: string()
  }),
  // ...but not otherwise! 🙌
  map({ status: string().const('wild') })
)

// Discriminate on string enum attributes for faster parsing! 🙌
const fasterSchema = captureSchema.discriminate('status')

type Capture = FormattedValue<typeof captureSchema>
// =>
//  | { status: "caught"; trainerId: string }
//  | { status: "wild" }
```

:::warning

In the absence of discriminating attribute, the parsing an `anyOf` schema value returns the parsed output of the first sub-schema it validates against.

This means the **order of the sub-schemas matters**: you should always start with the **strictest** schemas.

:::

:::info

For the moment, `anyOf` properties can only be set by using methods.

:::

AnyOf elements can have any type. However, they must respect some constraints:

- They cannot be `optional` or always required
- They cannot be `hidden` or `key` (tagging the `anyOf` itself as `key` is enough)
- They cannot have `default` or `links`

```ts
// ❌ Raises a type AND a run-time error
const union = anyOf(number(), string().optional())
const union = anyOf(number(), string().hidden())
const union = anyOf(number(), string().key())
const union = anyOf(number(), string().default('foo'))
```

## Properties

### `.required()`

<p style={{ marginTop: '-15px' }}><i><code>string | undefined</code></i></p>

Tags schema values as **required** (within [`items`](../13-item/index.md) or [`maps`](../14-map/index.md)). Possible values are:

- <code>'atLeastOnce' <i>(default)</i></code>: Required (starting value)
- `'always'`: Always required (including updates)
- `'never'`: Optional

```ts
const pokeTypeSchema = anyOf(
  string().const('fire'),
  string().const('grass'),
  string().const('water')
).required()

// shorthand for `.required('never')`
const pokeTypeSchema = anyOf(...).optional()
```

### `.hidden()`

<p style={{ marginTop: '-15px' }}><i><code>boolean | undefined</code></i></p>

Omits schema values during [formatting](../17-actions/2-format.md):

```ts
const pokeTypeSchema = anyOf(
  string().const('fire'),
  string().const('grass'),
  string().const('water')
).hidden()
```

### `.key()`

<p style={{ marginTop: '-15px' }}><i><code>boolean | undefined</code></i></p>

Tags schema values as a primary key attribute or linked to a primary key attribute:

```ts
// Note: The method also sets the `required` property to 'always'
// (it is often the case in practice, you can still use `.optional()` if needed)
const pokeTypeSchema = anyOf(
  string().const('fire'),
  string().const('grass'),
  string().const('water')
).key()
```

### `.savedAs(...)`

<p style={{ marginTop: '-15px' }}><i><code>string</code></i></p>

Renames schema values during the [transformation step](../17-actions/1-parse.md) (within [`items`](../13-item/index.md) or [`maps`](../14-map/index.md)):

```ts
const pokeTypeSchema = anyOf(
  string().const('fire'),
  string().const('grass'),
  string().const('water')
).savedAs('pkt')
```

### `.discriminate(...)`

<p style={{ marginTop: '-15px' }}><i><code>string</code></i></p>

**Leverages a specific attribute as a discriminator** to efficiently match between different schema options. Optimizes performance during [`Parsing`](../17-actions/1-parse.md) and [`Formatting`](../17-actions/2-format.md):

```ts
const catSchema = map({
  kind: string().enum('cat'),
  ... // Other cat attributes
})

const dogSchema = map({
  kind: string().enum('dog'),
  ... // Other dog attributes
})

const petSchema = anyOf(catSchema, dogSchema)
  .discriminate('kind')
```

You can retrieve a matching schema using the `match` method:

```ts
const matchingSchema = petSchema.match('dog') // => dogSchema
```

To be used as a discriminator, an attribute **must meet all of the following conditions**:

- ✅ It must be present within a [`map`](../14-map/index.md) attribute, either directly or as part of another `anyOf` schema.
- ✅ It must be **present in every schema option**.
- ✅ It must be of type [`string`](../9-string/index.md) and use the [`enum`](../9-string/index.md#enum) property.
- ✅ If renamed, the same `savedAs` value must be used **across all options**.
- ❌ It must **not** be `optional` or `transformed`.

The following examples will raise **both type and runtime errors**:

```ts
// ❌ 'age' is not a string with enum values
const petSchema = anyOf(
  map({ age: number().enum(1, 2, 3) })
).discriminate('age')

// ❌ 'kind' is marked as optional
const petSchema = anyOf(
  map({ kind: string().enum('cat').optional() })
).discriminate('kind')

// ❌ 'savedAs' is inconsistent across options
const petSchema = anyOf(
  map({ kind: string().enum('cat').savedAs('kind') }),
  map({ kind: string().enum('dog').savedAs('__kind__') })
).discriminate('kind')
```

### `.default(...)`

<p style={{ marginTop: '-15px' }}><i><code>ValueOrGetter&lt;ATTRIBUTES&gt;</code></i></p>

Specifies default values. See [Defaults and Links](../2-defaults-and-links/index.md) for more details:

:::note[Examples]

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

Similar to [`.default(...)`](#default) but allows deriving the default value from other attributes. See [Defaults and Links](../2-defaults-and-links/index.md) for more details:

```ts
const pokemonSchema = item({
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

### `.validate(...)`

<p style={{ marginTop: '-15px' }}><i><code>Validator&lt;ELEMENTS&gt;</code></i></p>

Adds custom validation. See [Custom Validation](../3-custom-validation/index.md) for more details:

:::note[Examples]

```ts
const nonEmptyListSchema = anyOf(
  list(string()),
  list(number())
).validate(input => input.length > 0)
// 👇 Similar to
const nonEmptyListSchema = anyOf(
  list(string()),
  list(number())
).putValidate(input => input.length > 0)
```

:::
