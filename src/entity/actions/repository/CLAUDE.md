# `repository` — `EntityRepository`

Ergonomic wrapper exposing the entity's actions as plain methods (`get`, `put`, `update`, `delete`, ...), so callers don't build each command class by hand.

```ts
const repo = User.build(EntityRepository)
await repo.put({ id: '1', name: 'Jane' })
const { Item } = await repo.get({ id: '1' })
```

## Files

- `repository.ts` — `EntityRepository` class.

Mirror of `table/actions/repository`.
