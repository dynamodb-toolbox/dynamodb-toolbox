---
title: ParsePaths
sidebar_custom_props:
  sidebarActionType: util
---

# ParsePaths

The `AnyAttributePath` type and `parseProjection` util are useful to type attribute paths and build projection expressions:

```tsx
import {
  AnyAttributePath,
  parseProjection
} from 'dynamodb-toolbox'

const attributes: AnyAttributePath<
  typeof pokemonEntity
>[] = ['pokemonType', 'levelHistory.currentLevel']

const parsedProjection = parseProjection(
  pokemonEntity,
  attributes
)
// => {
//   ProjectionExpression: '#p1, #p2.#p3',
//   ExpressionAttributeNames: {
//     '#p1': 'pokemonType',
//     '#p2': 'levelHistory',
//     '#p3': 'currentLevel',
//   },
// }
```
