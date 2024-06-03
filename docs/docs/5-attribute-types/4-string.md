---
title: String
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# String

Defines a [**string attribute**](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.NamingRulesDataTypes.html#HowItWorks.DataTypes):

```ts
import { string } from 'dynamodb-toolbox/attribute/string';

const pokemonSchema = schema({
  ...
  name: string(),
});

type FormattedPokemon = FormattedItem<typeof pokemonEntity>;
// => {
//   ...
//   name: string
// }
```

## Options

### `.required()`

<p style={{ marginTop: '-15px' }}><i><code>string | undefined</code></i></p>

Tags attribute as **required** (at root level or within [Maps](./8-maps.md)). Possible values are:

- <code>"atLeastOnce" <i>(default)</i></code>: Required
- `"always"`: Always required (including updates)
- `"never"`: Optional

```ts
// Equivalent
const nameSchema = string().required()
const nameSchema = string({
  required: 'atLeastOnce'
})

// shorthand for `.required("never")`
const nameSchema = string().optional()
const nameSchema = string({ required: 'never' })
```

### `.hidden()`

<p style={{ marginTop: '-15px' }}><i><code>boolean | undefined</code></i></p>

Skips attribute when formatting items:

```ts
const nameSchema = string().hidden()
const nameSchema = string({ hidden: true })
```

### `.key()`

<p style={{ marginTop: '-15px' }}><i><code>boolean | undefined</code></i></p>

Tags attribute as needed to compute the primary key:

```ts
// Note: The method also modifies the `required` property to "always"
// (it is often the case in practice, you can still use `.optional()` if needed)
const nameSchema = string().key()
const nameSchema = string({
  key: true,
  required: 'always'
})
```

### `.savedAs(...)`

<p style={{ marginTop: '-15px' }}><i><code>string</code></i></p>

Renames the attribute during the [transformation step](../4-schemas/4-actions/1-parse.md) (at root level or within [Maps](./8-maps.md)):

```ts
const nameSchema = string().savedAs('n')
const nameSchema = string({ savedAs: 'n' })
```

### `.default(...)`

<p style={{ marginTop: '-15px' }}><i><code>ValueOrGetter&lt;string&gt;</code></i></p>

Specifies default values for the attribute. There are three kinds of defaults:

- `putDefault`: Applied on put actions (e.g. [`PutItemCommand`](../3-entities/3-actions/2-put-item/index.md)).
- `updateDefault`: Applied on update actions (e.g. [`UpdateItemCommand`](../3-entities/3-actions/3-update-item/index.md)).
- `keyDefault`: Overrides other defaults on [key](#key) attributes (ignored otherwise).

The `default` method is a shorthand that acts as `keyDefault` on key attributes and `putDefault` otherwise:

:::noteExamples

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

<p style={{ marginTop: '-15px' }}><i><code>ValueOrGetter&lt;string&gt;</code></i></p>

Similar to [`.default(...)`](#default) but allows deriving the default value from other attributes. See [Defaults and Links](../4-schemas/3-defaults-and-links/index.md) for more details:

```ts
const pokemonSchema = schema({
  level: string()
}).and(baseSchema => ({
  captureLevel: string().link<typeof baseSchema>(
    // 🙌 Correctly typed!
    item => item.level
  )
}))
```

### `.enum(...)`

<p style={{ marginTop: '-15px' }}><i><code>string[]</code></i></p>

Provides a finite range of possible values:

```ts
const pokemonTypeSchema = string().enum('fire', 'water', ...)

// 👇 Equivalent to `.enum('fire').default('fire')`
const pokemonTypeSchema = string().const('fire')
```

:::info

For type inference reasons, the `enum` option is only available as a method and not as a constructor property.

:::

### `.transform(...)`

<p style={{ marginTop: '-15px' }}><i><code>Transformer&lt;string&gt;</code></i></p>

Allows modifying the attribute values during the [transformation step](../4-schemas/4-actions/1-parse.md):

```ts
const PREFIX = 'POKEMON#'

const prefix = {
  parse: (input: string) => [PREFIX, input].join(''),
  format: (saved: string) => saved.slice(PREFIX.length)
}

// Prefixes the value
const nameSchema = string().transform(prefix)
const nameSchema = string({ transform: prefix })
```
