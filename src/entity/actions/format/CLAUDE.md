# `format` — `EntityFormatter`

The entity read path. Wraps the schema [`Formatter`](../../../schema/actions/format/CLAUDE.md), pre-bound to the entity's augmented schema. Turns a saved item into the entity's `FormattedItem`, applying projection and reversing transformers.

```ts
const formatted = User.build(EntityFormatter).format(savedItem, {
  attributes: ['id', 'name'],
  partial: true
})
```

## Files

- `entityFormatter.ts` — `EntityFormatter` class; `FormatItemOptions`, `InferReadItemOptions`.
- `options.ts`, `constants.ts`.

Used internally by `get` / `query` / `scan` / transaction-get to format responses.
