# `accessPattern` — `AccessPattern` (`EntityAccessPattern`)

Entity-scoped reusable access pattern: bind a typed input schema + a transform mapping input → a query/scan, returning items formatted as this entity. Entity counterpart of `table/actions/accessPattern`.

Exported at the root as `EntityAccessPattern` / `IEntityAccessPattern`.

```ts
const ordersByUser = Order
  .build(EntityAccessPattern)
  .schema(map({ userId: string() }))
  .pattern(({ userId }) => ({ partition: `USER#${userId}`, range: { beginsWith: 'ORDER#' } }))

const { Items } = await ordersByUser.query({ userId: '1' }).send()
```

## Files

- `accessPattern.ts` — `AccessPattern` class.
- `constants.ts`.
