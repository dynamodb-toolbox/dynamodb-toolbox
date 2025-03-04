---
title: Custom Validation
---

# Custom Validation

All schema types support adding custom validation during the **parsing step** (see the [`Parser`](../17-actions/1-parse.md) action for more details).

There are three kinds of validators:

- `putValidate`: Applied on put actions (e.g. [`PutItemCommand`](../../3-entities/4-actions/2-put-item/index.md))
- `updateValidate`: Applied on update actions (e.g. [`UpdateItemCommand`](../../3-entities/4-actions/3-update-item/index.md))
- `keyValidate`: Overrides other validators on key schemas (ignored otherwise)

The `validate` method is a shorthand that acts as `keyValidate` on key schemas and `putValidate` otherwise.

:::info

☝️ In order for the `.validate(...)` shorthand to work properly on key schemas, make sure to use it **after** calling `.key()`.

:::

## Validators

A custom **validator** is a function that takes an input (validated by the schema) and returns a `boolean`.

For instance, you can make sure that a `string` has more than 3 characters like this:

```ts
const nameSchema = string().validate(
  // 🙌 Types are correctly inferred!
  name => name.length > 3
)

// ❌ Raises a `parsing.customValidationFailed` error
nameSchema.build(Parser).parse('foo')
```

In case of invalid value, you can **return a `string`** to provide more context through the error message:

```ts
const nameSchema = string().validate(name =>
  name.length > 3 ? true : 'Provide a longer name'
)

nameSchema.build(Parser).parse('foo')
// => ❌ Custom validation for attribute 'name' failed with message: Provide a longer name.
```

Finally, note that the schema itself is also passed to the validator:

```ts
import type { Schema } from 'dynamodb-toolbox/schema'

const validator = (input: unknown, attr: Schema) => {
  ... // custom validation here
}

const mySchema = item({
  name: string().validate(validator)
})
```

## Recursive Schemas

Validators are a great way to create **recursive schemas**:

```ts
import { Parser } from 'dynamodb-toolbox/schema/actions/parse'

const isValidBulletList = (bulletList: unknown): boolean =>
  bulletListSchema.build(Parser).validate(bulletList)

const bulletListSchema = item({
  title: string(),
  subBulletList: any()
    .optional()
    .validate(isValidBulletList)
})
```

:::note

Actually, you can improve the performances of this code by instanciating a single `Parser`:

<details className="details-in-admonition">
<summary>🔎 <b>Show code</b></summary>

```ts
let bulletListParser:
  | Parser<typeof bulletListSchema>
  | undefined

const isValidBulletList = (
  bulletList: unknown
): boolean => {
  if (bulletListParser === undefined) {
    bulletListParser = bulletListSchema.build(Parser)
  }

  return bulletListParser.validate(bulletList)
}

const bulletListSchema = item({
  title: string(),
  subBulletList: any()
    .optional()
    .validate(isValidBulletList)
})
```

</details>

:::

In those cases, type inference **only works partially** as the `subBulletList` property is inferred as `unknown`.

However, a **slight override** of the inferred types gets you there:

```ts
import type { FormattedValue } from 'dynamodb-toolbox/schema/actions/format'

// 🙌 Works as intended!
type FormattedBulletList = FormattedValue<
  typeof bulletListSchema
> & { subBulletList?: FormattedBulletList }
```
