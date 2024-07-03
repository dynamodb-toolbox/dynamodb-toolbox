---
title: Warm vs Frozen
---

# Warm vs Frozen

## Composition

Prior to being wrapped in a `schema` declaration, schemas are called **warm:** They are **not validated** (at run-time) and can be used to build other schemas. By inspecting their types, you can see that they are prefixed with `$`.

Once **frozen**, validation is applied and building methods are stripped:

```ts
const $nameSchema = string()
// => $PrimitiveAttribute<"string">

const nameSchema = $nameSchema.freeze()
// => PrimitiveAttribute<"string">

// 👇 `schema` uses `.freeze()` under the hood
const pokemonSchema = schema({
  name: $nameSchema
})
// => Schema<{
//   name: PrimitiveAttribute<"string">
// }>
```

The main takeaway is that **warm schemas can be composed** while **frozen schemas cannot**:

```ts
const nameSchema = string();

const pokemonSchema = schema({
  // 👍 No problem
  pokemonName: nameSchema,
  ...
});

const pokedexSchema = schema({
  // ❌ Not possible
  pokemon: pokemonSchema,
  ...
});
```

## Extension

However, **you can extend a schema** via its `.and(...)` method:

```ts
const extendedPokemonSchema = pokemonSchema.and({
  newAttribute: string()
})
```

<!-- NOTE: 'caution' became 'warning' in docusaurus v3 -->

:::caution

Conflicts in attribute names or `savedAs` properties result in an error.

:::

The `.and(...)` method also accepts functions that return a (warm) schema. In this case, the previous schema is provided as an argument:

```ts
const extendSchema = mySchema.and(prevSchema => ({
  newAttribute: string(),
  ...
}))
```

This is particularly useful for [Defaults & Links](../3-defaults-and-links/index.md).
