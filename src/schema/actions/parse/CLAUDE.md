# `parse` — `Parser`

The **write path**. Validates an input value against the schema and transforms it toward the shape stored in DynamoDB.

`InputValue → (defaults + links) → ValidValue → (transformers) → TransformedValue`

```ts
const parser = schema.build(Parser)
const { key, item } = parser.parse(input, options)
// or step-by-step / lazily via the generator form
```

## Files

- `parser.ts` — `Parser` class (`actionName = 'parse'`). Entry point; runs the pipeline and can yield intermediate steps (default-filled, linked, validated, transformed).
- `options.ts` — `ParseValueOptions` + `InferWriteValueOptions`. Controls `fill` (apply defaults/links), `transform` (apply transformers), and `mode` (`put` | `update` | `key`), plus extension parsing.
- `schema.ts` — dispatcher over the schema tree.
- One file per schema type — `any.ts`, `anyOf.ts`, `primitive.ts`, `set.ts`, `list.ts`, `tuple.ts`, `map.ts`, `record.ts`, `item.ts` — each parsing its branch.
- `utils.ts`, `errors.ts` — helpers + validation error codes.

## Notes

- Mode matters: `key` parses only key attributes; `update` allows update extensions (`$set`, `$add`, ...).
- Extensions are injected via `ExtensionParser` (see `schema/types/extensionParser.ts`); the `update` command supplies its own.
- Mirror any new attribute type here **and** in `format`.
