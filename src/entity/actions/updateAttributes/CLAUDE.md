# `updateAttributes` — `UpdateAttributesCommand`

`UpdateItem` with straightforward attribute-set semantics: provided attributes are SET, `$remove` clears them. Simpler sibling of [`update`](../update/CLAUDE.md) — no arithmetic/list extensions — but validates provided attributes more strictly (deep/complete sub-values).

```ts
await User.build(UpdateAttributesCommand).item({
  id: '1',
  address: { street: 'Main', city: 'NYC' }   // full sub-object required
}).send()
```

## Files

- `updateAttributesCommand.ts` — `UpdateAttributesCommand` class.
- `parseUpdateAttributesExtension` — the (narrower) extension parser it uses.
- `options.ts` — `UpdateAttributesOptions`; `types.ts` — `UpdateAttributesInput`; `UpdateAttributesResponse`.
- `updateAttributesParams/`, `constants.ts`.
