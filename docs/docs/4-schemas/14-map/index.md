---
title: map
sidebar_custom_props:
  code: true
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Map

Describes [**map values**](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.NamingRulesDataTypes.html#HowItWorks.DataTypes), i.e. a finite list of key-value pairs. Child attributes can have any type:

```ts
import { map } from 'dynamodb-toolbox/schema/map'

const fullNameSchema = map({
  firstName: string(),
  lastName: string()
})

type FullName = FormattedValue<typeof fullNameSchema>
// => {
//  firstName: string
//  lastName: string
// }

const deepMagic = map({
  does: map({
    work: string().const('!')
  })
})

type DeepMagic = FormattedValue<typeof deepMagic>
// => { does: { work: "!" } }
```

## Options

### `.required()`

<p style={{ marginTop: '-15px' }}><i><code>string | undefined</code></i></p>

Tags schema values as **required** (at root level or within other Maps). Possible values are:

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

Omits schema values during [formatting](../17-actions/2-format.md):

```ts
const nameSchema = map({
  firstName: string(),
  lastName: string()
}).hidden()
const nameSchema = map({ ... }, { hidden: true })
```

### `.key()`

<p style={{ marginTop: '-15px' }}><i><code>boolean | undefined</code></i></p>

Tags schema values as a primary key attribute or linked to a primary key attribute:

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

Renames schema values during the [transformation step](../17-actions/1-parse.md) (at root level or within other Maps):

```ts
const nameSchema = map({
  firstName: string(),
  lastName: string()
}).savedAs('n')
const nameSchema = map({ ... }, { savedAs: 'pt' })
```

### `.default(...)`

<p style={{ marginTop: '-15px' }}><i><code>ValueOrGetter&lt;CHILD_ATTRIBUTES&gt;</code></i></p>

Specifies default values. See [Defaults and Links](../2-defaults-and-links/index.md) for more details:

:::note[Examples]

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
  putDefault: () => ({ created: now() }),
  updateDefault: () => ({ updated: now() })
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
  key: true,
  required: 'always',
  keyDefault: { id: '123' }
})
```

</TabItem>
</Tabs>

:::

### `.link<Schema>(...)`

<p style={{ marginTop: '-15px' }}><i><code>Link&lt;SCHEMA, CHILD_ATTRIBUTES&gt;</code></i></p>

Similar to [`.default(...)`](#default) but allows deriving the default value from other attributes. See [Defaults and Links](../2-defaults-and-links/index.md) for more details:

```ts
const pokemonSchema = item({
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

Adds custom validation. See [Custom Validation](../3-custom-validation/index.md) for more details:

:::note[Examples]

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
  { putValidator: input => Object.keys(input).length > 0 }
)
```

:::

## Methods

Map schemas can be used to build **new schemas** with the following methods:

### `and(...)`

<p style={{ marginTop: '-15px' }}><i><code>(attr: NEW_ATTR | (MapSchema&lt;OLD_ATTR&gt; => NEW_ATTR)) => MapSchema&lt;OLD_ATTR & NEW_ATTR&gt;</code></i></p>

Produces a new map schema by **extending** the original schema with **new attributes**:

```ts
const extendedSchema = baseSchema.and({
  newAttribute: string(),
  ...
})
```

:::info

In case of naming conflicts, new attributes **override** the previous ones.

:::

The method also accepts functions that return new attributes. In this case, the previous schema is provided as an argument (which is particularly useful for building [Links](../2-defaults-and-links/index.md#links)):

```ts
const extendedSchema = mySchema.and(prevSchema => ({
  newAttribute: string(),
  ...
}))
```

### `pick(...)`

<p style={{ marginTop: '-15px' }}><i><code>(...attrNames: ATTR_NAMES[]) => MapSchema&lt;Pick&lt;ATTR, ATTR_NAMES&gt;&gt;</code></i></p>

Produces a new map schema by **picking** only certain attributes from the original schema:

```ts
const picked = pokemonSchema.pick('name', 'pokemonLevel')
```

Due to the potential disruptive nature of this method on [links](../2-defaults-and-links/index.md#links), they are **reset** in the process:

```ts
const nameSchema = map({
  firstName: string(),
  lastName: string(),
  completeName: string().link(({ firstName, lastName }) =>
    [firstName, lastName].join(' ')
  )
})

const picked = nameSchema.pick('lastName', 'completeName')

picked.attributes.completeName.props.putLink
// => undefined
```

### `omit(...)`

<p style={{ marginTop: '-15px' }}><i><code>(...attrNames: ATTR_NAMES[]) => MapSchema&lt;Omit&lt;ATTR, ATTR_NAMES&gt;&gt;</code></i></p>

Produces a new map schema by **omitting** certain attributes out of the original schema:

```ts
const omitted = pokemonSchema.omit('name', 'pokemonLevel')
```

Due to the potential disruptive nature of this method on [links](../2-defaults-and-links/index.md#links), they are **reset** in the process:

```ts
const nameSchema = map({
  firstName: string(),
  lastName: string(),
  completeName: string().link(({ firstName, lastName }) =>
    [firstName, lastName].join(' ')
  )
})

const omitted = nameSchema.omit('firstName')

omitted.attributes.completeName.props.putLink
// => undefined
```
