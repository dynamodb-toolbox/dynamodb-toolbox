---
title: Defaults & Links 👷
---

# Defaults & Links 👷

# Links

This feature was very handy for "technical" attributes such as composite indexes.

However, default value inputs are just impossible to type correctly in TypeScript:

```ts
const pokemonSchema = schema({
  ...
  level: number(),
  levelPlusOne: number().default(
    // ❌ Cannot infer the schema type
    input => input.level + 1,
  ),
});
```

Schemas use attributes schemas that are already re-usable.

However, you can use the `.and` method.

It can receive a schema or a function returning schema. In this case, the previous schema is provided as an argument.

This is useful to hard-type links.

Defaults and links are computed one after the other, so you can use the previous attribute values in the next one.
