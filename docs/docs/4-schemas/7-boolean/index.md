---
title: boolean
sidebar_custom_props:
  code: true
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Boolean

Describes [**boolean values**](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.NamingRulesDataTypes.html#HowItWorks.DataTypes):

```ts
import { boolean } from 'dynamodb-toolbox/schema/boolean'

const isLegendarySchema = boolean()

type IsLegendary = FormattedValue<typeof isLegendarySchema>
// => boolean
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

Omits schema values during [formatting](../17-actions/2-format.md):

```ts
const isLegendarySchema = boolean().hidden()
const isLegendarySchema = boolean({ hidden: true })
```

### `.key()`

<p style={{ marginTop: '-15px' }}><i><code>boolean | undefined</code></i></p>

Tags schema values as a primary key attribute or linked to a primary key attribute:

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

Renames schema values during the [transformation step](../17-actions/1-parse.md) (within [`items`](../13-item/index.md) or [`maps`](../14-map/index.md)):

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

For type inference reasons, the `enum` option is only available as a method and not as input props.

:::

:::note

Although it is not very useful, `boolean` is a primitive, and as such inherits from the `.enum` and `.const` options.

:::

### `.transform(...)`

<p style={{ marginTop: '-15px' }}><i><code>Transformer&lt;boolean&gt;</code></i></p>

Allows modifying schema values during the [transformation step](../17-actions/1-parse.md):

```ts
const negate = {
  parse: (input: boolean) => !input,
  format: (saved: boolean) => !saved
}

// Saves the negated value
const isLegendarySchema = boolean().transform(negate)
const isLegendarySchema = boolean({ transform: negate })
```

DynamoDB-Toolbox exposes [on-the-shelf transformers](../18-transformers/1-usage.md), so feel free to use them!

### `.default(...)`

<p style={{ marginTop: '-15px' }}><i><code>ValueOrGetter&lt;boolean&gt;</code></i></p>

Specifies default values. See [Defaults and Links](../2-defaults-and-links/index.md) for more details:

:::note[Examples]

<Tabs>
<TabItem value="put" label="Put">

```ts
const isLegendarySchema = boolean().default(false)
// 👇 Similar to
const isLegendarySchema = boolean().putDefault(false)
// 👇 ...or
const isLegendarySchema = boolean({ putDefault: false })

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
  key: true,
  required: 'always',
  keyDefault: false
})
```

</TabItem>
<TabItem value="update" label="Update">

```ts
const isUpdatedSchema = boolean().updateDefault(true)
// 👇 Similar to
const isUpdatedSchema = boolean({ updateDefault: true })
```

</TabItem>
</Tabs>

:::

### `.link<Schema>(...)`

<p style={{ marginTop: '-15px' }}><i><code>Link&lt;SCHEMA, boolean&gt;</code></i></p>

Similar to [`.default(...)`](#default) but allows deriving the default value from other attributes. See [Defaults and Links](../2-defaults-and-links/index.md) for more details:

```ts
const pokemonSchema = item({
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

Adds custom validation. See [Custom Validation](../3-custom-validation/index.md) for more details:

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
  required: 'never',
  putValidator: input => input !== false
})
```

:::
