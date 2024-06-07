---
title: boolean
sidebar_custom_props:
  code: true
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Boolean

Defines a [**boolean attribute**](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.NamingRulesDataTypes.html#HowItWorks.DataTypes):

```ts
import { boolean } from 'dynamodb-toolbox/attribute/boolean';

const pokemonSchema = schema({
  ...
  isLegendary: boolean(),
});

type FormattedPokemon = FormattedItem<typeof PokemonEntity>;
// => {
//   ...
//   isLegendary: boolean
// }
```

## Options

### `.required()`

<p style={{ marginTop: '-15px' }}><i><code>string</code></i></p>

Tags the attribute as **required** (at root level or within [Maps](./8-maps.md)). Possible values are:

- <code>"atLeastOnce" <i>(default)</i></code>: Required
- `"always"`: Always required (including updates)
- `"never"`: Optional

```ts
// Equivalent
const isLegendarySchema = boolean().required()
const isLegendarySchema = boolean({
  required: 'atLeastOnce'
})

// shorthand for `.required("never")`
const isLegendarySchema = boolean().optional()
const isLegendarySchema = boolean({ required: 'never' })
```

### `.hidden()`

<p style={{ marginTop: '-15px' }}><i><code>boolean</code></i></p>

Skips the attribute when formatting items:

```ts
const isLegendarySchema = boolean().hidden()
const isLegendarySchema = boolean({ hidden: true })
```

### `.key()`

<p style={{ marginTop: '-15px' }}><i><code>boolean</code></i></p>

Tags the attribute as needed to compute the primary key:

```ts
// Note: The method also sets the `required` property to "always"
// (it is often the case in practice, you can still use `.optional()` if needed)
const isLegendarySchema = boolean().key()
const isLegendarySchema = boolean({
  key: true,
  required: 'always'
})
```

### `.savedAs(...)`

<p style={{ marginTop: '-15px' }}><i><code>string</code></i></p>

Renames the attribute during the [transformation step](../4-schemas/14-actions/1-parse.md) (at root level or within [Maps](./8-maps.md)):

```ts
const isLegendarySchema = boolean().savedAs('isLeg')
const isLegendarySchema = boolean({ savedAs: 'isLeg' })
```

### `.default(...)`

<p style={{ marginTop: '-15px' }}><i><code>ValueOrGetter&lt;boolean&gt;</code></i></p>

Specifies default values for the attribute. There are three kinds of defaults:

- `putDefault`: Applied on put actions (e.g. [`PutItemCommand`](../3-entities/3-actions/2-put-item/index.md))
- `updateDefault`: Applied on update actions (e.g. [`UpdateItemCommand`](../3-entities/3-actions/3-update-item/index.md))
- `keyDefault`: Overrides other defaults on [key](#key) attributes (ignored otherwise)

The `default` method is a shorthand that acts as `keyDefault` on key attributes and `putDefault` otherwise:

:::noteExamples

<Tabs>
<TabItem value="put" label="Put">

```ts
const isLegendarySchema = boolean().default(false)
// 👇 Similar to
const isLegendarySchema = boolean().putDefault(false)
// 👇 ...or
const isLegendarySchema = boolean({
  defaults: {
    key: undefined,
    put: false,
    update: undefined
  }
})

// 🙌 Getters also work!
const isLegendarySchema = boolean().default(() => false)
```

</TabItem>
<TabItem value="key" label="Key">

```ts
const isLegendarySchema = boolean().key().default(false)
// 👇 Similar to
const isLegendarySchema = boolean().key().keyDefault(false)
// 👇 ...or
const isLegendarySchema = boolean({
  defaults: {
    key: false,
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
const isUpdatedSchema = boolean().updateDefault(true)
// 👇 Similar to
const isUpdatedSchema = boolean({
  defaults: {
    key: undefined,
    put: undefined,
    update: true
  }
})
```

</TabItem>
</Tabs>

:::

### `.link<Schema>(...)`

<p style={{ marginTop: '-15px' }}><i><code>Link&lt;SCHEMA, boolean&gt;</code></i></p>

Similar to [`.default(...)`](#default) but allows deriving the default value from other attributes. See [Defaults and Links](../4-schemas/3-defaults-and-links/index.md) for more details:

```ts
const pokemonSchema = schema({
  customName: string().optional()
}).and(prevSchema => ({
  hasCustomName: boolean().link<typeof prevSchema>(
    // 🙌 Correctly typed!
    ({ customName }) => customName !== undefined
  )
}))
```

### `.enum(...)`

<p style={{ marginTop: '-15px' }}><i><code>boolean[]</code></i></p>

`boolean` is a primitive, and as such inherits from the `.enum` option and `.const` shorthand (although it is not very useful 😅):

```ts
const isLegendarySchema = boolean().enum(true, false)

// 👇 Equivalent to `.enum(false).default(false)`
const isLegendarySchema = boolean().const(false)
```

:::info

For type inference reasons, the `enum` option is only available as a method and not as a constructor property.

:::

### `.transform(...)`

<p style={{ marginTop: '-15px' }}><i><code>Transformer&lt;boolean&gt;</code></i></p>

Allows modifying the attribute values during the [transformation step](../4-schemas/14-actions/1-parse.md):

```ts
const negate = {
  parse: (input: boolean) => !input,
  format: (saved: boolean) => !saved
}

// Saves the negated value
const isLegendarySchema = boolean().transform(negate)
const isLegendarySchema = boolean({ transform: negate })
```
