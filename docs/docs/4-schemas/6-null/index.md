---
title: nul
sidebar_custom_props:
  code: true
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Null

Defines a [**null attribute**](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.NamingRulesDataTypes.html#HowItWorks.DataTypes):

```ts
// `null` is a reserved keyword 🤷‍♂️
import { nul } from 'dynamodb-toolbox/attributes/nul';

const pokemonSchema = schema({
  ...
  nullValue: nul(),
});

type FormattedPokemon = FormattedItem<typeof PokemonEntity>;
// => {
//   ...
//   nullValue: null
// }
```

:::info

Not very useful on itself, `nul` is more likely to be used in conjunction with [`anyOf`](../15-anyOf/index.md) to define **nullable** attributes:

```ts
const pokemonSchema = schema({
  ...
  nullableString: anyOf(string(), nul()),
});
```

:::

## Options

### `.required()`

<p style={{ marginTop: '-15px' }}><i><code>string | undefined</code></i></p>

Tags the attribute as **required** (at root level or within [Maps](../13-map/index.md)). Possible values are:

- <code>'atLeastOnce' <i>(default)</i></code>: Required (starting value)
- `'always'`: Always required (including updates)
- `'never'`: Optional

```ts
// Equivalent
const nullishSchema = nul()
const nullishSchema = nul().required()
const nullishSchema = nul({ required: 'atLeastOnce' })

// shorthand for `.required('never')`
const nullishSchema = nul().optional()
const nullishSchema = nul({ required: 'never' })
```

### `.hidden()`

<p style={{ marginTop: '-15px' }}><i><code>boolean | undefined</code></i></p>

Skips the attribute when formatting items:

```ts
const nullishSchema = nul().hidden()
const nullishSchema = nul({ hidden: true })
```

### `.key()`

<p style={{ marginTop: '-15px' }}><i><code>boolean | undefined</code></i></p>

Tags the attribute as needed to compute the primary key:

```ts
// Note: The method also sets the `required` property to 'always'
// (it is often the case in practice, you can still use `.optional()` if needed)
const nullishSchema = nul().key()
const nullishSchema = nul({
  key: true,
  required: 'always'
})
```

### `.savedAs(...)`

<p style={{ marginTop: '-15px' }}><i><code>string</code></i></p>

Renames the attribute during the [transformation step](../16-actions/1-parse.md) (at root level or within [Maps](../13-map/index.md)):

```ts
const nullishSchema = nul().savedAs('_n')
const nullishSchema = nul({ savedAs: '_n' })
```

### `.default(...)`

<p style={{ marginTop: '-15px' }}><i><code>ValueOrGetter&lt;null&gt;</code></i></p>

Specifies default values for the attribute. See [Defaults and Links](../2-defaults-and-links/index.md) for more details:

:::noteExamples

<Tabs>
<TabItem value="put" label="Put">

```ts
const nullishSchema = nul().default(null)
// 👇 Similar to
const nullishSchema = nul().putDefault(null)
// 👇 ...or
const nullishSchema = nul({
  defaults: {
    key: undefined,
    put: null,
    update: undefined
  }
})
```

</TabItem>
<TabItem value="key" label="Key">

```ts
const nullishSchema = nul().key().default(null)
// 👇 Similar to
const nullishSchema = nul().key().keyDefault(null)
// 👇 ...or
const nullishSchema = nul({
  defaults: {
    key: null,
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
const isUpdatedSchema = nul().updateDefault(null)
// 👇 Similar to
const isUpdatedSchema = nul({
  defaults: {
    key: undefined,
    put: undefined,
    update: null
  }
})
```

</TabItem>
</Tabs>

:::

### `.link<Schema>(...)`

<p style={{ marginTop: '-15px' }}><i><code>Link&lt;SCHEMA, null&gt;</code></i></p>

Similar to [`.default(...)`](#default) but allows deriving the default value from other attributes. See [Defaults and Links](../2-defaults-and-links/index.md) for more details:

```ts
const pokemonSchema = schema({
  boolean: boolean()
}).and(prevSchema => ({
  nullIfTrue: nul()
    .optional()
    .link<typeof prevSchema>(
      // 🙌 Correctly typed!
      ({ boolean }) => (boolean ? null : undefined)
    )
}))
```

### `.validate(...)`

<p style={{ marginTop: '-15px' }}><i><code>Validator&lt;null&gt;</code></i></p>

Adds custom validation to the attribute. See [Custom Validation](../3-custom-validation/index.md) for more details.
