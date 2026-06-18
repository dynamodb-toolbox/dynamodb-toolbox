---
title: list
sidebar_custom_props:
  code: true
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# List

Describes [**list values**](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.NamingRulesDataTypes.html#HowItWorks.DataTypes), containing elements of any type:

```ts
import { list } from 'dynamodb-toolbox/schema/list';
import { string } from 'dynamodb-toolbox/schema/string';

const pokeTypeSchema = string().enum('fire', ...)
const pokemonTypesSchema = list(pokeTypeSchema)

type PokemonType = FormattedValue<typeof pokemonTypesSchema>;
// => ('fire' | ...)[]
```

List elements can have any type. However, they must respect some constraints:

- They cannot be `optional` or always required
- They cannot be `hidden` or `key` (tagging the `list` itself as `key` is enough)
- They cannot be renamed (with `savedAs`)
- They cannot have `default` or `links`

```ts
// ❌ Raises a type AND a run-time error
const strList = list(string().optional())
const strList = list(string().hidden())
const strList = list(string().key())
const strList = list(string().savedAs('foo'))
const strList = list(string().default('foo'))
```

## Properties

### `.required()`

<p style={{ marginTop: '-15px' }}><i><code>string | undefined</code></i></p>

Tags schema values as **required** (within [`items`](../14-item/index.md) or [`maps`](../15-map/index.md)). Possible values are:

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

Omits schema values during [formatting](../18-actions/2-format.md):

```ts
const pokeTypesSchema = list(pokeTypeSchema).hidden()
const pokeTypesSchema = list(..., { hidden: true })
```

### `.key()`

<p style={{ marginTop: '-15px' }}><i><code>boolean | undefined</code></i></p>

Tags schema values as a primary key attribute or linked to a primary key attribute:

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

Renames schema values during the [transformation step](../18-actions/1-parse.md) (within [`items`](../14-item/index.md) or [`maps`](../15-map/index.md)):

```ts
const pokeTypesSchema = list(pokeTypeSchema).savedAs('pt')
const pokeTypesSchema = list(..., { savedAs: 'pt' })
```

### `.default(...)`

<p style={{ marginTop: '-15px' }}><i><code>ValueOrGetter&lt;ELEMENTS[]&gt;</code></i></p>

Specifies default values. See [Defaults and Links](../2-defaults-and-links/index.md) for more details:

:::note[Examples]

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
  putDefault: () => [now()],
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
  key: true,
  required: 'always',
  keyDefault: defaultSpecifiers,
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

Similar to [`.default(...)`](#default) but allows deriving the default value from other attributes. See [Defaults and Links](../2-defaults-and-links/index.md) for more details:

```ts
const pokemonSchema = item({
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

Adds custom validation. See [Custom Validation](../3-custom-validation/index.md) for more details:

:::note[Examples]

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
  putValidator: input => input.length > 0
})
```

:::
