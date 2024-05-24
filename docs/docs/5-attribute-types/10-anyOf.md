---
title: AnyOf 👷
---

# AnyOf 👷

A new <b>meta-</b>attribute type that represents a union of types, i.e. a range of possible types:

```tsx
import { anyOf } from 'dynamodb-toolbox';

const pokemonSchema = schema({
  ...
  pokemonType: anyOf([
    string().const('fire'),
    string().const('grass'),
    string().const('water'),
  ]),
});
```

In this particular case, an `enum` would have done the trick. However, `anyOf` becomes particularly powerful when used in conjunction with a `map` and the `enum` or `const` directives of a primitive attribute, to implement **polymorphism**:

```tsx
const pokemonSchema = schema({
  ...
  captureState: anyOf([
    map({
      status: string().const('caught'),
      // 👇 captureState.trainerId exists if status is "caught"...
      trainerId: string(),
    }),
    // ...but not otherwise! 🙌
    map({ status: string().const('wild') }),
  ]),
});

type CaptureState = FormattedItem<typeof pokemonEntity>['captureState'];
// 🙌 Equivalent to:
// | { status: "wild" }
// | { status: "caught", trainerId: string }
```

As in sets, lists and maps, options can be povided as a 2nd argument.
