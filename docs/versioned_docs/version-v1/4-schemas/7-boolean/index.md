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
import { boolean } from 'dynamodb-toolbox/attributes/boolean';

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

<p style={{ marginTop: '-15px' }}><i><code>string | undefined</code></i></p>

Tags the attribute as **required** (at root level or within [Maps](../13-map/index.md)). Possible values are:

- <code>'atLeastOnce' <i>(default)</i></code>: Required (starting value)
- `'always'`: Always required (including updates)
- `'never'`: Optional

```ts
// Equivalent
const isLegendarySchema = boolean()
const isLegendarySchema = boolean().required()
const isLegendarySchema = boolean({
  required: 'atLeastOnce'
})

// shorthand for `.required('never')`
const isLegendarySchema = boolean().optional()
const isLegendarySchema = boolean({ required: 'never' })
```

### `.hidden()`

<p style={{ marginTop: '-15px' }}><i><code>boolean | undefined</code></i></p>

Skips the attribute when formatting items:

```ts
const isLegendarySchema = boolean().hidden()
const isLegendarySchema = boolean({ hidden: true })
```

### `.key()`

<p style={{ marginTop: '-15px' }}><i><code>boolean | undefined</code></i></p>

Tags the attribute as a primary key attribute or linked to a primary attribute:

```ts
// Note: The method also sets the `required` property to 'always'
// (it is often the case in practice, you can still use `.optional()` if needed)
const isLegendarySchema = boolean().key()
const isLegendarySchema = boolean({
  key: true,
  required: 'always'
})
```

### `.savedAs(...)`

<p style={{ marginTop: '-15px' }}><i><code>string</code></i></p>

Renames the attribute during the [transformation step](../16-actions/1-parse.md) (at root level or within [Maps](../13-map/index.md)):

```ts
const isLegendarySchema = boolean().savedAs('isLeg')
const isLegendarySchema = boolean({ savedAs: 'isLeg' })
```

### `.enum(...)`

<p style={{ marginTop: '-15px' }}><i><code>boolean[]</code></i></p>

Provides a finite range of possible values:

```ts
const isLegendarySchema = boolean().enum(true, false)

// 👇 Equivalent to `.enum(false).default(false)`
const isLegendarySchema = boolean().const(false)
```

:::info

For type inference reasons, the `enum` option is only available as a method and not as a constructor property.

:::

:::note

Although it is not very useful, `boolean` is a primitive, and as such inherits from the `.enum` and `.const` options.

:::

### `.transform(...)`

<p style={{ marginTop: '-15px' }}><i><code>Transformer&lt;boolean&gt;</code></i></p>

Allows modifying the attribute values during the [transformation step](../16-actions/1-parse.md):

```ts
const negate = {
  parse: (input: boolean) => !input,
  format: (saved: boolean) => !saved
}

// Saves the negated value
const isLegendarySchema = boolean().transform(negate)
const isLegendarySchema = boolean({ transform: negate })
```

DynamoDB-Toolbox exposes [on-the-shelf transformers](../17-transformers/1-usage.md), so feel free to use them!

### `.default(...)`

<p style={{ marginTop: '-15px' }}><i><code>ValueOrGetter&lt;boolean&gt;</code></i></p>

Specifies default values for the attribute. See [Defaults and Links](../2-defaults-and-links/index.md) for more details:

:::note[Examples]

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

Similar to [`.default(...)`](#default) but allows deriving the default value from other attributes. See [Defaults and Links](../2-defaults-and-links/index.md) for more details:

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

### `.validate(...)`

<p style={{ marginTop: '-15px' }}><i><code>Validator&lt;boolean&gt;</code></i></p>

Adds custom validation to the attribute. See [Custom Validation](../3-custom-validation/index.md) for more details:

:::note[Examples]

```ts
const trueOrUndefinedSchema = boolean()
  .optional()
  .validate(input => input !== false)
// 👇 Similar to
const trueOrUndefinedSchema = boolean()
  .optional()
  .putValidate(input => input !== false)
// 👇 ...or
const trueOrUndefinedSchema = boolean({
  validators: {
    key: undefined,
    put: input => input !== false,
    update: undefined
  },
  required: 'never'
})
```

:::
