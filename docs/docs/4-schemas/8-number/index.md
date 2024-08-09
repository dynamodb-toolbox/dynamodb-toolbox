---
title: number
sidebar_custom_props:
  code: true
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Number

Defines a [**number attribute**](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.NamingRulesDataTypes.html#HowItWorks.DataTypes):

```ts
import { number } from 'dynamodb-toolbox/attributes/number';

const pokemonSchema = schema({
  ...
  level: number(),
});

type FormattedPokemon = FormattedItem<typeof PokemonEntity>;
// => {
//   ...
//   level: number
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
const levelSchema = number()
const levelSchema = number().required()
const levelSchema = number({ required: 'atLeastOnce' })

// shorthand for `.required('never')`
const levelSchema = number().optional()
const levelSchema = number({ required: 'never' })
```

### `.hidden()`

<p style={{ marginTop: '-15px' }}><i><code>boolean | undefined</code></i></p>

Skips the attribute when formatting items:

```ts
const levelSchema = number().hidden()
const levelSchema = number({ hidden: true })
```

### `.key()`

<p style={{ marginTop: '-15px' }}><i><code>boolean | undefined</code></i></p>

Tags the attribute as needed to compute the primary key:

```ts
// Note: The method also sets the `required` property to 'always'
// (it is often the case in practice, you can still use `.optional()` if needed)
const levelSchema = number().key()
const levelSchema = number({
  key: true,
  required: 'always'
})
```

### `.savedAs(...)`

<p style={{ marginTop: '-15px' }}><i><code>string</code></i></p>

Renames the attribute during the [transformation step](../16-actions/1-parse.md) (at root level or within [Maps](../13-map/index.md)):

```ts
const levelSchema = number().savedAs('lvl')
const levelSchema = number({ savedAs: 'lvl' })
```

### `.enum(...)`

<p style={{ marginTop: '-15px' }}><i><code>number[]</code></i></p>

Provides a finite range of possible values:

```ts
const pokemonGenerationSchema = number().enum(1, 2, 3)

// 👇 Equivalent to `.enum(1).default(1)`
const pokemonGenerationSchema = number().const(1)
```

:::info

For type inference reasons, the `enum` option is only available as a method and not as a constructor property.

:::

### `.transform(...)`

<p style={{ marginTop: '-15px' }}><i><code>Transformer&lt;number&gt;</code></i></p>

Allows modifying the attribute values during the [transformation step](../16-actions/1-parse.md):

```ts
const addOne = {
  parse: (input: number) => input + 1,
  format: (saved: number) => saved - 1
}

// Saves the value plus one
const levelSchema = number().transform(addOne)
const levelSchema = number({ transform: addOne })
```

DynamoDB-Toolbox exposes [on-the-shelf transformers](../17-transformers/1-usage.md), so feel free to use them!

### `.default(...)`

<p style={{ marginTop: '-15px' }}><i><code>ValueOrGetter&lt;number&gt;</code></i></p>

Specifies default values for the attribute. See [Defaults and Links](../3-defaults-and-links/index.md) for more details:

:::noteExamples

<Tabs>
<TabItem value="put" label="Put">

```ts
const levelSchema = number().default(42)
// 👇 Similar to
const levelSchema = number().putDefault(42)
// 👇 ...or
const levelSchema = number({
  defaults: {
    key: undefined,
    put: 42,
    update: undefined
  }
})

// 🙌 Getters also work!
const levelSchema = number().default(() => 42)
```

</TabItem>
<TabItem value="key" label="Key">

```ts
const levelSchema = number().key().default(42)
// 👇 Similar to
const levelSchema = number().key().keyDefault(42)
// 👇 ...or
const levelSchema = number({
  defaults: {
    key: 42,
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
const updateCountSchema = number()
  // adds 1 to the attribute at each update
  .updateDefault(() => $add(1))

// 👇 Similar to
const updateCountSchema = number({
  defaults: {
    key: undefined,
    put: undefined,
    update: () => $add(1)
  }
})
```

</TabItem>
</Tabs>

:::

### `.link<Schema>(...)`

<p style={{ marginTop: '-15px' }}><i><code>Link&lt;SCHEMA, number&gt;</code></i></p>

Similar to [`.default(...)`](#default) but allows deriving the default value from other attributes. See [Defaults and Links](../3-defaults-and-links/index.md) for more details:

```ts
const pokemonSchema = schema({
  level: number()
}).and(prevSchema => ({
  captureLevel: number().link<typeof prevSchema>(
    // 🙌 Correctly typed!
    item => item.level
  )
}))
```

### `.validate(...)`

<p style={{ marginTop: '-15px' }}><i><code>Validator&lt;number&gt;</code></i></p>

Adds custom validation to the attribute. See [Custom Validation](../4-custom-validation/index.md) for more details:

:::noteExamples

```ts
const integerSchema = number().validate(input =>
  Number.isInteger(input)
)
// 👇 Similar to
const integerSchema = number().putValidate(input =>
  Number.isInteger(input)
)
// 👇 ...or
const integerSchema = number({
  validators: {
    key: undefined,
    put: input => Number.isInteger(input),
    update: undefined
  }
})
```

:::
