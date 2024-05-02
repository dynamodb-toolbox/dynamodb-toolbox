---
title: Test tools
---

# Test Tools

As much as I appreciate this chained syntax, it makes mocking hard in unit tests. For this reason, the `v1` exposes a `mockEntity` util to help you mock commands:

```tsx
import { mockEntity } from 'dynamodb-toolbox';

const mockedPokemonEntity = mockEntity(pokemonEntity);

mockedPokemonEntity.on(GetItemCommand).resolve({
  // 🙌 Type-safe!
  Item: {
    pokemonId: 'pikachu1',
    name: 'Pikachu',
    level: 42,
    ...
  },
});

// 👇 For more fine-grained control
mockedPokemonEntity
  .on(GetItemCommand)
  .mockImplementation((key, options) => ({
    // 🙌 Still type-safe!
    Item: {
      pokemonId: 'pikachu1',
      ...
    },
  }));

//👇 To simulate errors
mockedPokemonEntity.on(GetItemCommand).reject('Something bad happened');
```

You can then make assertions on received commands:

```tsx
await pokemonEntity
  .build(GetItemCommand)
  .key({ pokemonId: 'pikachu1' })
  .options({ consistent: true })
  .send()
// => Will return mocked values!

mockedPokemonEntity.received(GetItemCommand).count()
// => 1
mockedPokemonEntity.received(GetItemCommand).args(0)
// => [{ pokemonId: 'pikachu1' }, { consistent: true }]
mockedEntity.received(GetItemCommand).allArgs()
// => [[{ pokemonId: 'pikachu1' }, { consistent: true }], ...anyOtherCall]
```
