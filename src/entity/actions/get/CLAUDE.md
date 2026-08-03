# `get` — `GetItemCommand`

`GetItem` for a single entity item. Sendable; formats the response into the entity's `FormattedItem`.

```ts
const { Item } = await User
  .build(GetItemCommand)
  .key({ id: '1' })
  .options({ consistent: true, attributes: ['id', 'name'] })
  .send()
```

## Files

- `getItemCommand.ts` — `GetItemCommand` class.
- `options.ts` — `GetItemOptions` (consistent, attributes/projection, capacity); `GetItemResponse` type.
- `getItemParams/` — builds raw `GetCommandInput`.
- `constants.ts`.
