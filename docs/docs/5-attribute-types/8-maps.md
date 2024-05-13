---
title: Map
---

# Map

Defines a finite list of key-value pairs. Keys must follow a string schema, while values can be sub-schema of any type:

```tsx
import { map } from 'dynamodb-toolbox';

const pokemonSchema = schema({
  ...
  nestedMagic: map({
    will: map({
      work: string().const('!'),
    }),
  }),
});

type FormattedPokemon = FormattedItem<typeof pokemonEntity>;
// => {
//   ...
//   nestedMagic: {
//     will: {
//       work: "!"
//     }
//   }
// }
```

As in sets and lists, options can be povided as a 2nd argument.
