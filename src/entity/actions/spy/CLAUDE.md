# `spy` — `EntitySpy`

Test helper. Intercepts entity actions so specs can stub responses and inspect calls without hitting DynamoDB. Relies on the `@interceptable` decorator (`../../decorator.ts`) wrapping every sendable action.

```ts
const spy = User.build(EntitySpy)
spy.on(GetItemCommand).resolve({ Item: { id: '1', name: 'Jane' } })
// ... run code under test ...
expect(spy.sent(GetItemCommand).count()).toBe(1)
```

## Files

- `spy.ts` — `EntitySpy` class.
- `actionStub.ts` — stubs an action's `.send()`.
- `actionInspector.ts` — records + queries sent args/counts.
- `constants.ts`.

Mirror of `table/actions/spy`.
