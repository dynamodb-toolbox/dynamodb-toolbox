---
title: binary
sidebar_custom_props:
  code: true
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Binary

Defines a [**binary attribute**](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.NamingRulesDataTypes.html#HowItWorks.DataTypes):

```ts
import { binary } from 'dynamodb-toolbox/attributes/binary';

const pokemonSchema = schema({
  ...
  hash: binary(),
});

type FormattedPokemon = FormattedItem<typeof PokemonEntity>;
// => {
//   ...
//   hash: Uint8Array
// }
```

## Options

### `.required()`

<p style={{ marginTop: '-15px' }}><i><code>string | undefined</code></i></p>

Tags the attribute as **required** (at root level or within [Maps](../13-map/index.md)). Possible values are:

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

Skips the attribute when formatting items:

```ts
const hashSchema = binary().hidden()
const hashSchema = binary({ hidden: true })
```

### `.key()`

<p style={{ marginTop: '-15px' }}><i><code>boolean | undefined</code></i></p>

Tags the attribute as needed to compute the primary key:

```ts
// Note: The method also sets the `required` property to 'always'
// (it is often the case in practice, you can still use `.optional()` if needed)
const hashSchema = binary().key()
const hashSchema = binary({
  key: true,
  required: 'always'
})
```

### `.savedAs(...)`

<p style={{ marginTop: '-15px' }}><i><code>string</code></i></p>

Renames the attribute during the [transformation step](../16-actions/1-parse.md) (at root level or within [Maps](../13-map/index.md)):

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

For type inference reasons, the `enum` option is only available as a method and not as a constructor property.

:::

### `.transform(...)`

<p style={{ marginTop: '-15px' }}><i><code>Transformer&lt;Uint8Array&gt;</code></i></p>

Allows modifying the attribute values during the [transformation step](../16-actions/1-parse.md):

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

DynamoDB-Toolbox exposes [on-the-shelf transformers](../17-transformers/1-usage.md), so feel free to use them!

### `.default(...)`

<p style={{ marginTop: '-15px' }}><i><code>ValueOrGetter&lt;Uint8Array&gt;</code></i></p>

Specifies default values for the attribute. See [Defaults and Links](../2-defaults-and-links/index.md) for more details:

:::noteExamples

<Tabs>
<TabItem value="put" label="Put">

```ts
const bin = new Uint8Array([1, 2, 3])

const hashSchema = binary().default(bin)
// 👇 Similar to
const hashSchema = binary().putDefault(bin)
// 👇 ...or
const hashSchema = binary({
  defaults: {
    key: undefined,
    put: bin,
    update: undefined
  }
})

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
  defaults: {
    key: bin,
    // put & update defaults are not useful in `key` attributes
    put: undefined,
    update: undefined
  },
  key: true,
  required: 'always'
})
```

</TabItem>
<TabItem value="update" label="Update">

```ts
const bin = new Uint8Array([1, 2, 3])

const hashSchema = binary().updateDefault(bin)
// 👇 Similar to
const hashSchema = binary({
  defaults: {
    key: undefined,
    put: undefined,
    update: bin
  }
})
```

</TabItem>
</Tabs>

:::

### `.link<Schema>(...)`

<p style={{ marginTop: '-15px' }}><i><code>Link&lt;SCHEMA, Uint8Array&gt;</code></i></p>

Similar to [`.default(...)`](#default) but allows deriving the default value from other attributes. See [Defaults and Links](../2-defaults-and-links/index.md) for more details:

```ts
const encoder = new TextEncoder()

const pokemonSchema = schema({
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

Adds custom validation to the attribute. See [Custom Validation](../3-custom-validation/index.md) for more details:

:::noteExamples

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
  validators: {
    key: undefined,
    put: input => input.length > 3,
    update: undefined
  }
})
```

:::
