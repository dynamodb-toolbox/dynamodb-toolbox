# `spy` — `TableSpy`

Test helper. Intercepts table actions so specs can stub responses and inspect calls without hitting DynamoDB. Relies on the `@interceptable` decorator (`../../decorator.ts`) that wraps every sendable action.

```ts
const spy = MyTable.build(TableSpy)
spy.on(QueryCommand).resolve({ Items: [...] })
// ... run code under test ...
expect(spy.sent(QueryCommand).count()).toBe(1)
```

## Files

- `spy.ts` — `TableSpy` class (a `TableAction`).
- `actionStub.ts` — stubs an action's `.send()` with a canned response.
- `actionInspector.ts` — records + queries sent args/counts.
- `constants.ts`.

Mirror of `entity/actions/spy`. See the `*.unit.test.ts` / `*.type.test.ts` for usage.
