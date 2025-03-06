---
title: record
sidebar_custom_props:
  code: true
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Record

Describes a different kind of [**map attribute**](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.NamingRulesDataTypes.html#HowItWorks.DataTypes). Records differ from [`maps`](../14-map/index.md) as they can have a non-explicit (and potentially infinite) range of keys, but have a single value type:

```ts
import { record } from 'dynamodb-toolbox/schema/record'

const pokeTypeSchema = string().enum('fire', ...)
const weaknessesSchema = record(pokeTypeSchema, number())

type Weaknesses = FormattedValue<typeof weaknessesSchema>
// => Record<PokeType, number>
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

Tags schema values as **required** (within [`items`](../13-item/index.md) or [`maps`](../14-map/index.md)). Possible values are:

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
const weaknessesSchema = record(..., { required: 'never' })
```

### `.hidden()`

<p style={{ marginTop: '-15px' }}><i><code>boolean | undefined</code></i></p>

Omits schema values during [formatting](../17-actions/2-format.md):

```ts
const weaknessesSchema = record(
  string().enum('fire', ...),
  number()
).hidden()
const weaknessesSchema = record(..., { hidden: true })
```

### `.key()`

<p style={{ marginTop: '-15px' }}><i><code>boolean | undefined</code></i></p>

Tags schema values as a primary key attribute or linked to a primary key attribute:

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

Renames schema values during the [transformation step](../17-actions/1-parse.md) (within [`items`](../13-item/index.md) or [`maps`](../14-map/index.md)):

```ts
const weaknessesSchema = record(
  string().enum('fire', ...),
  number()
).savedAs('w')
const weaknessesSchema = record(..., { savedAs: 'w' })
```

### `.partial()`

<p style={{ marginTop: '-15px' }}><i><code>boolean | undefined</code></i></p>

Turns the record into a **partial** record:

```ts
const weaknessesSchema = record(
  string().enum('fire', ...),
  number()
).partial()
const weaknessesSchema = record(..., { partial: true })

type Weaknesses = FormattedValue<typeof weaknessesSchema>
// => Partial<Record<PokeType, number>>
```

### `.default(...)`

<p style={{ marginTop: '-15px' }}><i><code>ValueOrGetter&lt;ATTRIBUTES&gt;</code></i></p>

Specifies default values. See [Defaults and Links](../2-defaults-and-links/index.md) for more details:

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
  putDefault: () => ({ created: now() }),
  updateDefault: () => ({ updated: now() })
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
  key: true,
  required: 'always',
  keyDefault: { abc: '123' }
})
```

</TabItem>
</Tabs>

:::

### `.link<Schema>(...)`

<p style={{ marginTop: '-15px' }}><i><code>Link&lt;SCHEMA, ATTRIBUTES&gt;</code></i></p>

Similar to [`.default(...)`](#default) but allows deriving the default value from other attributes. See [Defaults and Links](../2-defaults-and-links/index.md) for more details:

```ts
const pokemonSchema = item({
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

Adds custom validation. See [Custom Validation](../3-custom-validation/index.md) for more details:

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
  putValidator: input => Object.keys(input).length > 0
})
```

:::
