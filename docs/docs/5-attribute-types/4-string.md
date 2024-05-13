---
title: String
---

# Primitives

Defines a `string`, `number`, `boolean` or `binary` attribute:

```tsx
import { string, number, boolean, binary } from 'dynamodb-toolbox';

const pokemonSchema = schema({
  ...
  pokemonType: string(),
  level: number(),
  isLegendary: boolean(),
  binEncoded: binary(),
});

type FormattedPokemon = FormattedItem<typeof pokemonEntity>;
// => {
//   ...
//   pokemonType: string
//   level: number
//   isLegendary: boolean
//   binEncoded: Buffer
// }
```

Similarly to `any` attributes, you can provide default values through the `defaults` option or the `default` methods:

```tsx
// 🙌 Correctly typed!
const creationDate = string().default(() =>
  new Date().toISOString()
)
// 👇 Similar to
const creationDate = string().putDefault(() =>
  new Date().toISOString()
)
// 👇 ...or
const creationDate = string({
  defaults: {
    key: undefined,
    put: () => new Date().toISOString(),
    update: undefined
  }
})

// 👇 Additionally fill 'creationDate' on updates if needed
import { $get } from 'dynamodb-toolbox'

const creationDate = string()
  .putDefault(() => new Date().toISOString())
  // (See UpdateItemCommand section for $get description)
  .updateDefault(() =>
    $get('creationDate', new Date().toISOString())
  )
// 👇 Similar to
const creationDate = string({
  defaults: {
    key: undefined,
    put: () => new Date().toISOString(),
    update: () =>
      $get('creationDate', new Date().toISOString())
  }
})

const id = number().key().default(1)
// 👇 Similar to
const id = number().key().keyDefault(1)
// 👇 ...or
const id = number({
  defaults: {
    key: 1,
    // put & update defaults are not useful in `key` attributes
    put: undefined,
    update: undefined
  }
})
```

Primitive types have an additional `enum` option. For instance, you could provide a finite list of pokemon types:

```tsx
const pokemonTypeAttribute = string().enum(
  'fire',
  'grass',
  'water'
)

// Shorthand for `.enum("POKEMON").default("POKEMON")`
const pokemonPartitionKey = string().const('POKEMON')
```

> 💡 _For type inference reasons, the `enum` option is only available as a method, not as an object option_
