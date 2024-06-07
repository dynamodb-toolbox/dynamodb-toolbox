---
title: Defaults & Links
---

# Defaults & Links

## Defaults

All attribute types support providing default values. There are three kinds of defaults:

- `putDefault`: Applied on put actions (e.g. [`PutItemCommand`](../../3-entities/3-actions/2-put-item/index.md))
- `updateDefault`: Applied on update actions (e.g. [`UpdateItemCommand`](../../3-entities/3-actions/3-update-item/index.md))
- `keyDefault`: Overrides other defaults on key attributes (ignored otherwise)

The `default` method is a shorthand that acts as `keyDefault` on key attributes and `putDefault` otherwise.

Here are some simple examples:

```ts
const nameSchema = string().default('Pikachu')

// 🙌 Getters also work!
const createdSchema = string().default(() =>
  new Date().toISOString()
)

const updatesCountSchema = number()
  .putDefault(1)
  .updateDefault($add(1))
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

The solution is to make use of the `.and(...)` method (see [Extending Schemas](../2-warm-vs-frozen/index.md#extension)) and build the schema **in two steps**:

```ts
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

This is only required if you need type inference. In vanilla JS, `link` can be used directly in the original schema.

:::

Similarly to defaults, links come in three flavors:

- `putLink`: Applied on put actions (e.g. [`PutItemCommand`](../../3-entities/3-actions/2-put-item/index.md))
- `updateLink`: Applied on update actions (e.g. [`UpdateItemCommand`](../../3-entities/3-actions/3-update-item/index.md))
- `keyLink`: Overrides other links on key attributes (ignored otherwise)

The `link` method is a shorthand that acts as `keyDefault` on key attributes and `putDefault` otherwise.

Finally, note that **defaults are computed before links**, so you can safely use defaults within links (see the [`Parser` action](../14-actions/1-parse.md) for more details).
