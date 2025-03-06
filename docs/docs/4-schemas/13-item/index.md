---
title: item
sidebar_custom_props:
  code: true
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Item

Describes [**items**](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.NamingRulesDataTypes.html#HowItWorks.DataTypes) with a finite list of attributes, i.e. key-schema pairs. Items differ from [`maps`](../14-map/index.md) as they **don't have any property** and are not meant to be nested within other schemas:

```ts
import { item } from 'dynamodb-toolbox/schema/item'

const fullNameSchema = item({
  firstName: string(),
  lastName: string()
})

type FullName = FormattedValue<typeof fullNameSchema>
// => {
//  firstName: string
//  lastName: string
// }
```

## Methods

Item schemas can be used to build **new schemas** with the following methods:

### `and(...)`

<p style={{ marginTop: '-15px' }}><i><code>(attr: NEW_ATTR | (MapSchema&lt;OLD_ATTR&gt; => NEW_ATTR)) => MapSchema&lt;OLD_ATTR & NEW_ATTR&gt;</code></i></p>

Produces a new item schema by **extending** the original schema with **new attributes**:

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

Produces a new item schema by **picking** only certain attributes from the original schema:

```ts
const picked = pokemonSchema.pick('name', 'pokemonLevel')
```

Due to the potential disruptive nature of this method on [links](../2-defaults-and-links/index.md#links), they are **reset** in the process:

```ts
const nameSchema = item({
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

Produces a new item schema by **omitting** certain attributes out of the original schema:

```ts
const omitted = pokemonSchema.omit('name', 'pokemonLevel')
```

Due to the potential disruptive nature of this method on [links](../2-defaults-and-links/index.md#links), they are **reset** in the process:

```ts
const nameSchema = item({
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
