---
title: nul
sidebar_custom_props:
  code: true
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Null

Describes [**null values**](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.NamingRulesDataTypes.html#HowItWorks.DataTypes):

```ts
// `null` is a reserved keyword 🤷‍♂️
import { nul } from 'dynamodb-toolbox/schema/nul'

const nullSchema = nul()

type Null = FormattedValue<typeof nullSchema>
// => null
```

:::info

Not very useful on itself, `nul` is more likely to be used in conjunction with [`anyOf`](../16-anyOf/index.md) to define **nullable** schemas:

```ts
const nullableString = anyOf(string(), nul())

type NullableString = FormattedValue<typeof nullableString>
// => string | null
```

:::

## Properties

### `.required()`

<p style={{ marginTop: '-15px' }}><i><code>string | undefined</code></i></p>

Tags schema values as **required** (within [`items`](../13-item/index.md) or [`maps`](../14-map/index.md)). Possible values are:

- <code>'atLeastOnce' <i>(default)</i></code>: Required (starting value)
- `'always'`: Always required (including updates)
- `'never'`: Optional

```ts
// Equivalent
const nullSchema = nul()
const nullSchema = nul().required()
const nullSchema = nul({ required: 'atLeastOnce' })

// shorthand for `.required('never')`
const nullSchema = nul().optional()
const nullSchema = nul({ required: 'never' })
```

### `.hidden()`

<p style={{ marginTop: '-15px' }}><i><code>boolean | undefined</code></i></p>

Omits schema values during [formatting](../17-actions/2-format.md):

```ts
const nullSchema = nul().hidden()
const nullSchema = nul({ hidden: true })
```

### `.key()`

<p style={{ marginTop: '-15px' }}><i><code>boolean | undefined</code></i></p>

Tags schema values as a primary key attribute or linked to a primary key attribute:

```ts
// Note: The method also sets the `required` property to 'always'
// (it is often the case in practice, you can still use `.optional()` if needed)
const nullSchema = nul().key()
const nullSchema = nul({
  key: true,
  required: 'always'
})
```

### `.savedAs(...)`

<p style={{ marginTop: '-15px' }}><i><code>string</code></i></p>

Renames schema values during the [transformation step](../17-actions/1-parse.md) (within [`items`](../13-item/index.md) or [`maps`](../14-map/index.md)):

```ts
const nullSchema = nul().savedAs('_n')
const nullSchema = nul({ savedAs: '_n' })
```

### `.default(...)`

<p style={{ marginTop: '-15px' }}><i><code>ValueOrGetter&lt;null&gt;</code></i></p>

Specifies default values. See [Defaults and Links](../2-defaults-and-links/index.md) for more details:

:::note[Examples]

<Tabs>
<TabItem value="put" label="Put">

```ts
const nullSchema = nul().default(null)
// 👇 Similar to
const nullSchema = nul().putDefault(null)
// 👇 ...or
const nullSchema = nul({ putDefault: null })
```

</TabItem>
<TabItem value="key" label="Key">

```ts
const nullSchema = nul().key().default(null)
// 👇 Similar to
const nullSchema = nul().key().keyDefault(null)
// 👇 ...or
const nullSchema = nul({
  key: true,
  required: 'always',
  keyDefault: null
})
```

</TabItem>
<TabItem value="update" label="Update">

```ts
const isUpdatedSchema = nul().updateDefault(null)
// 👇 Similar to
const isUpdatedSchema = nul({ updateDefault: null })
```

</TabItem>
</Tabs>

:::

### `.link<Schema>(...)`

<p style={{ marginTop: '-15px' }}><i><code>Link&lt;SCHEMA, null&gt;</code></i></p>

Similar to [`.default(...)`](#default) but allows deriving the default value from other attributes. See [Defaults and Links](../2-defaults-and-links/index.md) for more details:

```ts
const pokemonSchema = item({
  boolean: boolean()
}).and(prevSchema => ({
  nullIfTrue: nul()
    .optional()
    .link<typeof prevSchema>(
      // 🙌 Correctly typed!
      ({ boolean }) => (boolean ? null : undefined)
    )
}))
```

### `.validate(...)`

<p style={{ marginTop: '-15px' }}><i><code>Validator&lt;null&gt;</code></i></p>

Adds custom validation. See [Custom Validation](../3-custom-validation/index.md) for more details.
