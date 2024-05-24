---
title: Format 👷
sidebar_custom_props:
  sidebarActionType: util
---

# Format 👷

`Formatter` transforms a saved item returned by the DynamoDB client to it’s formatted counterpart:

```tsx
import { Formatter } from 'dynamodb-toolbox/schema/actions/format';

// 🙌 Typed as FormattedItem<typeof pokemonEntity>
const formattedPokemon = pokemonSchema.build(Formatter).format(
  savedPokemon,
  // Optional: Filters the formatted item
  { attributes: [...], partial: boolean },
);
```

Note that **it is a parsing operation**, i.e. it does not require the item to be typed as `SavedItem<typeof myEntity>`, but will throw an error if the saved item is invalid:

```tsx
const formattedPokemon = pokemonSchema.build(Formatter).format({
  ...
  level: 'not a number',
});
// ❌ Will raise error:
// => "Invalid attribute in saved item: level. Should be a number"
```
