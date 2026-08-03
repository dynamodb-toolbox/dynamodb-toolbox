# `parsePaths` — `EntityPathParser`

Wraps the schema [`PathParser`](../../../schema/actions/parsePaths/CLAUDE.md), pre-bound to the entity's schema. Compiles typed `EntityPaths` into a DynamoDB `ProjectionExpression` (+ names).

```ts
const proj = User.build(EntityPathParser).parse(['id', 'address.city'])
```

## Files

- `entityPathParser.ts` — `EntityPathParser` class; `EntityPaths` type.
- `constants.ts`.

Backs the `attributes` (projection) option on get / query / scan / transaction-get.
