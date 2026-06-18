---
title: string
sidebar_custom_props:
  code: true
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# String

Describes [**string values**](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.NamingRulesDataTypes.html#HowItWorks.DataTypes):

```ts
import { string } from 'dynamodb-toolbox/schema/string'

const nameSchema = string()

type Name = FormattedValue<typeof nameSchema>
// => string
```

## Properties

### `.required()`

<p style={{ marginTop: '-15px' }}><i><code>string | undefined</code></i></p>

Tags schema values as **required** (within [`items`](../14-item/index.md) or [`maps`](../15-map/index.md)). Possible values are:

- <code>'atLeastOnce' <i>(default)</i></code>: Required (starting value)
- `'always'`: Always required (including updates)
- `'never'`: Optional

```ts
// Equivalent
const nameSchema = string()
const nameSchema = string().required()
const nameSchema = string({ required: 'atLeastOnce' })

// shorthand for `.required('never')`
const nameSchema = string().optional()
const nameSchema = string({ required: 'never' })
```

### `.hidden()`

<p style={{ marginTop: '-15px' }}><i><code>boolean | undefined</code></i></p>

Omits schema values during [formatting](../18-actions/2-format.md):

```ts
const nameSchema = string().hidden()
const nameSchema = string({ hidden: true })
```

### `.key()`

<p style={{ marginTop: '-15px' }}><i><code>boolean | undefined</code></i></p>

Tags schema values as a primary key attribute or linked to a primary key attribute:

```ts
// Note: The method also sets the `required` property to 'always'
// (it is often the case in practice, you can still use `.optional()` if needed)
const nameSchema = string().key()
const nameSchema = string({
  key: true,
  required: 'always'
})
```

### `.savedAs(...)`

<p style={{ marginTop: '-15px' }}><i><code>string</code></i></p>

Renames schema values during the [transformation step](../18-actions/1-parse.md) (within [`items`](../14-item/index.md) or [`maps`](../15-map/index.md)):

```ts
const nameSchema = string().savedAs('n')
const nameSchema = string({ savedAs: 'n' })
```

### `.enum(...)`

<p style={{ marginTop: '-15px' }}><i><code>string[]</code></i></p>

Provides a finite range of possible values:

```ts
const pokeTypeSchema = string().enum('fire', 'water', ...)

// 👇 Equivalent to `.enum('fire').default('fire')`
const pokeTypeSchema = string().const('fire')
```

:::info

For type inference reasons, the `enum` option is only available as a method and not as input props.

:::

### `.transform(...)`

<p style={{ marginTop: '-15px' }}><i><code>Transformer&lt;string&gt;</code></i></p>

Allows modifying schema values during the [transformation step](../18-actions/1-parse.md):

```ts
const PREFIX = 'PREFIX#'

const prefix = {
  encode: (input: string) => [PREFIX, input].join(''),
  decode: (saved: string) => saved.slice(PREFIX.length)
}

// Prefixes the value
const prefixedStrSchema = string().transform(prefix)
const prefixedStrSchema = string({ transform: prefix })
```

DynamoDB-Toolbox exposes [on-the-shelf transformers](../19-transformers/1-usage.md) (including [`prefix`](../19-transformers/2-prefix.md)), so feel free to use them!

### `.default(...)`

<p style={{ marginTop: '-15px' }}><i><code>ValueOrGetter&lt;string&gt;</code></i></p>

Specifies default values. See [Defaults and Links](../2-defaults-and-links/index.md) for more details:

:::note[Examples]

<Tabs>
<TabItem value="put" label="Put">

```ts
const nameSchema = string().default('Pikachu')
// 👇 Similar to
const nameSchema = string().putDefault('Pikachu')
// 👇 ...or
const nameSchema = string({ putDefault: 'Pikachu' })

// 🙌 Getters also work!
const nameSchema = string().default(() => 'Pikachu')
```

</TabItem>
<TabItem value="key" label="Key">

```ts
const nameSchema = string().key().default('Pikachu')
// 👇 Similar to
const nameSchema = string().key().keyDefault('Pikachu')
// 👇 ...or
const nameSchema = string({
  key: true,
  required: 'always',
  keyDefault: 'Pikachu'
})
```

</TabItem>
<TabItem value="update" label="Update">

```ts
// 👇 Records the date at each update
const lastUpdatedSchema = string().updateDefault(() =>
  new Date().toISOString()
)
// 👇 Similar to
const lastUpdatedSchema = string({
  updateDefault: () => new Date().toISOString()
})
```

</TabItem>
</Tabs>

:::

### `.link<Schema>(...)`

<p style={{ marginTop: '-15px' }}><i><code>Link&lt;SCHEMA, string&gt;</code></i></p>

Similar to [`.default(...)`](#default) but allows deriving the default value from other attributes. See [Defaults and Links](../2-defaults-and-links/index.md) for more details:

```ts
const pokemonSchema = item({
  level: string()
}).and(prevSchema => ({
  captureLevel: string().link<typeof prevSchema>(
    // 🙌 Correctly typed!
    item => item.level
  )
}))
```

### `.validate(...)`

<p style={{ marginTop: '-15px' }}><i><code>Validator&lt;string&gt;</code></i></p>

Adds custom validation. See [Custom Validation](../3-custom-validation/index.md) for more details:

:::note[Examples]

```ts
const longStrSchema = string().validate(
  input => input.length > 3
)
// 👇 Similar to
const longStrSchema = string().putValidate(
  input => input.length > 3
)
// 👇 ...or
const longStrSchema = string({
  putValidator: input => input.length > 3
})
```

:::
