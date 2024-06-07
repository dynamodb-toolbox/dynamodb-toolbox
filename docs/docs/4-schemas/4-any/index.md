---
title: any
sidebar_custom_props:
  code: true
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Any

Defines an attribute containing **any value**. No validation is applied at run-time, and its type is resolved as `unknown` by default:

```ts
import { any } from 'dynamodb-toolbox/attribute/any';

const pokemonSchema = schema({
  ...
  metadata: any(),
});

type FormattedPokemon = FormattedItem<typeof PokemonEntity>;
// => {
//   ...
//   metadata: unknown
// }
```

## Options

### `.required()`

<p style={{ marginTop: '-15px' }}><i><code>string | undefined</code></i></p>

Tags the attribute as **required** (at root level or within [Maps](./8-maps.md)). Possible values are:

- <code>"atLeastOnce" <i>(default)</i></code>: Required
- `"always"`: Always required (including updates)
- `"never"`: Optional

```ts
// Equivalent
const metadataSchema = any().required()
const metadataSchema = any({ required: 'atLeastOnce' })

// shorthand for `.required("never")`
const metadataSchema = any().optional()
const metadataSchema = any({ required: 'never' })
```

### `.hidden()`

<p style={{ marginTop: '-15px' }}><i><code>boolean | undefined</code></i></p>

Skips the attribute when formatting items:

```ts
const metadataSchema = any().hidden()
const metadataSchema = any({ hidden: true })
```

### `.key()`

<p style={{ marginTop: '-15px' }}><i><code>boolean | undefined</code></i></p>

Tags the attribute as needed to compute the primary key:

```ts
// Note: The method also sets the `required` property to "always"
// (it is often the case in practice, you can still use `.optional()` if needed)
const metadataSchema = any().key()
const metadataSchema = any({
  key: true,
  required: 'always'
})
```

### `.savedAs(...)`

<p style={{ marginTop: '-15px' }}><i><code>string</code></i></p>

Renames the attribute during the [transformation step](../4-schemas/14-actions/1-parse.md) (at root level or within [Maps](./8-maps.md)):

```ts
const metadataSchema = any().savedAs('meta')
const metadataSchema = any({ savedAs: 'meta' })
```

### `.default(...)`

<p style={{ marginTop: '-15px' }}><i><code>ValueOrGetter&lt;unknown&gt;</code></i></p>

Specifies default values for the attribute. There are three kinds of defaults:

- `putDefault`: Applied on put actions (e.g. [`PutItemCommand`](../3-entities/3-actions/2-put-item/index.md))
- `updateDefault`: Applied on update actions (e.g. [`UpdateItemCommand`](../3-entities/3-actions/3-update-item/index.md))
- `keyDefault`: Overrides other defaults on [key](#key) attributes (ignored otherwise)

The `default` method is a shorthand that acts as `keyDefault` on key attributes and `putDefault` otherwise:

:::noteExamples

<Tabs>
<TabItem value="put" label="Put">

```ts
const metadataSchema = any().default({ any: 'value' })
// 👇 Similar to
const metadataSchema = any().putDefault({ any: 'value' })
// 👇 ...or
const metadataSchema = any({
  defaults: {
    key: undefined,
    put: { any: 'value' },
    update: undefined
  }
})

// 🙌 Getters also work!
const metadataSchema = any().default(() => ({
  any: 'value'
}))
```

</TabItem>
<TabItem value="key" label="Key">

```ts
const metadataSchema = any().key().default('myKey')
// 👇 Similar to
const metadataSchema = any().key().keyDefault('myKey')
// 👇 ...or
const metadataSchema = any({
  defaults: {
    key: 'myKey',
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
const metadataSchema = any().updateDefault({
  updated: true
})
// 👇 Similar to
const metadataSchema = any({
  defaults: {
    key: undefined,
    put: undefined,
    update: { updated: true }
  }
})
```

</TabItem>
</Tabs>

:::

### `.link<Schema>(...)`

<p style={{ marginTop: '-15px' }}><i><code>Link&lt;SCHEMA, unknown&gt;</code></i></p>

Similar to [`.default(...)`](#default) but allows deriving the default value from other attributes. See [Defaults and Links](../4-schemas/3-defaults-and-links/index.md) for more details:

```ts
const pokemonSchema = schema({
  pokeTypes: string()
}).and(prevSchema => ({
  metadata: any().link<typeof prevSchema>(
    // 🙌 Correctly typed!
    item => item.pokeTypes.join('#')
  )
}))
```

### `.castAs<Type>()`

<p style={{ marginTop: '-15px' }}><i>(TypeScript only)</i></p>

Overrides the resolved type of the attribute:

```ts
const metadataSchema = any().castAs<{ foo: 'bar' }>()
```
