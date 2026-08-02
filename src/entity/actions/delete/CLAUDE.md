# `delete` — `DeleteItemCommand`

`DeleteItem` for a single entity item, addressed by key. Sendable.

```ts
const { Attributes } = await User
  .build(DeleteItemCommand)
  .key({ id: '1' })
  .options({ condition: { attr: 'status', eq: 'archived' }, returnValues: 'ALL_OLD' })
  .send()
```

## Files

- `deleteItemCommand.ts` — `DeleteItemCommand` class.
- `options.ts` — `DeleteItemOptions` (condition, returnValues, capacity, metrics); `DeleteItemResponse`.
- `deleteItemParams/` — builds raw `DeleteCommandInput`.
- `constants.ts`.
