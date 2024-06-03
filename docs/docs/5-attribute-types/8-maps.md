---
title: Map 👷
---

# Map 👷

Defines a finite list of key-value pairs. Keys must follow a string schema, while values can be sub-schema of any type:

```ts
import { map } from 'dynamodb-toolbox';

const pokemonSchema = schema({
  ...
  nestedMagic: map({
    does: map({
      work: string().const('!'),
    }),
  }),
});

type FormattedPokemon = FormattedItem<typeof pokemonEntity>;
// => {
//   ...
//   nestedMagic: {
//     does: {
//       work: "!"
//     }
//   }
// }
```

As in sets and lists, options can be povided as a 2nd argument.
