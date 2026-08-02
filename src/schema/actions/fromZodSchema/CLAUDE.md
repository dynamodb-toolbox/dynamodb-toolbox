# `fromZodSchema` — `fromZodSchema`

Converts a **Zod** schema into a DDB-TB schema, so an existing Zod-defined model can drive DynamoDB. Inverse direction: [`zodSchemer`](../zodSchemer/CLAUDE.md).

A plain function (no schema to `build` from yet).

```ts
const ddbSchema = fromZodSchema(zObject)
```

Note: not re-exported from the action `index.ts` at time of writing — imported directly / via the `dynamodb-toolbox/schema/actions/fromZodSchema` subpath. Marked v3-facing.

## Files

- `fromZodSchema.ts` — entry (`fromZodSchema`).
- One file per Zod node — `zodString.ts`, `zodNumber.ts`, `zodBoolean.ts`, `zodBigInt.ts`, `zodNull.ts`, `zodLiteral.ts`, `zodEnum.ts`, `zodArray.ts`, `zodTuple.ts`, `zodObject.ts`, `zodRecord.ts`, `zodSet.ts`, `zodUnion.ts`, `zodDiscriminatedUnion.ts`, `zodOptional.ts`, `zodDefault.ts`, `zodEffects.ts`, `zodCustom.ts` — each mapping one Zod type to its DDB-TB equivalent.
- `errors.ts` — raised for unsupported Zod constructs.

Each mapper has a colocated `*.unit.test.ts`. Adding support for a Zod node = new `zodX.ts` + wire into `fromZodSchema.ts`.
