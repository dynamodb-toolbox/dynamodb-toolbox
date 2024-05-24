---
title: Any 👷
---

# Any 👷

Define an attribute of any value. No validation will be applied at run-time, and its type will be resolved as `unknown`:

```tsx
import { any } from 'dynamodb-toolbox/attribute/any';

const pokemonSchema = schema({
  ...
  metadata: any(),
});

type FormattedPokemon = FormattedItem<typeof pokemonEntity>;
// => {
//   ...
//   metadata: unknown
// }
```

You can provide default values through the `defaults` option or the `keyDefault`, `putDefault` and `updateDefault` methods. A simpler `default` method is also exposed. It acts similarly as `putDefault`, except if the attribute has been tagged as a `key` attribute, in which case it will act as `keyDefault`:

```tsx
const metadata = any().default({ any: 'value' })
// 👇 Similar to
const metadata = any().putDefault({ any: 'value' })
// 👇 ...or
const metadata = any({
  defaults: {
    key: undefined,
    put: { any: 'value' },
    update: undefined
  }
})

const keyPart = any()
  .key()
  .default('my-awesome-partition-key')
// 👇 Similar to
const metadata = any()
  .key()
  .keyDefault('my-awesome-partition-key')
// 👇 ...or
const metadata = any({
  key: true,
  defaults: {
    key: 'my-awesome-partition-key',
    // put & update defaults are not useful in `key` attributes
    put: undefined,
    update: undefined
  }
})

const metadata = any().default(() => 'Getters also work!')
```
