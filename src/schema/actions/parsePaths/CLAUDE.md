# `parsePaths` — `PathParser`

Compiles attribute paths into a DynamoDB `ProjectionExpression` string plus `ExpressionAttributeNames`.

```ts
const parser = schema.build(PathParser)
const { ProjectionExpression, ExpressionAttributeNames } =
  parser.parse(['name', 'pos.lat', 'friends[0].id'])
```

Backs the `attributes` (projection) option on `get`, `query`, `scan`, and batch/transaction gets.

## Files

- `pathParser.ts` — `PathParser` class (`actionName = 'parsePath'`) + `ParsePathsOptions`.
- `types.ts` — `ProjectionExpression` output type.
- `expressPaths.ts` — renders paths → expression string + name map (aliasing reserved words).
- `transformPaths.ts` — maps app-level paths to saved attribute names (via `savedAs` / transformers); `TransformPathsOptions`.

Path syntax: dot for maps (`a.b`), `[i]` for lists/tuples. Shared string↔array path helpers live in `../utils`.
