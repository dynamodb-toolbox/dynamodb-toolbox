# `fromZodSchema/v3` — `fromZodSchema` for zod v3

Converts a **zod v3** schema into a DDB-TB schema. The sibling [`v4/`](../v4/CLAUDE.md) does the same for zod v4; the two live side by side because zod ships both versions in one package, under the `zod/v3` and `zod/v4` permalinks.

Imported through the `dynamodb-toolbox/schema/actions/fromZodSchema/v3` subpath, or through the parent folder's **deprecated** alias. Like the v4 action, it is not re-exported from `src/index.ts`: both versions export the same `fromZodSchema` name.

A plain function (no schema to `build` from yet).

```ts
const ddbSchema = fromZodSchema(zObject)
```

## Files

- `fromZodSchema.ts` — entry: `_fromZodSchema` (the untyped `instanceof` chain) and the typed `fromZodSchema` wrapper around it, which is where the one cast lives.
- `types.ts` — `FromZodSchema`, `FromZodSchemaRec`, and the node unions they dispatch on.
- `utils.ts` — `withMeta` (a zod schema's `description` → `meta`), applied by each mapper.
- One file per Zod node — `zodString.ts`, `zodNumber.ts`, `zodBoolean.ts`, `zodBigInt.ts`, `zodNull.ts`, `zodLiteral.ts`, `zodEnum.ts`, `zodArray.ts`, `zodTuple.ts`, `zodObject.ts`, `zodRecord.ts`, `zodSet.ts`, `zodUnion.ts`, `zodDiscriminatedUnion.ts`, `zodOptional.ts`, `zodDefault.ts`, `zodEffects.ts`, `zodCustom.ts` — each mapping one Zod type to its DDB-TB equivalent.

Each mapper has a colocated `*.unit.test.ts`. Adding support for a Zod node = new `zodX.ts` + a branch in `fromZodSchema.ts` + an arm in `types.ts`.
