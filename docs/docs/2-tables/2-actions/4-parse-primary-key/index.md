---
title: Parse Primary Key
sidebar_custom_props:
  sidebarActionType: util
---

# Parse Primary Key

Both types are useful to type item primary keys:

```tsx
import type { KeyInput, PrimaryKey } from 'dynamodb-toolbox'

type PokemonKeyInput = KeyInput<typeof pokemonEntity>
// => { pokemonClass: string, pokemonId: string }

type MyTablePrimaryKey = PrimaryKey<typeof myTable>
// => { PK: string, SK: string }
```
