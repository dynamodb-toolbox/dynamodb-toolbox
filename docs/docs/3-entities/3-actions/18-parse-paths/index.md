---
title: ParsePaths
sidebar_custom_props:
  sidebarActionType: util
---

# PathParser

Builds a [Projection Expression](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.ProjectionExpressions.html) that can be used to filter the returned attributes of a read operation like a [GetItem](../1-get-item/index.md), [Query](/docs/tables/actions/query) or [Scan](/docs/tables/actions/scan):

```ts
import { PathParser } from '~/entity/actions/parsePaths.js'

// 👇 To be used in DynamoDB commands
const { ProjectionExpression, ExpressionAttributeNames } =
  PokemonEntity.build(PathParser)
    .parse(['name', 'level'])
    .toCommandOptions()
```

## Methods

### `parse(...)`

<p style={{ marginTop: '-15px' }}><i><code>(paths: Path&lt;ENTITY&gt;[]) => PathParser</code></i></p>

Parses a list of paths. Throws an `invalidExpressionAttributePath` error if a path is invalid:

```ts
PokemonEntity.build(PathParser).parse(['name', 'level'])
```

Note that the `parse` method should only be used once per instance (for now). See [Building Paths](#building-paths) for more details on how to write paths.

### `toCommandOptions()`

<p style={{ marginTop: '-15px' }}><i><code>() => CommandOptions</code></i></p>

Collapses the `PathParser` state to a set of options that can be used in a DynamoDB command:

```ts
const { ProjectionExpression, ExpressionAttributeNames } =
  PokemonEntity.build(PathParser)
    .parse(['name', 'level'])
    .toCommandOptions()
```

### `setId(...)`

<p style={{ marginTop: '-15px' }}><i><code>(id: string) => ConditionParser</code></i></p>

Adds a prefix to expression attribute keys. Useful to avoid conflicts when using severals expressions in a single command:

```ts
PokemonEntity.build(PathParser)
  .parse(['name', 'level'])
  .toCommandOptions()
// => {
//   ProjectionExpression: '#p_1, #p_2',
//   ExpressionAttributeNames: {
//     '#p_1': 'name',
//     '#p_2': 'level'
//   }
// }

PokemonEntity.build(PathParser)
  .setId('0')
  .parse(['name', 'level'])
  .toCommandOptions()
// => {
//   ProjectionExpression: '#p0_1, #p0_2',
//   ExpressionAttributeNames: {
//     '#p0_1': 'name',
//     '#p0_2': 'level'
//   }
// }
```

## Paths

The path syntax from DynamoDB-Toolbox follows the [DynamoDB specifications](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.ProjectionExpressions.html), while making it **type-safe** and **simpler**:

```ts
import type {
  Path,
  PathIntersection
} from '~/entity/actions/parsePaths.js'

type PokemonPath = Path<typeof PokemonEntity>
const namePath: PokemonPath = 'name'
const mapChildPath: PokemonPath = 'weaknesses.fire'
const listElementPath: PokemonPath = 'pokeTypes[0]'

// Path common to both entities
type PokemonAndTrainerPath = PathIntersection<
  [typeof PokemonEntity, typeof TrainerEntity]
>
const commonPath: PokemonAndTrainerPath = 'name'
```
