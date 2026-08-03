# `update` — `UpdateItemCommand`

`UpdateItem` with a rich, type-safe update grammar. Accepts partial input plus **update extensions** (symbol-tagged operations) that compile into an `UpdateExpression`. Sendable.

```ts
await User.build(UpdateItemCommand).item({
  id: '1',
  loginCount: $add(1),
  tags: $append(['vip']),
  legacy: $remove(),
  displayName: $get('name')
}).send()
```

## Update extensions

Exported from the root (defined in `symbols/`): `$set`, `$get`, `$remove`, `$add`, `$delete`, `$sum`, `$subtract`, `$append`, `$prepend`, plus type guards (`isSetting`, `isSum`, ...) and the `$IS_EXTENSION` / `$ADD` / ... symbols. `parseUpdateExtension` wires them into the schema `Parser`.

## Files

- `updateItemCommand.ts` — `UpdateItemCommand` class.
- `symbols/` — extension symbols, verb helpers, type guards.
- `expressUpdate/` — compiles parsed input + extensions → `UpdateExpression` (SET/REMOVE/ADD/DELETE clauses).
- `options.ts` — `UpdateItemOptions` (condition, returnValues, ...); `types.ts` — `UpdateItemInput`.
- `updateItemParams/`, `constants.ts`.

Contrast with `updateAttributes`, which uses simpler set/remove semantics without the extension grammar.
