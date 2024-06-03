---
title: List
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# List

Defines a [**list attribute**](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.NamingRulesDataTypes.html#HowItWorks.DataTypes):

```ts
import { list } from 'dynamodb-toolbox/attribute/list';
import { string } from 'dynamodb-toolbox/attribute/string';

const pokeTypeSchema = string().enum('fire', ...)

const pokemonSchema = schema({
  ...
  pokeTypes: list(pokeTypeSchema),
});

type FormattedPokemon = FormattedItem<typeof pokemonEntity>;
// => {
//   ...
//   pokeTypes: PokeType[]
// }
```

:::caution

List elements can be of any type, but they have some (logical) limitations:

- They are necessarily `required`
- They inherit the `key` and `hidden` properties of their parent `set`
- They cannot be renamed, nor have `defaults` or `links`

:::

```ts
// ❌ All those cases raise a type and a run-time error
const strList = list(string().optional())
const strList = list(string().key())
const strList = list(string().hidden())
const strList = list(string().savedAs('foo'))
const strList = list(string().default('bar'))
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
const pokeTypesSchema = list(pokeTypeSchema).required()
const pokeTypesSchema = list(
  pokeTypeSchema,
  // Options can be provided as 2nd argument
  { required: 'atLeastOnce' }
)

// shorthand for `.required("never")`
const pokeTypesSchema = list(pokeTypeSchema).optional()
const pokeTypesSchema = list(..., { required: 'never' })
```

### `.hidden()`

<p style={{ marginTop: '-15px' }}><i><code>boolean | undefined</code></i></p>

Skips attribute when formatting items:

```ts
const pokeTypesSchema = list(pokeTypeSchema).hidden()
const pokeTypesSchema = list(..., { hidden: true })
```

### `.key()`

<p style={{ marginTop: '-15px' }}><i><code>boolean | undefined</code></i></p>

Tags attribute as needed to compute the primary key:

```ts
// Note: The method also modifies the `required` property to "always"
// (it is often the case in practice, you can still use `.optional()` if needed)
const pokeTypesSchema = list(pokeTypeSchema).key()
const pokeTypesSchema = list(..., {
  key: true,
  required: 'always'
})
```

### `.savedAs(...)`

<p style={{ marginTop: '-15px' }}><i><code>string</code></i></p>

Renames the attribute during the [transformation step](../4-schemas/4-actions/1-parse.md) (at root level or within [Maps](./8-maps.md)):

```ts
const pokeTypesSchema = list(pokeTypeSchema).savedAs('pk_t')
const pokeTypesSchema = list(..., { savedAs: 'pk_t' })
```

### `.default(...)`

<p style={{ marginTop: '-15px' }}><i><code>ValueOrGetter&lt;ELEMENTS[]&gt;</code></i></p>

Specifies default values for the attribute. There are three kinds of defaults:

- `putDefault`: Applied on put actions (e.g. [`PutItemCommand`](../3-entities/3-actions/2-put-item/index.md)).
- `updateDefault`: Applied on update actions (e.g. [`UpdateItemCommand`](../3-entities/3-actions/3-update-item/index.md)).
- `keyDefault`: Overrides other defaults on [key](#key) attributes (ignored otherwise).

The `default` method is a shorthand that acts as `keyDefault` on key attributes and `putDefault` otherwise:

:::noteExamples

<Tabs>
<TabItem value="put" label="Put">

```ts
const empty: PokeType[] = []

const pokeTypesSchema = list(pokeTypeSchema).default(empty)
// 👇 Similar to
const pokeTypesSchema = list(...).putDefault(empty)
// 👇 ...or
const pokeTypesSchema = list(..., {
  defaults: {
    key: undefined,
    put: empty,
    update: undefined
  }
})

// 🙌 Getters also work!
const pokeTypesSchema = list(...).default(() => empty)
```

</TabItem>
<TabItem value="key" label="Key">

```ts
const empty: PokeType[] = []

const pokeTypesSchema = list(pokeTypeSchema)
  .key()
  .default(empty)
// 👇 Similar to
const pokeTypesSchema = list(...).key().keyDefault(empty)
// 👇 ...or
const pokeTypesSchema = list(..., {
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
const updateDatesSchema = list(string()).updateDefault(
  // Add date at each updates
  () => $append(new Date().toISOString())
)
// 👇 Similar to
const updateDatesSchema = list({
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

<p style={{ marginTop: '-15px' }}><i><code>ValueOrGetter&lt;ELEMENTS[]&gt;</code></i></p>

Similar to [`.default(...)`](#default) but allows deriving the default value from other attributes. See [Defaults and Links](../4-schemas/3-defaults-and-links/index.md) for more details:

```ts
const pokemonSchema = schema({
  canFly: boolean()
}).and(baseSchema => ({
  pokeTypes: list(pokeTypeSchema).link<typeof baseSchema>(
    // 🙌 Correctly typed!
    item => (item.canFly ? ['fly'] : [])
  )
}))
```
