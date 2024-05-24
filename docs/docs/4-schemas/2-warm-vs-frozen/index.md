---
title: Warm vs Frozen 👷
---

# Warm vs Frozen 👷

Prior to being wrapped in a `schema` declaration, attributes are called **warm:** They are **not validated** (at run-time) and can be used to build other schemas. By inspecting their types, you will see that they are prefixed with `$`. Once **frozen**, validation is applied and building methods are stripped:

```ts
const pokemonName = string()
// => $PrimitiveAttribute<"string">

const frozenPokemonName = pokemonName.freeze()
// => PrimitiveAttribute<"string">
```

The main takeaway is that **warm schemas can be composed** while **frozen schemas cannot**:

```tsx
import { schema } from 'dynamodb-toolbox';

const pokemonName = string();

const pokemonSchema = schema({
  // 👍 No problem
  pokemonName,
  ...
});

const pokedexSchema = schema({
  // ❌ Not possible
  pokemon: pokemonSchema,
  ...
});
```

## Extending a schema

However, if you need to extend a schema, you can still use the `.and` method:

```ts
const extendSchema = mySchema.and({
  newAttribute: string()
})
```

<!-- NOTE: 'caution' became 'warning' in docusaurus v3 -->

:::caution

Conflicts in attribute names or `savedAs` properties will result in an error.

:::

The `and` method can also accept a function that will receive the current schema as an argument, in which case, the previous schema is provided as an argument:

```ts
const extendSchema = mySchema.and(prevSchema => ({
  newAttribute: string(),
  ...
}))
```

This is particularly useful when inferring attribute values from other attributes with links (see [Defaults & Links](../3-defaults-and-links/index.md)).
