---
title: list
sidebar_custom_props:
  code: true
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# List

Defines a [**list attribute**](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.NamingRulesDataTypes.html#HowItWorks.DataTypes), containing elements of any type:

```ts
import { list } from 'dynamodb-toolbox/attributes/list';
import { string } from 'dynamodb-toolbox/attributes/string';

const pokeTypeSchema = string().enum('fire', ...)

const pokemonSchema = schema({
  ...
  pokeTypes: list(pokeTypeSchema),
});

type FormattedPokemon = FormattedItem<typeof PokemonEntity>;
// => {
//   ...
//   pokeTypes: ('fire' | ...)[]
// }
```

List elements must respect some constraints:

- They cannot be `optional` or always required
- They cannot be `hidden` or `key` (tagging the `list` itself as `key` is enough)
- They cannot have `default` or `links`

```ts
// ❌ Raises a type AND a run-time error
const strList = list(string().optional())
const strList = list(string().hidden())
const strList = list(string().key())
const strList = list(string().default('foo'))
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
const pokeTypesSchema = list(pokeTypeSchema)
const pokeTypesSchema = list(pokeTypeSchema).required()
const pokeTypesSchema = list(
  pokeTypeSchema,
  // Options can be provided as 2nd argument
  { required: 'atLeastOnce' }
)

// shorthand for `.required('never')`
const pokeTypesSchema = list(pokeTypeSchema).optional()
const pokeTypesSchema = list(..., { required: 'never' })
```

### `.hidden()`

<p style={{ marginTop: '-15px' }}><i><code>boolean | undefined</code></i></p>

Skips the attribute when formatting items:

```ts
const pokeTypesSchema = list(pokeTypeSchema).hidden()
const pokeTypesSchema = list(..., { hidden: true })
```

### `.key()`

<p style={{ marginTop: '-15px' }}><i><code>boolean | undefined</code></i></p>

Tags the attribute as needed to compute the primary key:

```ts
// Note: The method also sets the `required` property to 'always'
// (it is often the case in practice, you can still use `.optional()` if needed)
const pokeTypesSchema = list(pokeTypeSchema).key()
const pokeTypesSchema = list(..., {
  key: true,
  required: 'always'
})
```

### `.savedAs(...)`

<p style={{ marginTop: '-15px' }}><i><code>string</code></i></p>

Renames the attribute during the [transformation step](../16-actions/1-parse.md) (at root level or within [Maps](../13-map/index.md)):

```ts
const pokeTypesSchema = list(pokeTypeSchema).savedAs('pt')
const pokeTypesSchema = list(..., { savedAs: 'pt' })
```

### `.default(...)`

<p style={{ marginTop: '-15px' }}><i><code>ValueOrGetter&lt;ELEMENTS[]&gt;</code></i></p>

Specifies default values for the attribute. See [Defaults and Links](../3-defaults-and-links/index.md) for more details:

:::noteExamples

<Tabs>
<TabItem value="put-update" label="Put/Update">

```ts
const now = () => new Date().toISOString()

const timestampsSchema = list(string())
  .default(() => [now()])
  .updateDefault(() => $append(now()))
// 👇 Similar to
const timestampsSchema = list(...)
  .putDefault(() => [now()])
  .updateDefault(() => $append(now()))
// 👇 ...or
const timestampsSchema = list(..., {
  defaults: {
    key: undefined,
    put: () => [now()],
    update: () => $append(now())
  }
})
```

</TabItem>
<TabItem value="key" label="Key">

```ts
const defaultSpecifiers = ['POKEMON']

const specifiersSchema = list(string())
  .key()
  .default(defaultSpecifiers)
// 👇 Similar to
const specifiersSchema = list(...)
  .key()
  .keyDefault(defaultSpecifiers)
// 👇 ...or
const specifiersSchema = list(..., {
  defaults: {
    key: defaultSpecifiers,
    // put & update defaults are not useful in `key` attributes
    put: undefined,
    update: undefined
  },
  key: true,
  required: 'always'
})
```

</TabItem>
</Tabs>

:::

:::info

☝️ On key attributes, `.default(...)` should be applied **after** `.key()`.

:::

### `.link<Schema>(...)`

<p style={{ marginTop: '-15px' }}><i><code>Link&lt;SCHEMA, ELEMENTS[]&gt;</code></i></p>

Similar to [`.default(...)`](#default) but allows deriving the default value from other attributes. See [Defaults and Links](../3-defaults-and-links/index.md) for more details:

```ts
const pokemonSchema = schema({
  pokeTypeSet: set(pokeTypeSchema)
}).and(prevSchema => ({
  pokeTypeList: set(pokeTypeSchema).link<typeof prevSchema>(
    // 🙌 Correctly typed!
    ({ pokeTypeSet }) => [...pokeTypeSet.values()]
  )
}))
```

:::info

☝️ On key attributes, `.link(...)` should be applied **after** `.key()`.

:::

### `.validate(...)`

<p style={{ marginTop: '-15px' }}><i><code>Validator&lt;ELEMENTS[]&gt;</code></i></p>

Adds custom validation to the attribute. See [Custom Validation](../4-custom-validation/index.md) for more details:

:::noteExamples

```ts
const nonEmptyListSchema = list(string()).validate(
  input => input.length > 0
)
// 👇 Similar to
const nonEmptyListSchema = list(string()).putValidate(
  input => input.length > 0
)
// 👇 ...or
const nonEmptyListSchema = list(string(), {
  validators: {
    key: undefined,
    put: input => input.length > 0,
    update: undefined
  }
})
```

:::
