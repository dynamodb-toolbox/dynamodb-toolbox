---
title: string
sidebar_custom_props:
  code: true
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# String

Defines a [**string attribute**](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.NamingRulesDataTypes.html#HowItWorks.DataTypes):

```ts
import { string } from 'dynamodb-toolbox/attributes/string';

const pokemonSchema = schema({
  ...
  name: string(),
});

type FormattedPokemon = FormattedItem<typeof PokemonEntity>;
// => {
//   ...
//   name: string
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
const nameSchema = string()
const nameSchema = string().required()
const nameSchema = string({ required: 'atLeastOnce' })

// shorthand for `.required('never')`
const nameSchema = string().optional()
const nameSchema = string({ required: 'never' })
```

### `.hidden()`

<p style={{ marginTop: '-15px' }}><i><code>boolean | undefined</code></i></p>

Skips the attribute when formatting items:

```ts
const nameSchema = string().hidden()
const nameSchema = string({ hidden: true })
```

### `.key()`

<p style={{ marginTop: '-15px' }}><i><code>boolean | undefined</code></i></p>

Tags the attribute as a primary key attribute or linked to a primary attribute:

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

Renames the attribute during the [transformation step](../16-actions/1-parse.md) (at root level or within [Maps](../13-map/index.md)):

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

For type inference reasons, the `enum` option is only available as a method and not as a constructor property.

:::

### `.transform(...)`

<p style={{ marginTop: '-15px' }}><i><code>Transformer&lt;string&gt;</code></i></p>

Allows modifying the attribute values during the [transformation step](../16-actions/1-parse.md):

```ts
const PREFIX = 'PREFIX#'

const prefix = {
  parse: (input: string) => [PREFIX, input].join(''),
  format: (saved: string) => saved.slice(PREFIX.length)
}

// Prefixes the value
const prefixedStrSchema = string().transform(prefix)
const prefixedStrSchema = string({ transform: prefix })
```

DynamoDB-Toolbox exposes [on-the-shelf transformers](../17-transformers/1-usage.md) (including [`prefix`](../17-transformers/2-prefix.md)), so feel free to use them!

### `.default(...)`

<p style={{ marginTop: '-15px' }}><i><code>ValueOrGetter&lt;string&gt;</code></i></p>

Specifies default values for the attribute. See [Defaults and Links](../2-defaults-and-links/index.md) for more details:

:::note[Examples]

<Tabs>
<TabItem value="put" label="Put">

```ts
const nameSchema = string().default('Pikachu')
// 👇 Similar to
const nameSchema = string().putDefault('Pikachu')
// 👇 ...or
const nameSchema = string({
  defaults: {
    key: undefined,
    put: 'Pikachu',
    update: undefined
  }
})

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
  defaults: {
    key: 'Pikachu',
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
// 👇 Records the date at each update
const lastUpdatedSchema = string().updateDefault(() =>
  new Date().toISOString()
)
// 👇 Similar to
const lastUpdatedSchema = string({
  defaults: {
    key: undefined,
    put: undefined,
    update: () => new Date().toISOString()
  }
})
```

</TabItem>
</Tabs>

:::

### `.link<Schema>(...)`

<p style={{ marginTop: '-15px' }}><i><code>Link&lt;SCHEMA, string&gt;</code></i></p>

Similar to [`.default(...)`](#default) but allows deriving the default value from other attributes. See [Defaults and Links](../2-defaults-and-links/index.md) for more details:

```ts
const pokemonSchema = schema({
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

Adds custom validation to the attribute. See [Custom Validation](../3-custom-validation/index.md) for more details:

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
  validators: {
    key: undefined,
    put: input => input.length > 3,
    update: undefined
  }
})
```

:::
