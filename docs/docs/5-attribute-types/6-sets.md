---
title: Set
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Set

Defines a [**set attribute**](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.NamingRulesDataTypes.html#HowItWorks.DataTypes):

```ts
import { set } from 'dynamodb-toolbox/attribute/set';
import { string } from 'dynamodb-toolbox/attribute/string';

const pokeTypeSchema = string().enum('fire', ...)

const pokemonSchema = schema({
  ...
  pokeTypes: set(pokeTypeSchema),
});

type FormattedPokemon = FormattedItem<typeof pokemonEntity>;
// => {
//   ...
//   pokeTypes: Set<PokeType>
// }
```

:::caution

Set elements can only be [`numbers`](./3-number.md), [`strings`](./4-string.md) or [`binaries`](./5-binary.md), and have some (logical) limitations:

- They are necessarily `required`
- They inherit the `key` and `hidden` properties of their parent `set`
- They cannot be renamed, nor have `defaults` or `links`

:::

```ts
// ❌ All those cases raise a type and a run-time error
const strSet = set(string().optional())
const strSet = set(string().key())
const strSet = set(string().hidden())
const strSet = set(string().savedAs('foo'))
const strSet = set(string().default('bar'))
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
const pokeTypesSchema = set(pokeTypeSchema).required()
const pokeTypesSchema = set(
  pokeTypeSchema,
  // Options can be provided as 2nd argument
  { required: 'atLeastOnce' }
)

// shorthand for `.required("never")`
const pokeTypesSchema = set(pokeTypeSchema).optional()
const pokeTypesSchema = set(..., { required: 'never' })
```

### `.hidden()`

<p style={{ marginTop: '-15px' }}><i><code>boolean | undefined</code></i></p>

Skips attribute when formatting items:

```ts
const pokeTypesSchema = set(pokeTypeSchema).hidden()
const pokeTypesSchema = set(..., { hidden: true })
```

### `.key()`

<p style={{ marginTop: '-15px' }}><i><code>boolean | undefined</code></i></p>

Tags attribute as needed to compute the primary key:

```ts
// Note: The method also modifies the `required` property to "always"
// (it is often the case in practice, you can still use `.optional()` if needed)
const pokeTypesSchema = set(pokeTypeSchema).key()
const pokeTypesSchema = set(..., {
  key: true,
  required: 'always'
})
```

### `.savedAs(...)`

<p style={{ marginTop: '-15px' }}><i><code>string</code></i></p>

Renames the attribute during the [transformation step](../4-schemas/4-actions/1-parse.md) (at root level or within [Maps](./8-maps.md)):

```ts
const pokeTypesSchema = set(pokeTypeSchema).savedAs('pk_t')
const pokeTypesSchema = set(..., { savedAs: 'pk_t' })
```

### `.default(...)`

<p style={{ marginTop: '-15px' }}><i><code>ValueOrGetter&lt;Set&lt;ELEMENTS&gt;&gt;</code></i></p>

Specifies default values for the attribute. There are three kinds of defaults:

- `putDefault`: Applied on put actions (e.g. [`PutItemCommand`](../3-entities/3-actions/2-put-item/index.md)).
- `updateDefault`: Applied on update actions (e.g. [`UpdateItemCommand`](../3-entities/3-actions/3-update-item/index.md)).
- `keyDefault`: Overrides other defaults on [key](#key) attributes (ignored otherwise).

The `default` method is a shorthand that acts as `keyDefault` on key attributes and `putDefault` otherwise:

:::noteExamples

<Tabs>
<TabItem value="put" label="Put">

```ts
const empty = new Set<PokeType>()

const pokeTypesSchema = set(pokeTypeSchema).default(empty)
// 👇 Similar to
const pokeTypesSchema = set(...).putDefault(empty)
// 👇 ...or
const pokeTypesSchema = set(..., {
  defaults: {
    key: undefined,
    put: empty,
    update: undefined
  }
})

// 🙌 Getters also work!
const pokeTypesSchema = set(...).default(() => empty)
```

</TabItem>
<TabItem value="key" label="Key">

```ts
const empty = new Set<PokeType>()

const pokeTypesSchema = set(pokeTypeSchema)
  .key()
  .default(empty)
// 👇 Similar to
const pokeTypesSchema = set(...).key().keyDefault(empty)
// 👇 ...or
const pokeTypesSchema = set(..., {
  defaults: {
    key: empty,
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
const updateDatesSchema = set(string()).updateDefault(
  // Add date at each updates
  () => $add(new Date().toISOString())
)
// 👇 Similar to
const updateDatesSchema = set({
  defaults: {
    key: undefined,
    put: undefined,
    update: () => $add(new Date().toISOString())
  }
})
```

</TabItem>
</Tabs>

:::

### `.link<Schema>(...)`

<p style={{ marginTop: '-15px' }}><i><code>ValueOrGetter&lt;Set&lt;ELEMENTS&gt;&gt;</code></i></p>

Similar to [`.default(...)`](#default) but allows deriving the default value from other attributes. See [Defaults and Links](../4-schemas/3-defaults-and-links/index.md) for more details:

```ts
const pokemonSchema = schema({
  canFly: boolean()
}).and(baseSchema => ({
  pokeTypes: set(pokeTypeSchema).link<typeof baseSchema>(
    // 🙌 Correctly typed!
    item => new Set(item.canFly ? ['fly'] : [])
  )
}))
```
