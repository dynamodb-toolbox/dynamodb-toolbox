# `format` — `Formatter`

The **read path**. Takes a value saved in DynamoDB and formats it back to the app-facing shape, reversing transformers and applying projection.

`SavedValue → (reverse transformers) → DecodedValue → (project + format) → FormattedValue`

```ts
const formatter = schema.build(Formatter)
const formatted = formatter.format(savedValue, options)
```

## Files

- `formatter.ts` — `Formatter` class (`actionName = 'format'`). Entry point.
- `options.ts` — `FormatValueOptions` + `InferReadValueOptions`. Controls `attributes` (projection paths to keep), `partial` (allow missing attributes), and transformer reversal.
- `schema.ts` — dispatcher over the schema tree.
- One file per schema type — `any.ts`, `anyOf.ts`, `primitive.ts`, `set.ts`, `list.ts`, `tuple.ts`, `map.ts`, `record.ts`, `item.ts`.
- `utils.ts`, `errors.ts` — helpers + error codes.

## Notes

- Inverse of `parse`. Keep the two in sync — every attribute type needs a branch in both.
- Projection (`attributes`) narrows the returned shape; used by `get`/`query`/`scan` `attributes` option.
- Validates saved values too — a saved item that doesn't match the schema raises a `DynamoDBToolboxError`.
