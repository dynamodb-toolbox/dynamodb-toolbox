---
title: Set
---

# Set

Defines a set of strings, numbers or binaries. Unlike in previous versions, sets are kept as `Set` classes. Let me know if you would prefer using arrays (or being able to choose from both):

```tsx
import { set } from 'dynamodb-toolbox';

const pokemonSchema = schema({
  ...
  skills: set(string()),
});

type FormattedPokemon = FormattedItem<typeof pokemonEntity>;
// => {
//   ...
//   skills: Set<string>
// }
```

Options can be provided as a 2nd argument:

```tsx
const setAttr = set(string()).hidden()
const setAttr = set(string(), { hidden: true })
```
