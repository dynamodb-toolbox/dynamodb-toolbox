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
import { any } from 'dynamodb-toolbox/attributes/any';

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

Tags the attribute as **required** (at root level or within [Maps](../14-map/index.md)). Possible values are:

- <code>'atLeastOnce' <i>(default)</i></code>: Required (starting value)
- `'always'`: Always required (including updates)
- `'never'`: Optional

```ts
// Equivalent
const metadataSchema = any()
const metadataSchema = any().required()
const metadataSchema = any({ required: 'atLeastOnce' })

// shorthand for `.required('never')`
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
// Note: The method also sets the `required` property to 'always'
// (it is often the case in practice, you can still use `.optional()` if needed)
const metadataSchema = any().key()
const metadataSchema = any({
  key: true,
  required: 'always'
})
```

### `.savedAs(...)`

<p style={{ marginTop: '-15px' }}><i><code>string</code></i></p>

Renames the attribute during the [transformation step](../17-actions/1-parse.md) (at root level or within [Maps](../14-map/index.md)):

```ts
const metadataSchema = any().savedAs('meta')
const metadataSchema = any({ savedAs: 'meta' })
```

### `.default(...)`

<p style={{ marginTop: '-15px' }}><i><code>ValueOrGetter&lt;unknown&gt;</code></i></p>

Specifies default values for the attribute. See [Defaults and Links](../3-defaults-and-links/index.md) for more details:

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

Similar to [`.default(...)`](#default) but allows deriving the default value from other attributes. See [Defaults and Links](../3-defaults-and-links/index.md) for more details:

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

### `.validate(...)`

<p style={{ marginTop: '-15px' }}><i><code>Validator&lt;unknown&gt;</code></i></p>

Adds custom validation to the attribute. See [Custom Validation](../4-custom-validation/index.md) for more details:

:::noteExamples

```ts
const metadataSchema = any().validate(
  input => typeof input === 'object'
)
// 👇 Similar to
const metadataSchema = any().putValidate(
  input => typeof input === 'object'
)
// 👇 ...or
const metadataSchema = any({
  validators: {
    key: undefined,
    put: input => typeof input === 'object',
    update: undefined
  }
})
```

:::

### `.castAs<TYPE>()`

<p style={{ marginTop: '-15px' }}><i>(TypeScript only)</i></p>

Overrides the resolved type of the attribute:

```ts
const metadataSchema = any().castAs<{ foo: 'bar' }>()
```
