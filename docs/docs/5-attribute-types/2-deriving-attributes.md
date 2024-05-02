---
title: Deriving Attributes
---

In previous versions, `default` was used to compute attribute from other attributes values. This feature was very handy for "technical" attributes such as composite indexes.

However, it was just impossible to type correctly in TypeScript:

```tsx
const pokemonSchema = schema({
  ...
  level: number(),
  levelPlusOne: number().default(
    // ❌ No way to retrieve the caller context
    input => input.level + 1,
  ),
});
```

It means the `input` was typed as any and it fell to the developper to type it correctly, which just didn’t cut it for me.
