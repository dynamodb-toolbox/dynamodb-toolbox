# `put` — `PutItemCommand`

`PutItem` for a single entity item. Parses + transforms the input (applying defaults, links, timestamps, key computation), then writes. Sendable.

```ts
const { Attributes } = await User
  .build(PutItemCommand)
  .item({ id: '1', name: 'Jane' })
  .options({ condition: { attr: 'id', exists: false }, returnValues: 'ALL_OLD' })
  .send()
```

## Files

- `putItemCommand.ts` — `PutItemCommand` class.
- `options.ts` — `PutItemOptions` (condition, returnValues, capacity, metrics); `PutItemResponse`.
- `types.ts` — `PutItemInput` (the accepted input shape).
- `putItemParams/` — builds raw `PutCommandInput` (item + condition expression).
- `constants.ts`.
