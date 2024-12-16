---
title: record
sidebar_custom_props:
  code: true
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Record

Defines a different kind of [**map attribute**](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.NamingRulesDataTypes.html#HowItWorks.DataTypes). Records differ from [`maps`](../13-map/index.md) as they can have a non-explicit (and potentially infinite) range of keys, but have a single value type:

```ts
import { record } from 'dynamodb-toolbox/attributes/record'

const pokeTypeSchema = string().enum('fire', ...)

const pokemonSchema = schema({
  ...
  weaknesses: record(pokeTypeSchema, number())
})

type FormattedPokemon = FormattedItem<typeof PokemonEntity>
// => {
//   ...
//   weaknesses: {
//     [key in PokeType]?: number
//   }
// }
```

Record elements can have any type. However, they must respect some constraints:

- They cannot be `optional` or always required
- They cannot be `hidden` or `key` (tagging the `record` itself as `key` is enough)
- They cannot have `default` or `links`

```ts
// ❌ Raises a type AND a run-time error
const strRecord = record(string(), string().optional())
const strRecord = record(string(), string().hidden())
const strRecord = record(string(), string().key())
const strRecord = record(string(), string().default('foo'))
```

Record keys share the same constraints and must be of type [`string`](../9-string/index.md).

## Options

### `.required()`

<p style={{ marginTop: '-15px' }}><i><code>string | undefined</code></i></p>

Tags the attribute as **required** (at root level or within [Maps](../13-map/index.md)). Possible values are:

- <code>'atLeastOnce' <i>(default)</i></code>: Required (starting value)
- `'always'`: Always required (including updates)
- `'never'`: Optional

```ts
// Equivalent
const weaknessesSchema = record(
  string().enum('fire', ...),
  number()
)
const weaknessesSchema = record(
  string().enum('fire', ...),
  number()
).required()
const weaknessesSchema = record(
  string().enum('fire', ...),
  number(),
  // Options can be provided as 3rd argument
  { required: 'atLeastOnce' }
)

// shorthand for `.required('never')`
const weaknessesSchema = record(...).optional()
const weaknessesSchema = map(..., { required: 'never' })
```

### `.hidden()`

<p style={{ marginTop: '-15px' }}><i><code>boolean | undefined</code></i></p>

Skips the attribute when formatting items:

```ts
const weaknessesSchema = record(
  string().enum('fire', ...),
  number()
).hidden()
const weaknessesSchema = record(..., { hidden: true })
```

### `.key()`

<p style={{ marginTop: '-15px' }}><i><code>boolean | undefined</code></i></p>

Tags the attribute as a primary key attribute or linked to a primary attribute:

```ts
// Note: The method also sets the `required` property to 'always'
// (it is often the case in practice, you can still use `.optional()` if needed)
const idsSchema = record(string(), string()).key()
const idsSchema = record(..., {
  key: true,
  required: 'always'
})
```

### `.savedAs(...)`

<p style={{ marginTop: '-15px' }}><i><code>string</code></i></p>

Renames the attribute during the [transformation step](../16-actions/1-parse.md) (at root level or within [Maps](../13-map/index.md)):

```ts
const weaknessesSchema = record(
  string().enum('fire', ...),
  number()
).savedAs('w')
const weaknessesSchema = record(..., { savedAs: 'w' })
```

### `.default(...)`

<p style={{ marginTop: '-15px' }}><i><code>ValueOrGetter&lt;ATTRIBUTES&gt;</code></i></p>

Specifies default values for the attribute. See [Defaults and Links](../2-defaults-and-links/index.md) for more details:

:::note[Examples]

<Tabs>
<TabItem value="put-update" label="Put/Update">

```ts
const now = () => new Date().toISOString()

const timestampsSchema = record(string(), string())
  .default(() => ({ created: now() }))
  .updateDefault(() => ({ updated: now() }))
// 👇 Similar to
const timestampsSchema = record(...)
  .putDefault(() => ({ created: now() }))
  .updateDefault(() => ({ updated: now() }))
// 👇 ...or
const timestampsSchema = record(..., {
  defaults: {
    key: undefined,
    put: () => ({ created: now() }),
    update: () => ({ updated: now() })
  }
})
```

</TabItem>
<TabItem value="key" label="Key">

```ts
const idsSchema = record(string(), string())
  .key()
  .default({ abc: '123' })
// 👇 Similar to
const idsSchema = record(...)
  .key()
  .keyDefault({ abc: '123' })
// 👇 ...or
const idsSchema = record(..., {
  defaults: {
    key: { abc: '123' },
    // put & update defaults are not useful in `key` attributes
    put: undefined,
    update: undefined
  },
  key: true,
  required: 'always'
})
```

</TabItem>
</Tabs>

:::

### `.link<Schema>(...)`

<p style={{ marginTop: '-15px' }}><i><code>Link&lt;SCHEMA, ATTRIBUTES&gt;</code></i></p>

Similar to [`.default(...)`](#default) but allows deriving the default value from other attributes. See [Defaults and Links](../2-defaults-and-links/index.md) for more details:

```ts
const pokemonSchema = schema({
  name: string()
}).and(prevSchema => ({
  parsedName: record(string(), string()).link<
    typeof prevSchema
  >(
    // 🙌 Correctly typed!
    ({ name }) => {
      const [firstName, lastName] = name.split(' ')
      return { firstName, lastName }
    }
  )
}))
```

### `.validate(...)`

<p style={{ marginTop: '-15px' }}><i><code>Validator&lt;ATTRIBUTES&gt;</code></i></p>

Adds custom validation to the attribute. See [Custom Validation](../3-custom-validation/index.md) for more details:

:::note[Examples]

```ts
const nonEmptyRecordSchema = record(
  string(),
  string()
).validate(input => Object.keys(input).length > 0)
// 👇 Similar to
const nonEmptyRecordSchema = record(
  string(),
  string()
).putValidate(input => Object.keys(input).length > 0)
// 👇 ...or
const nonEmptyRecordSchema = record(string(), string(), {
  validators: {
    key: undefined,
    put: input => input.length > 0,
    update: undefined
  }
})
```

:::
