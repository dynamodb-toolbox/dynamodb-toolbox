---
title: tuple
sidebar_custom_props:
  code: true
  new: true
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Tuple

Describes [**tuple values**](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.NamingRulesDataTypes.html#HowItWorks.DataTypes), i.e. a finite list of index-value pairs. Child attributes can have any type:

```ts
import { tuple } from 'dynamodb-toolbox/schema/tuple'

const dateRangeSchema = tuple(string(), string())

type DateRange = FormattedValue<typeof dateRangeSchema>
// => [number, number]
```

:::info

For the moment, `tuple` properties can only be set by using methods.

:::

Tuple elements can have any type. However, they must respect some constraints:

- They cannot be `optional` or always required
- They cannot be `hidden` or `key` (tagging the `tuple` itself as `key` is enough)
- They cannot be renamed (with `savedAs`)

```ts
// ❌ Raises a type AND a run-time error
const strTuple = tuple(string().optional())
const strTuple = tuple(string().hidden())
const strTuple = tuple(string().key())
const strTuple = tuple(string().savedAs('foo'))
```

## Properties

### `.required()`

<p style={{ marginTop: '-15px' }}><i><code>string | undefined</code></i></p>

Tags schema values as **required** (within [`items`](../14-item/index.md) or [`maps`](../15-map/index.md)). Possible values are:

- <code>'atLeastOnce' <i>(default)</i></code>: Required (starting value)
- `'always'`: Always required (including updates)
- `'never'`: Optional

```ts
const dateRangeSchema = tuple(string(), string()).required()

// shorthand for `.required('never')`
const dateRangeSchema = tuple(...).optional()
```

### `.hidden()`

<p style={{ marginTop: '-15px' }}><i><code>boolean | undefined</code></i></p>

Omits schema values during [formatting](../18-actions/2-format.md):

```ts
const dateRangeSchema = tuple(string(), string()).hidden()
```

### `.key()`

<p style={{ marginTop: '-15px' }}><i><code>boolean | undefined</code></i></p>

Tags schema values as a primary key attribute or linked to a primary key attribute:

```ts
// Note: The method also sets the `required` property to 'always'
// (it is often the case in practice, you can still use `.optional()` if needed)
const dateRangeSchema = tuple(string(), string()).key()
```

### `.savedAs(...)`

<p style={{ marginTop: '-15px' }}><i><code>string</code></i></p>

Renames schema values during the [transformation step](../18-actions/1-parse.md) (at root level or within other Maps):

<!-- prettier-ignore -->
```ts
const dateRangeSchema = tuple(string(), string())
  .savedAs('d')
```

### `.default(...)`

<p style={{ marginTop: '-15px' }}><i><code>ValueOrGetter&lt;CHILD_ATTRIBUTES&gt;</code></i></p>

Specifies default values. See [Defaults and Links](../2-defaults-and-links/index.md) for more details:

:::note[Examples]

<Tabs>
<TabItem value="put-update" label="Put/Update">

```ts
const now = () => new Date().toISOString()

const timestampsSchema = tuple(string())
  .default(() => [now()])
  .updateDefault(() => [now()])
// 👇 Similar to
const timestampsSchema = tuple(string())
  .putDefault(() => [now()])
  .updateDefault(() => [now()])
```

</TabItem>
<TabItem value="key" label="Key">

```ts
const timestampsSchema = tuple(string())
  .key()
  .default(() => [now()])
// 👇 Similar to
const timestampsSchema = tuple(string())
  .key()
  .keyDefault(() => [now()])
```

</TabItem>
</Tabs>

:::

### `.link<Schema>(...)`

<p style={{ marginTop: '-15px' }}><i><code>Link&lt;SCHEMA, CHILD_ATTRIBUTES&gt;</code></i></p>

Similar to [`.default(...)`](#default) but allows deriving the default value from other attributes. See [Defaults and Links](../2-defaults-and-links/index.md) for more details:

```ts
const pokemonSchema = item({
  name: string()
}).and(prevSchema => ({
  parsedName: tuple(string(), string()).link<
    typeof prevSchema
  >(
    // 🙌 Correctly typed!
    ({ name }) => {
      const [firstName, lastName] = name.split(' ')
      return [firstName, lastName]
    }
  )
}))
```

### `.validate(...)`

<p style={{ marginTop: '-15px' }}><i><code>Validator&lt;CHILD_ATTRIBUTES&gt;</code></i></p>

Adds custom validation. See [Custom Validation](../3-custom-validation/index.md) for more details:

:::note[Examples]

```ts
const nonEmpty = tuple(string(), string()).validate(input =>
  input.some(value => value !== '')
)
// 👇 Similar to
const nonEmpty = tuple(string(), string()).putValidate(
  input => input.some(value => value !== '')
)
```

:::
