---
title: ParsePaths 👷
sidebar_custom_props:
  sidebarActionType: util
---

# ParsePaths 👷

The `AnyAttributePath` type and `parseProjection` util are useful to type attribute paths and build projection expressions:

```ts
import {
  AnyAttributePath,
  parseProjection
} from 'dynamodb-toolbox'

const attributes: AnyAttributePath<
  typeof PokemonEntity
>[] = ['pokeType', 'levelHistory.currentLevel']

const parsedProjection = parseProjection(
  PokemonEntity,
  attributes
)
// => {
//   ProjectionExpression: '#p1, #p2.#p3',
//   ExpressionAttributeNames: {
//     '#p1': 'pokeType',
//     '#p2': 'levelHistory',
//     '#p3': 'currentLevel',
//   },
// }
```
