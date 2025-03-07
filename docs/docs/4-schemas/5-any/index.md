---
title: any
sidebar_custom_props:
  code: true
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Any

Describes **any value**. No validation is applied at run-time, and its type is resolved as `unknown` by default:

```ts
import { any } from 'dynamodb-toolbox/schema/any'

const metadataSchema = any()

type Metadata = FormattedValue<typeof metadataSchema>
// => unknown
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
const metadataSchema = any()
const metadataSchema = any().required()
const metadataSchema = any({ required: 'atLeastOnce' })

// shorthand for `.required('never')`
const metadataSchema = any().optional()
const metadataSchema = any({ required: 'never' })
```

### `.hidden()`

<p style={{ marginTop: '-15px' }}><i><code>boolean | undefined</code></i></p>

Omits schema values during [formatting](../17-actions/2-format.md):

```ts
const metadataSchema = any().hidden()
const metadataSchema = any({ hidden: true })
```

### `.key()`

<p style={{ marginTop: '-15px' }}><i><code>boolean | undefined</code></i></p>

Tags schema values as a primary key attribute or linked to a primary key attribute:

```ts
// Note: The method also sets the `required` property to 'always'
// (it is often the case in practice, you can still use `.optional()` if needed)
const metadataSchema = any().key()
const metadataSchema = any({
  key: true,
  required: 'always'
})
```

### `.savedAs(...)`

<p style={{ marginTop: '-15px' }}><i><code>string</code></i></p>

Renames schema values during the [transformation step](../17-actions/1-parse.md) (within [`items`](../13-item/index.md) or [`maps`](../14-map/index.md)):

```ts
const metadataSchema = any().savedAs('meta')
const metadataSchema = any({ savedAs: 'meta' })
```

### `.castAs<TYPE>()`

<p style={{ marginTop: '-15px' }}><i>(TypeScript only)</i></p>

Overrides the resolved type of valid values:

```ts
const metadataSchema = any().castAs<{ foo: 'bar' }>()
```

### `.transform(...)`

<p style={{ marginTop: '-15px' }}><i><code>Transformer&lt;unknown&gt;</code></i></p>

Allows modifying schema values during the [transformation step](../17-actions/1-parse.md):

```ts
const jsonStringify = {
  parse: JSON.stringify,
  format: JSON.parse
}

// JSON stringifies the value
const stringifiedSchema = any().transform(jsonStringify)
const stringifiedSchema = any({ transform: jsonStringify })
```

DynamoDB-Toolbox exposes [on-the-shelf transformers](../18-transformers/1-usage.md) (including [`jsonStringify`](../18-transformers/3-json-stringify.md)), so feel free to use them!

### `.default(...)`

<p style={{ marginTop: '-15px' }}><i><code>ValueOrGetter&lt;unknown&gt;</code></i></p>

Specifies default values. See [Defaults and Links](../2-defaults-and-links/index.md) for more details:

:::note[Examples]

<Tabs>
<TabItem value="put" label="Put">

```ts
const metadataSchema = any().default({ any: 'value' })
// 👇 Similar to
const metadataSchema = any().putDefault({ any: 'value' })
// 👇 ...or
const metadataSchema = any({ putDefault: { any: 'value' } })

// 🙌 Getters also work!
const metadataSchema = any().default(() => ({
  any: 'value'
}))
```

</TabItem>
<TabItem value="key" label="Key">

```ts
const metadataSchema = any().key().default('myKey')
// 👇 Similar to
const metadataSchema = any().key().keyDefault('myKey')
// 👇 ...or
const metadataSchema = any({
  key: true,
  required: 'always',
  keyDefault: 'myKey'
})
```

</TabItem>
<TabItem value="update" label="Update">

```ts
const metadataSchema = any().updateDefault({
  updated: true
})
// 👇 Similar to
const metadataSchema = any({
  updateDefault: { updated: true }
})
```

</TabItem>
</Tabs>

:::

### `.link<Schema>(...)`

<p style={{ marginTop: '-15px' }}><i><code>Link&lt;SCHEMA, unknown&gt;</code></i></p>

Similar to [`.default(...)`](#default) but allows deriving the default value from other attributes. See [Defaults and Links](../2-defaults-and-links/index.md) for more details:

```ts
const pokemonSchema = item({
  pokeTypes: string()
}).and(prevSchema => ({
  metadata: any().link<typeof prevSchema>(
    // 🙌 Correctly typed!
    item => item.pokeTypes.join('#')
  )
}))
```

### `.validate(...)`

<p style={{ marginTop: '-15px' }}><i><code>Validator&lt;unknown&gt;</code></i></p>

Adds custom validation. See [Custom Validation](../3-custom-validation/index.md) for more details:

:::note[Examples]

```ts
const metadataSchema = any().validate(
  input => typeof input === 'object'
)
// 👇 Similar to
const metadataSchema = any().putValidate(
  input => typeof input === 'object'
)
// 👇 ...or
const metadataSchema = any({
  putValidator: input => typeof input === 'object'
})
```

:::
