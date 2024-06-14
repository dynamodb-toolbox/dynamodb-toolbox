---
title: map
sidebar_custom_props:
  code: true
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Map

Defines a [**map attribute**](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.NamingRulesDataTypes.html#HowItWorks.DataTypes), i.e. a finite list of key-value pairs. Child attributes can have any type:

```ts
import { map } from 'dynamodb-toolbox/attribute/map'

const pokemonSchema = schema({
  ...
  name: map({
    firstName: string(),
    lastName: string()
  })
})

type FormattedPokemon = FormattedItem<typeof PokemonEntity>
// => {
//   ...
//   name: {
//     firstName: string
//     lastName: string
//   }
// }

const pokemonSchema = schema({
  ...
  nestedMagic: map({
    does: map({
      work: string().const('!'),
    }),
  }),
});

type FormattedPokemon = FormattedItem<typeof PokemonEntity>
// => {
//   ...
//   nestedMagic: {
//     does: {
//       work: "!"
//     }
//   }
// }
```

## Options

### `.required()`

<p style={{ marginTop: '-15px' }}><i><code>string | undefined</code></i></p>

Tags the attribute as **required** (at root level or within other Maps). Possible values are:

- <code>"atLeastOnce" <i>(default)</i></code>: Required
- `"always"`: Always required (including updates)
- `"never"`: Optional

```ts
// Equivalent
const nameSchema = map({
  firstName: string(),
  lastName: string()
}).required()
const nameSchema = map(
  { ... },
  // Options can be provided as 2nd argument
  { required: 'atLeastOnce' }
)

// shorthand for `.required("never")`
const nameSchema = map({ ... }).optional()
const nameSchema = map({ ... }, { required: 'never' })
```

### `.hidden()`

<p style={{ marginTop: '-15px' }}><i><code>boolean | undefined</code></i></p>

Skips the attribute when formatting items:

```ts
const nameSchema = map({
  firstName: string(),
  lastName: string()
}).hidden()
const nameSchema = map({ ... }, { hidden: true })
```

### `.key()`

<p style={{ marginTop: '-15px' }}><i><code>boolean | undefined</code></i></p>

Tags the attribute as needed to compute the primary key:

```ts
// Note: The method also sets the `required` property to "always"
// (it is often the case in practice, you can still use `.optional()` if needed)
const nameSchema = map({
  firstName: string(),
  lastName: string()
}).key()
const nameSchema = map({ ... }, {
  key: true,
  required: 'always'
})
```

Note that if child attributes are required to derive the primary key, you must also tag them as `key`:

```ts
const nameSchema = map({
  // 👇 Required in get operations
  firstName: string().key(),
  // 👇 NOT required
  lastName: string()
}).key()
```

### `.savedAs(...)`

<p style={{ marginTop: '-15px' }}><i><code>string</code></i></p>

Renames the attribute during the [transformation step](../14-actions/1-parse.md) (at root level or within other Maps):

```ts
const nameSchema = map({
  firstName: string(),
  lastName: string()
}).savedAs('n')
const nameSchema = map({ ... }, { savedAs: 'pt' })
```

### `.default(...)`

<p style={{ marginTop: '-15px' }}><i><code>ValueOrGetter&lt;CHILD_ATTRIBUTES&gt;</code></i></p>

Specifies default values for the attribute. There are three kinds of defaults:

- `putDefault`: Applied on put actions (e.g. [`PutItemCommand`](../../3-entities/3-actions/2-put-item/index.md))
- `updateDefault`: Applied on update actions (e.g. [`UpdateItemCommand`](../../3-entities/3-actions/3-update-item/index.md))
- `keyDefault`: Overrides other defaults on [key](#key) attributes (ignored otherwise)

The `default` method is a shorthand that acts as `keyDefault` on key attributes and `putDefault` otherwise:

:::noteExamples

<Tabs>
<TabItem value="put-update" label="Put/Update">

```ts
const now = () => new Date().toISOString()

const timestampsSchema = map({
  created: string(),
  updated: string().optional()
})
  .default(() => ({ created: now() }))
  .updateDefault(() => ({ updated: now() }))
// 👇 Similar to
const timestampsSchema = map({ ... })
  .putDefault(() => ({ created: now() }))
  .updateDefault(() => ({ updated: now() }))
// 👇 ...or
const timestampsSchema = map({ ... }, {
  defaults: {
    key: undefined,
    put: () => ({ created: now() }),
    update: () => ({ updated: now() })
  }
})
```

</TabItem>
<TabItem value="key" label="Key">

```ts
const idsSchema = map({
  id: string().key(),
  subId: string().key().optional()
})
  .key()
  .default({ id: '123' })
// 👇 Similar to
const idsSchema = map({ ... })
  .key()
  .keyDefault({ id: '123' })
// 👇 ...or
const idsSchema = map({ ... }, {
  defaults: {
    key: { id: '123' },
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

### `.link<Schema>(...)`

<p style={{ marginTop: '-15px' }}><i><code>Link&lt;SCHEMA, CHILD_ATTRIBUTES&gt;</code></i></p>

Similar to [`.default(...)`](#default) but allows deriving the default value from other attributes. See [Defaults and Links](../3-defaults-and-links/index.md) for more details:

```ts
const pokemonSchema = schema({
  name: string()
}).and(prevSchema => ({
  parsedName: map({
    firstName: string(),
    lastName: string()
  }).link<typeof prevSchema>(
    // 🙌 Correctly typed!
    ({ name }) => {
      const [firstName, lastName] = name.split(' ')
      return { firstName, lastName }
    }
  )
}))
```
