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
//   hash: Buffer
// }
```

## Options

### `.required()`

<p style={{ marginTop: '-15px' }}><i><code>string | undefined</code></i></p>

Tags the attribute as **required** (at root level or within [Maps](../11-map/index.md)). Possible values are:

- <code>"atLeastOnce" <i>(default)</i></code>: Required
- `"always"`: Always required (including updates)
- `"never"`: Optional

```ts
// Equivalent
const hashSchema = binary().required()
const hashSchema = binary({
  required: 'atLeastOnce'
})

// shorthand for `.required("never")`
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
// Note: The method also sets the `required` property to "always"
// (it is often the case in practice, you can still use `.optional()` if needed)
const hashSchema = binary().key()
const hashSchema = binary({
  key: true,
  required: 'always'
})
```

### `.savedAs(...)`

<p style={{ marginTop: '-15px' }}><i><code>string</code></i></p>

Renames the attribute during the [transformation step](../14-actions/1-parse.md) (at root level or within [Maps](../11-map/index.md)):

```ts
const hashSchema = binary().savedAs('h')
const hashSchema = binary({ savedAs: 'h' })
```

### `.default(...)`

<p style={{ marginTop: '-15px' }}><i><code>ValueOrGetter&lt;Buffer&gt;</code></i></p>

Specifies default values for the attribute. There are three kinds of defaults:

- `putDefault`: Applied on put actions (e.g. [`PutItemCommand`](../../3-entities/3-actions/2-put-item/index.md))
- `updateDefault`: Applied on update actions (e.g. [`UpdateItemCommand`](../../3-entities/3-actions/3-update-item/index.md))
- `keyDefault`: Overrides other defaults on [key](#key) attributes (ignored otherwise)

The `default` method is a shorthand that acts as `keyDefault` on key attributes and `putDefault` otherwise:

:::noteExamples

<Tabs>
<TabItem value="put" label="Put">

```ts
const bin = Buffer.from('123...')

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
const bin = Buffer.from('123...')

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
const bin = Buffer.from('123...')

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

<p style={{ marginTop: '-15px' }}><i><code>Link&lt;SCHEMA, Buffer&gt;</code></i></p>

Similar to [`.default(...)`](#default) but allows deriving the default value from other attributes. See [Defaults and Links](../3-defaults-and-links/index.md) for more details:

```ts
const pokemonSchema = schema({
  name: string()
}).and(prevSchema => ({
  nameHash: binary().link<typeof prevSchema>(
    // 🙌 Correctly typed!
    item => Buffer.from(item.name)
  )
}))
```

### `.enum(...)`

<p style={{ marginTop: '-15px' }}><i><code>Buffer[]</code></i></p>

Provides a finite range of possible values:

```ts
const binA = Buffer.from('123...')
const binB = Buffer.from('abc...')

const hashSchema = binary().enum(binA, binB, ...)

// 👇 Equivalent to `.enum(binA).default(binA)`
const hashSchema = binary().const(binA)
```

:::info

For type inference reasons, the `enum` option is only available as a method and not as a constructor property.

:::

### `.transform(...)`

<p style={{ marginTop: '-15px' }}><i><code>Transformer&lt;Buffer&gt;</code></i></p>

Allows modifying the attribute values during the [transformation step](../14-actions/1-parse.md):

```ts
var PREFIX = new Buffer(4)

const prefix = {
  parse: (input: Buffer) => Buffer.concat([PREFIX, input]),
  format: (saved: Buffer) => saved.slice(4)
}

// Prefixes the value
const hashSchema = binary().transform(prefix)
const hashSchema = binary({ transform: prefix })
```

DynamoDB-Toolbox exposes [on-the-shelf transformers](../15-transformers/1-usage.md), so feel free to use them!
