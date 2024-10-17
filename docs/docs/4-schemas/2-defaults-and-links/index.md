---
title: Defaults & Links
---

# Defaults & Links

## Defaults

All attribute types support providing default values. There are three kinds of defaults:

- `putDefault`: Applied on put actions (e.g. [`PutItemCommand`](../../3-entities/4-actions/2-put-item/index.md))
- `updateDefault`: Applied on update actions (e.g. [`UpdateItemCommand`](../../3-entities/4-actions/3-update-item/index.md))
- `keyDefault`: Overrides other defaults on key attributes (ignored otherwise)

The `default` method is a shorthand that acts as `keyDefault` on key attributes and `putDefault` otherwise.

:::info

☝️ In order for the `.default(...)` shorthand to work properly on key attributes, make sure to use it **after** calling `.key()`.

:::

Here are some simple examples:

```ts
const nameSchema = string().default('Pikachu')

// 🙌 Getters also work!
const createdSchema = string().default(() =>
  new Date().toISOString()
)

const updatesCountSchema = number()
  .putDefault(1)
  .updateDefault(() => $add(1))
```

## Links

In DynamoDB, it is frequent to **infer attribute values from other attributes** (e.g. for secondary indexes). In DynamoDB-Toolbox, this is called _linking_ attributes.

In TypeScript, the difficulty is that it's **impossible** to pass the shape of the parent schema to the `.default` method, and thus efficiently type the link arguments:

```ts
const pokemonSchema = schema({
  ...
  level: number(),
  levelPlusOne: number().default(
    // ❌ Cannot infer the type
    input => input.level + 1
  )
})
```

The solution is to make good use of the `.and(...)` method (see [Updating Schemas](../1-usage/index.md#updating-schemas)) and build the schema **in two steps**:

```ts
const basePokemonSchema = schema({
  ...,
  level: number()
})

const completePokemonSchema = basePokemonSchema.and({
  levelPlusOne: number().link<typeof basePokemonSchema>(
    // 🙌 Correctly typed!
    ({ level }) => level + 1
  )
})

// 👇 OR we can use the getter form:
const pokemonSchema = schema({
  ...
  level: number()
}).and(prevSchema => ({
  levelPlusOne: number().link<typeof prevSchema>(
    // 🙌 Correctly typed!
    ({ level }) => level + 1
  )
}))
```

:::note

This is only required if you need type inference. In vanilla JS, `links` can be used directly in the original schema.

:::

Similarly to defaults, links come in three modes:

- `putLink`: Applied on put actions (e.g. [`PutItemCommand`](../../3-entities/4-actions/2-put-item/index.md))
- `updateLink`: Applied on update actions (e.g. [`UpdateItemCommand`](../../3-entities/4-actions/3-update-item/index.md))
- `keyLink`: Overrides other links on key attributes (ignored otherwise)

The `link` method is a shorthand that acts as `keyLink` on key attributes and `putLink` otherwise.

:::info

☝️ In order for the `.link(...)` shorthand to work properly on key attributes, make sure to use it **after** calling `.key()`.

:::

Note that **defaults are computed before links**, so you can safely use defaults within links (see the [`Parser`](../16-actions/1-parse.md) action for more details).

### Update Syntax

If you use TypeScript, you may notice that the `updateLink` input type can be quite complex. This is to reflect that **extended syntax** (e.g. `$add`, `$get` etc.) is also passed to `updateLink`:

```ts
const pokemonSchema = schema({
  ...
  level: number()
}).and(prevSchema => ({
  levelPlusOne: number().updateLink<typeof prevSchema>(
    ({ level }) => {
      if (level === undefined) {
        return undefined
      }

      // ❌ `level` may be `$add(1)`, `$get('otherAttr')` etc.
      return level + 1
    }
  )
}))
```

If you want to leverage extended syntax within the link, check the [`UpdateItemCommand`](../../3-entities/4-actions/3-update-item/index.md#extended-syntax) docs for more details. If you don't, you can escape it with the `isExtension` type guard:

```ts
import { isExtension } from 'dynamodb-toolbox/entity/actions/update/symbols'

const pokemonSchema = schema({
  ...
  level: number()
}).and(prevSchema => ({
  levelPlusOne: number().updateLink<typeof prevSchema>(
    ({ level }) => {
      if (level === undefined || isExtension(level)) {
        return undefined
      }

      // 🙌 `level` is a number
      return level + 1
    }
  )
}))
```
