---
title: number
sidebar_custom_props:
  code: true
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Number

Describes [**number values**](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.NamingRulesDataTypes.html#HowItWorks.DataTypes):

```ts
import { number } from 'dynamodb-toolbox/schema/number'

const levelSchema = number()

type Level = FormattedValue<typeof levelSchema>
// => number
```

## Properties

### `.required()`

<p style={{ marginTop: '-15px' }}><i><code>string | undefined</code></i></p>

Tags schema values as **required** (within [`items`](../13-item/index.md) or [`maps`](../14-map/index.md)). Possible values are:

- <code>'atLeastOnce' <i>(default)</i></code>: Required (starting value)
- `'always'`: Always required (including updates)
- `'never'`: Optional

```ts
// Equivalent
const levelSchema = number()
const levelSchema = number().required()
const levelSchema = number({ required: 'atLeastOnce' })

// shorthand for `.required('never')`
const levelSchema = number().optional()
const levelSchema = number({ required: 'never' })
```

### `.hidden()`

<p style={{ marginTop: '-15px' }}><i><code>boolean | undefined</code></i></p>

Omits schema values during [formatting](../17-actions/2-format.md):

```ts
const levelSchema = number().hidden()
const levelSchema = number({ hidden: true })
```

### `.key()`

<p style={{ marginTop: '-15px' }}><i><code>boolean | undefined</code></i></p>

Tags schema values as a primary key attribute or linked to a primary key attribute:

```ts
// Note: The method also sets the `required` property to 'always'
// (it is often the case in practice, you can still use `.optional()` if needed)
const levelSchema = number().key()
const levelSchema = number({
  key: true,
  required: 'always'
})
```

### `.savedAs(...)`

<p style={{ marginTop: '-15px' }}><i><code>string</code></i></p>

Renames schema values during the [transformation step](../17-actions/1-parse.md) (within [`items`](../13-item/index.md) or [`maps`](../14-map/index.md)):

```ts
const levelSchema = number().savedAs('lvl')
const levelSchema = number({ savedAs: 'lvl' })
```

### `.enum(...)`

<p style={{ marginTop: '-15px' }}><i><code>number[]</code></i></p>

Provides a finite range of possible values:

```ts
const pokemonGenerationSchema = number().enum(1, 2, 3)

// 👇 Equivalent to `.enum(1).default(1)`
const pokemonGenerationSchema = number().const(1)
```

:::info

For type inference reasons, the `enum` option is only available as a method and not as input props.

:::

### `.transform(...)`

<p style={{ marginTop: '-15px' }}><i><code>Transformer&lt;number&gt;</code></i></p>

Allows modifying schema values during the [transformation step](../17-actions/1-parse.md):

```ts
const addOne = {
  encode: (input: number) => input + 1,
  decode: (saved: number) => saved - 1
}

// Saves the value plus one
const levelSchema = number().transform(addOne)
const levelSchema = number({ transform: addOne })
```

DynamoDB-Toolbox exposes [on-the-shelf transformers](../18-transformers/1-usage.md), so feel free to use them!

### `.big()`

<p style={{ marginTop: '-15px' }}><i><code>boolean | undefined</code></i></p>

Allows `BigInt` values:

```ts
const levelSchema = number().big()
const levelSchema = number({ big: true })

type Level = FormattedValue<typeof levelSchema>
// => number | bigint
```

### `.default(...)`

<p style={{ marginTop: '-15px' }}><i><code>ValueOrGetter&lt;number&gt;</code></i></p>

Specifies default values. See [Defaults and Links](../2-defaults-and-links/index.md) for more details:

:::note[Examples]

<Tabs>
<TabItem value="put" label="Put">

```ts
const levelSchema = number().default(42)
// 👇 Similar to
const levelSchema = number().putDefault(42)
// 👇 ...or
const levelSchema = number({ putDefault: 42 })

// 🙌 Getters also work!
const levelSchema = number().default(() => 42)
```

</TabItem>
<TabItem value="key" label="Key">

```ts
const levelSchema = number().key().default(42)
// 👇 Similar to
const levelSchema = number().key().keyDefault(42)
// 👇 ...or
const levelSchema = number({
  key: true,
  required: 'always',
  keyDefault: 42
})
```

</TabItem>
<TabItem value="update" label="Update">

```ts
const updateCountSchema = number()
  // adds 1 to the attribute at each update
  .updateDefault(() => $add(1))

// 👇 Similar to
const updateCountSchema = number({
  updateDefault: () => $add(1)
})
```

</TabItem>
</Tabs>

:::

### `.link<Schema>(...)`

<p style={{ marginTop: '-15px' }}><i><code>Link&lt;SCHEMA, number&gt;</code></i></p>

Similar to [`.default(...)`](#default) but allows deriving the default value from other attributes. See [Defaults and Links](../2-defaults-and-links/index.md) for more details:

```ts
const pokemonSchema = item({
  level: number()
}).and(prevSchema => ({
  captureLevel: number().link<typeof prevSchema>(
    // 🙌 Correctly typed!
    item => item.level
  )
}))
```

### `.validate(...)`

<p style={{ marginTop: '-15px' }}><i><code>Validator&lt;number&gt;</code></i></p>

Adds custom validation. See [Custom Validation](../3-custom-validation/index.md) for more details:

:::note[Examples]

```ts
const integerSchema = number().validate(input =>
  Number.isInteger(input)
)
// 👇 Similar to
const integerSchema = number().putValidate(input =>
  Number.isInteger(input)
)
// 👇 ...or
const integerSchema = number({
  putValidator: input => Number.isInteger(input)
})
```

:::
