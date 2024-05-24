---
title: List 👷
---

# List 👷

Defines a list of sub-schemas of any type:

```tsx
import { list } from 'dynamodb-toolbox';

const pokemonSchema = schema({
  ...
  skills: list(string()),
});

type FormattedPokemon = FormattedItem<typeof pokemonEntity>;
// => {
//   ...
//   skills: string[]
// }
```

As in sets, options can be povided as a 2nd argument.
