---
title: Record
---

# Record

A new attribute type that translates to `Partial<Record<KeyType, ValueType>>` in TypeScript. Records differ from maps as they can accept an infinite range of keys and are always partial:

```tsx
import { record } from 'dynamodb-toolbox';

const pokemonType = string().enum(...);

const pokemonSchema = schema({
  ...
  weaknessesByPokemonType: record(pokemonType, number()),
});

type FormattedPokemon = FormattedItem<typeof pokemonEntity>;
// => {
//   ...
//   weaknessesByPokemonType: {
//     [key in PokemonType]?: number
//   }
// }
```

Options can be provided as a 3rd argument:

```tsx
const recordAttr = record(string(), number()).hidden()
const recordAttr = record(string(), number(), {
  hidden: true
})
```
