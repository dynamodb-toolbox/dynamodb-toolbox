# `fromZodSchema/v4` — `fromZodSchema` for zod v4

Converts a **zod v4** schema (Classic or Mini) into a DDB-TB schema. The sibling [`v3/`](../v3/CLAUDE.md) does the same for zod v3; the two live side by side because zod ships both versions in one package, under the `zod/v3` and `zod/v4` permalinks.

Imported through the `dynamodb-toolbox/schema/actions/fromZodSchema/v4` subpath. Like the v3 action (which the parent folder also exposes under a deprecated alias), it is not re-exported from `src/index.ts`: both versions export the same `fromZodSchema` name.

```ts
const ddbSchema = fromZodSchema(zObject)
```

## Why it is not a port of the v3 tree

- **Dispatch is a `switch` on `def.type`**, not an `instanceof` chain. The discriminant survives two copies of zod in one `node_modules`, where `instanceof` does not.
- **Schemas are typed `SomeType`**, zod's loosest schema type, which is also how zod types the sub-schemas it exposes on its `def`s. `$ZodType` would need a cast at every recursion, and `SomeType` accepts Mini schemas as well.
- **Mappers take the schema _and_ its `def`.** zod Mini exposes no accessors (`.element`, `.unwrap()`, ...), only `_zod.def` — and a nested discriminant (`schema._zod.def.type`) cannot narrow the schema itself, so each mapper is handed the def the dispatcher's `switch` has already narrowed instead of re-deriving it with a cast. The schema still comes along for `withMeta` and `withRefinements`. `fromZodEnum` takes no def — a native enum's values are not in it, so it reads `_zod.values` off the schema (see the gotchas).
- **`FromZodSchema` is a flat union of `extends` arms**, like the v3 action's: one arm per node the `switch` maps, each narrowing the schema for its own mapper, plus a last arm that degrades everything else. The arms exclude each other, so their order carries no meaning.
- **Refinements are not a node.** In v4 they append to `def.checks` on the schema they refine, where v3 had a `zodEffects.ts` mapper for them. So `withRefinements` sits next to `withMeta` in every mapper rather than being a mapper of its own, and it reports zod's own issue messages.

## Files

- `fromZodSchema.ts` — entry, and the `switch` over zod's 39 node types.
- `utils.ts` — the two wrappers each mapper applies: `withMeta` (zod's `globalRegistry` → `meta`) and `withRefinements` (`def.checks` → a put validator).
- `types.ts` — `FromZodSchema`, `MappedZodNode` (the discriminants with a counterpart, which the degrading arm tests against), `FromZodSchemaRec` for tuples of schemas, and the `EnumProps` shared by `zodEnum.ts` and `zodLiteral.ts`.
  `FromZodSchemaRec` takes no `PROPS`, where the v3 type still does: a container's props belong to the container (`TupleSchema_<…, PROPS>`), and an element's own props come from its own arm, so no call site ever passed it.
- One file per mapped node — `zodString.ts`, `zodNumber.ts`, `zodBigInt.ts`, `zodBoolean.ts`, `zodNull.ts`, `zodLiteral.ts`, `zodEnum.ts`, `zodArray.ts`, `zodTuple.ts`, `zodObject.ts`, `zodRecord.ts`, `zodSet.ts`, `zodUnion.ts`, `zodDiscriminatedUnion.ts`, `zodOptional.ts`, `zodDefault.ts`, `zodPipe.ts`, `zodCustom.ts`.

Nodes with no DynamoDB equivalent (`date`, `map`, `intersection`, `nullable`, `readonly`, ...) are listed explicitly in the `switch` and degrade to `fromZodCustom` (an `any()` schema, cast to the zod schema's output type). The `switch` has **no `default` clause**, so a node added by a future zod release is a compile error rather than a silent degradation.

## Gotchas

- `z.discriminatedUnion()` reports `def.type === 'union'` and is a `$ZodUnion` structurally, so the two kinds of union share one `case` and one arm: `'discriminator' in def` tells them apart at runtime, a nested `extends` in the type.
- `z.preprocess()` narrows `def.in` to a `$ZodTransform`, which makes it fail a structural match against `$ZodPipe`: that one arm tests the discriminant instead.
- A numeric native enum carries its reverse mappings in `def.entries` (`{ 0: 'A', A: 0 }`), so `fromZodEnum` reads `_zod.values`.
- `z.strictObject` and `z.object` are indistinguishable at the type level (`$strict` and `$strip` are structurally identical), so `strict` is carried at runtime only.
- `withRefinements` validates synchronously, so an async refinement (`z.string().refine(async …)`) surfaces zod's own `$ZodAsyncError` from inside a DDB-TB parse rather than a `DynamoDBToolboxError`. DDB-TB parsing has no async path to hand it to.

Each mapper has a colocated `*.unit.test.ts`. Adding support for a node = new `zodX.ts` + a `case` in `fromZodSchema.ts` + an arm in `types.ts`.
