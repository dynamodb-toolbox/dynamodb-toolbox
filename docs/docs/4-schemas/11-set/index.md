---
title: set
sidebar_custom_props:
  code: true
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Set

Describes [**set values**](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.NamingRulesDataTypes.html#HowItWorks.DataTypes). Sets can contain [`numbers`](../8-number/index.md), [`strings`](../9-string/index.md), or [`binaries`](../10-binary/index.md):

```ts
import { set } from 'dynamodb-toolbox/schema/set';
import { string } from 'dynamodb-toolbox/schema/string';

const pokeTypeSchema = string().enum('fire', ...)
const pokemonTypesSchema = set(pokeTypeSchema)

type PokemonType = FormattedValue<typeof pokemonTypesSchema>;
// => Set<'fire' | ...>
```

Set elements must respect some constraints:

- They cannot be `optional` or always required
- They cannot be `hidden` or `key` (tagging the `set` itself as `key` is enough)
- They cannot have `default` or `links`

```ts
// ❌ Raises a type AND a run-time error
const strSet = set(string().optional())
const strSet = set(string().hidden())
const strSet = set(string().key())
const strSet = set(string().default('foo'))
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
const pokeTypesSchema = set(pokeTypeSchema)
const pokeTypesSchema = set(pokeTypeSchema).required()
const pokeTypesSchema = set(
  pokeTypeSchema,
  // Options can be provided as 2nd argument
  { required: 'atLeastOnce' }
)

// shorthand for `.required('never')`
const pokeTypesSchema = set(pokeTypeSchema).optional()
const pokeTypesSchema = set(..., { required: 'never' })
```

### `.hidden()`

<p style={{ marginTop: '-15px' }}><i><code>boolean | undefined</code></i></p>

Omits schema values during [formatting](../17-actions/2-format.md):

```ts
const pokeTypesSchema = set(pokeTypeSchema).hidden()
const pokeTypesSchema = set(..., { hidden: true })
```

### `.key()`

<p style={{ marginTop: '-15px' }}><i><code>boolean | undefined</code></i></p>

Tags schema values as a primary key attribute or linked to a primary key attribute:

```ts
// Note: The method also sets the `required` property to 'always'
// (it is often the case in practice, you can still use `.optional()` if needed)
const pokeTypesSchema = set(pokeTypeSchema).key()
const pokeTypesSchema = set(..., {
  key: true,
  required: 'always'
})
```

### `.savedAs(...)`

<p style={{ marginTop: '-15px' }}><i><code>string</code></i></p>

Renames schema values during the [transformation step](../17-actions/1-parse.md) (within [`items`](../13-item/index.md) or [`maps`](../14-map/index.md)):

```ts
const pokeTypesSchema = set(pokeTypeSchema).savedAs('pt')
const pokeTypesSchema = set(..., { savedAs: 'pt' })
```

### `.default(...)`

<p style={{ marginTop: '-15px' }}><i><code>ValueOrGetter&lt;Set&lt;ELEMENTS&gt;&gt;</code></i></p>

Specifies default values. See [Defaults and Links](../2-defaults-and-links/index.md) for more details:

:::note[Examples]

<Tabs>
<TabItem value="put-update" label="Put/Update">

```ts
const now = () => new Date().toISOString()

const timestampsSchema = set(string())
  .default(() => new Set([now()]))
  .updateDefault(() => $add(now()))
// 👇 Similar to
const timestampsSchema = set(string())
  .putDefault(() => new Set([now()]))
  .updateDefault(() => $add(now()))
// 👇 ...or
const timestampsSchema = set({
  putDefault: () => new Set([now()])
})
```

</TabItem>
<TabItem value="key" label="Key">

```ts
const defaultSpecifiers = new Set(['POKEMON'])

const specifiersSchema = set(string())
  .key()
  .default(defaultSpecifiers)
// 👇 Similar to
const specifiersSchema = set(string())
  .key()
  .keyDefault(defaultSpecifiers)
// 👇 ...or
const specifiersSchema = set({
  key: true,
  required: 'always',
  keyDefault: defaultSpecifiers
})
```

</TabItem>
</Tabs>

:::

### `.link<Schema>(...)`

<p style={{ marginTop: '-15px' }}><i><code>Link&lt;SCHEMA, Set&lt;ELEMENTS&gt;&gt;</code></i></p>

Similar to [`.default(...)`](#default) but allows deriving the default value from other attributes. See [Defaults and Links](../2-defaults-and-links/index.md) for more details:

```ts
const pokemonSchema = item({
  pokeTypeList: list(pokeTypeSchema)
}).and(prevSchema => ({
  pokeTypeSet: set(pokeTypeSchema).link<typeof prevSchema>(
    // 🙌 Correctly typed!
    item => new Set(item.pokeTypeList)
  )
}))
```

### `.validate(...)`

<p style={{ marginTop: '-15px' }}><i><code>Validator&lt;Set&lt;ELEMENTS&gt;&gt;</code></i></p>

Adds custom validation. See [Custom Validation](../3-custom-validation/index.md) for more details:

:::note[Examples]

```ts
const nonEmptySetSchema = set(string()).validate(
  input => input.size > 0
)
// 👇 Similar to
const nonEmptySetSchema = set(string()).putValidate(
  input => input.size > 0
)
// 👇 ...or
const nonEmptySetSchema = set(string(), {
  putValidator: input => input.size > 0
})
```

:::
