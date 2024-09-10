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
import { map } from 'dynamodb-toolbox/attributes/map'

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
  deepMagic: map({
    does: map({
      work: string().const('!'),
    }),
  }),
});

type FormattedPokemon = FormattedItem<typeof PokemonEntity>
// => {
//   ...
//   deepMagic: {
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

- <code>'atLeastOnce' <i>(default)</i></code>: Required (starting value)
- `'always'`: Always required (including updates)
- `'never'`: Optional

```ts
// Equivalent
const nameSchema = map({
  firstName: string(),
  lastName: string()
})
const nameSchema = map({ ... }).required()
const nameSchema = map(
  { ... },
  // Options can be provided as 2nd argument
  { required: 'atLeastOnce' }
)

// shorthand for `.required('never')`
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
// Note: The method also sets the `required` property to 'always'
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

Renames the attribute during the [transformation step](../16-actions/1-parse.md) (at root level or within other Maps):

```ts
const nameSchema = map({
  firstName: string(),
  lastName: string()
}).savedAs('n')
const nameSchema = map({ ... }, { savedAs: 'pt' })
```

### `.default(...)`

<p style={{ marginTop: '-15px' }}><i><code>ValueOrGetter&lt;CHILD_ATTRIBUTES&gt;</code></i></p>

Specifies default values for the attribute. See [Defaults and Links](../3-defaults-and-links/index.md) for more details:

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

### `.validate(...)`

<p style={{ marginTop: '-15px' }}><i><code>Validator&lt;CHILD_ATTRIBUTES&gt;</code></i></p>

Adds custom validation to the attribute. See [Custom Validation](../4-custom-validation/index.md) for more details:

:::noteExamples

```ts
const nonEmptyMapSchema = map({
  str: string().optional(),
  num: number().optional()
}).validate(input => Object.keys(input).length > 0)
// 👇 Similar to
const nonEmptyMapSchema = map({
  str: string().optional(),
  num: number().optional()
}).putValidate(input => Object.keys(input).length > 0)
// 👇 ...or
const nonEmptyMapSchema = map(
  {
    str: string().optional(),
    num: number().optional()
  },
  {
    validators: {
      key: undefined,
      put: input => input.length > 0,
      update: undefined
    }
  }
)
```

:::
