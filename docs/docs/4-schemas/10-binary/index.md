---
title: binary
sidebar_custom_props:
  code: true
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Binary

Describes [**binary values**](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.NamingRulesDataTypes.html#HowItWorks.DataTypes):

```ts
import { binary } from 'dynamodb-toolbox/schema/binary'

const hashSchema = binary()

type Hash = FormattedValue<typeof hashSchema>
// => Uint8Array
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
const hashSchema = binary()
const hashSchema = binary().required()
const hashSchema = binary({ required: 'atLeastOnce' })

// shorthand for `.required('never')`
const hashSchema = binary().optional()
const hashSchema = binary({ required: 'never' })
```

### `.hidden()`

<p style={{ marginTop: '-15px' }}><i><code>boolean | undefined</code></i></p>

Omits schema values during [formatting](../17-actions/2-format.md):

```ts
const hashSchema = binary().hidden()
const hashSchema = binary({ hidden: true })
```

### `.key()`

<p style={{ marginTop: '-15px' }}><i><code>boolean | undefined</code></i></p>

Tags schema values as a primary key attribute or linked to a primary key attribute:

```ts
// Note: The method also sets the `required` property to 'always'
// (it is often the case in practice, you can still use `.optional()` if needed)
const hashSchema = binary().key()
const hashSchema = binary({
  key: true,
  required: 'always'
})
```

:::info

`key()` is not restricted to the primary key attributes but also to the attributes they are be linked to.

:::

### `.savedAs(...)`

<p style={{ marginTop: '-15px' }}><i><code>string</code></i></p>

Renames schema values during the [transformation step](../17-actions/1-parse.md) (within [`items`](../13-item/index.md) or [`maps`](../14-map/index.md)):

```ts
const hashSchema = binary().savedAs('h')
const hashSchema = binary({ savedAs: 'h' })
```

### `.enum(...)`

<p style={{ marginTop: '-15px' }}><i><code>Uint8Array[]</code></i></p>

Provides a finite range of possible values:

```ts
const binA = new Uint8Array([1, 2, 3])
const binB = new Uint8Array([4, 5, 6])

const hashSchema = binary().enum(binA, binB, ...)

// 👇 Equivalent to `.enum(binA).default(binA)`
const hashSchema = binary().const(binA)
```

:::info

For type inference reasons, the `enum` option is only available as a method and not as input props.

:::

### `.transform(...)`

<p style={{ marginTop: '-15px' }}><i><code>Transformer&lt;Uint8Array&gt;</code></i></p>

Allows modifying schema values during the [transformation step](../17-actions/1-parse.md):

```ts
const PREFIX = new Uint8Array([1, 2, 3])

const prefix = {
  parse: (input: Uint8Array) => {
    const concat = new Uint8Array(
      PREFIX.length + input.length
    )
    concat.set(PREFIX)
    concat.set(input, PREFIX.length)

    return concat
  },
  format: (saved: Uint8Array) => saved.slice(PREFIX.length)
}

// Prefixes the value
const hashSchema = binary().transform(prefix)
const hashSchema = binary({ transform: prefix })
```

DynamoDB-Toolbox exposes [on-the-shelf transformers](../18-transformers/1-usage.md), so feel free to use them!

### `.default(...)`

<p style={{ marginTop: '-15px' }}><i><code>ValueOrGetter&lt;Uint8Array&gt;</code></i></p>

Specifies default values. See [Defaults and Links](../2-defaults-and-links/index.md) for more details:

:::note[Examples]

<Tabs>
<TabItem value="put" label="Put">

```ts
const bin = new Uint8Array([1, 2, 3])

const hashSchema = binary().default(bin)
// 👇 Similar to
const hashSchema = binary().putDefault(bin)
// 👇 ...or
const hashSchema = binary({ putDefault: bin })

// 🙌 Getters also work!
const hashSchema = binary().default(() => bin)
```

</TabItem>
<TabItem value="key" label="Key">

```ts
const bin = new Uint8Array([1, 2, 3])

const hashSchema = binary().key().default(bin)
// 👇 Similar to
const hashSchema = binary().key().keyDefault(bin)
// 👇 ...or
const hashSchema = binary({
  key: true,
  required: 'always',
  keyDefault: bin
})
```

</TabItem>
<TabItem value="update" label="Update">

```ts
const bin = new Uint8Array([1, 2, 3])

const hashSchema = binary().updateDefault(bin)
// 👇 Similar to
const hashSchema = binary({ updateDefault: bin })
```

</TabItem>
</Tabs>

:::

### `.link<Schema>(...)`

<p style={{ marginTop: '-15px' }}><i><code>Link&lt;SCHEMA, Uint8Array&gt;</code></i></p>

Similar to [`.default(...)`](#default) but allows deriving the default value from other attributes. See [Defaults and Links](../2-defaults-and-links/index.md) for more details:

```ts
const encoder = new TextEncoder()

const pokemonSchema = item({
  name: string()
}).and(prevSchema => ({
  nameHash: binary().link<typeof prevSchema>(
    // 🙌 Correctly typed!
    item => encoder.encode(item.name)
  )
}))
```

### `.validate(...)`

<p style={{ marginTop: '-15px' }}><i><code>Validator&lt;Uint8Array&gt;</code></i></p>

Adds custom validation. See [Custom Validation](../3-custom-validation/index.md) for more details:

:::note[Examples]

```ts
const longBinSchema = binary().validate(
  input => input.length > 3
)
// 👇 Similar to
const longBinSchema = binary().putValidate(
  input => input.length > 3
)
// 👇 ...or
const longBinSchema = binary({
  putValidator: input => input.length > 3
})
```

:::
