---
title: ParsePaths
sidebar_custom_props:
  sidebarActionType: util
---

# PathParser

Builds a [Projection Expression](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.ProjectionExpressions.html) that can be used to filter the returned attributes of a read operation like a [GetItem](../1-get-item/index.md), [Query](../../../2-tables/2-actions/2-query/index.md) or [Scan](../../../2-tables/2-actions/1-scan/index.md):

```ts
import { PathParser } from 'dynamodb-toolbox/entity/actions/parsePaths'

// 👇 To be used in DynamoDB commands
const { ProjectionExpression, ExpressionAttributeNames } =
  PokemonEntity.build(PathParser).parse(['name', 'level'])
```

## Methods

### `transform(...)`

<p style={{ marginTop: '-15px' }}><i><code>(paths: Path&lt;ENTITY&gt;[], opt?: Options) => string[]</code></i></p>

**Validates the paths** for the provided `Entity` and **transforms them** to match the underlying data if needed:

```ts
const pokemonSchema = item({
  name: string(),
  level: number().savedAs('_l')
  ...
})

PokemonEntity.build(PathParser).transform(['name', 'level'])
// => ['name', '_l']
```

By default, the method expects all the paths to be valid for the provided `Entity` and throws an `invalidExpressionAttributePath` error if not. You can unset the `strict` option to skip invalid paths:

```ts
const pokemonSchema = item({
  name: string(),
  level: number().savedAs('_l')
  ...
})

PokemonEntity.build(PathParser).transform(
  ['name', 'level', 'unknown.path'],
  { strict: false }
)
// => ['name', '_l']
```

:::info

Note that the `transform(...)` method **may add paths** if several options of an [`anyOf`](../../../4-schemas/16-anyOf/index.md) attribute match a provided path:

<details className="details-in-admonition">
<summary>🔎 <b>Show example</b></summary>

```ts
const pokemonSchema = item({
  meta: anyOf(
    map({ description: string() }),
    map({ description: string().savedAs('d') })
    ...
  )
  ...
})

PokemonEntity.build(PathParser).transform(['meta.description'])
// => ['meta.description', 'meta.d']
```

</details>

:::

### `express(...)`

<p style={{ marginTop: '-15px' }}><i><code><b>static</b> (paths: string[]) => ProjectionExpression</code></i></p>

Translates **any path list** to a DynamoDB [Projection Expression](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.ProjectionExpressions.html):

```ts
PathParser.express(['name', 'level'])
// => {
//   ProjectionExpression: '#p_1, #p_2',
//   ExpressionAttributeNames: {
//     '#p_1': 'name',
//     '#p_2': 'level'
//   },
// }
```

:::caution

The method's static nature emphasizes that it **does not validate the paths**. It should only be used on [`transformed`](#transform) paths.

:::

### `parse(...)`

<p style={{ marginTop: '-15px' }}><i><code>(paths: Path&lt;ENTITY&gt;[]) => ProjectionExpression</code></i></p>

Subsequently [`transform`](#transform) and [`express`](#express) paths for the provided `Entity`:

```ts
PokemonEntity.build(PathParser).parse(['name', 'level'])
// => {
//   ProjectionExpression: '#p_1, #p_2',
//   ExpressionAttributeNames: {
//     '#p_1': 'name',
//     '#p_2': 'level'
//   },
// }
```

## Paths

The path syntax from DynamoDB-Toolbox follows the [DynamoDB specifications](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.ProjectionExpressions.html), while making it **type-safe** and **simpler**:

```ts
import type { EntityPaths } from 'dynamodb-toolbox/entity/actions/parsePaths'

type PokemonPath = EntityPaths<typeof PokemonEntity>

const namePath: PokemonPath = 'name'

const deepListPath: PokemonPath = 'pokeTypes[0]'

const deepMapOrRecordPath: PokemonPath = 'weaknesses.fire'
// 👇 Similar to
const deepMapOrRecordPath: PokemonPath = `weaknesses['fire']`

// 👇 Use this syntax to escape special chars (e.g. in `records`)
const deepRecordPath: PokemonPath = `meta['any[char]-you.want!']`
```
