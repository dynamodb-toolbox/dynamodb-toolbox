# `zodSchemer/v4` — `ZodSchemer` for zod v4

Derives **zod v4** (Classic) schemas from a DDB-TB schema. The sibling [`v3/`](../v3/CLAUDE.md) does the same for zod v3; the two live side by side because zod ships both versions in one package, under the `zod/v3` and `zod/v4` permalinks.

Imported through the `dynamodb-toolbox/schema/actions/zodSchemer/v4` subpath. Like the v3 action (which the parent folder also exposes under a deprecated alias), it will not be re-exported from `src/index.ts`: both versions export the same `ZodSchemer` name.

Only the **parser** side is here so far — the `formatter/` and the `ZodSchemer` class come next, and the subpath opens with them.

Everything is imported from `zod/v4`, never bare `'zod'` (lint-enforced). Types that only exist on the `$`-prefixed base (`$ZodRecordKey`, `$ZodTypeDiscriminable`) are reached through the `z.core` namespace rather than a second import.

## Why it is not a plain port of the v3 tree

The recursion, the file split and the option types are the v3 action's. What changed is what zod v4 emits:

- **No `WithValidate` type.** `.superRefine()` appends a check to the schema it is called on and returns `this`, where v3 wrapped it in a `ZodEffects`. So `withValidate` has no type counterpart at all, and every call site substitutes the un-refined type.
- **`withDescribe` became `withMeta`**, carrying the whole `meta` store rather than the description alone: zod v4 has a meta store of its own (`z.globalRegistry`), which `.meta()` writes to. DDB-TB's `SchemaMeta` is assignable to zod's `GlobalMeta`.
- **`z.ZodEffects` became `z.ZodPipe`.** A `.transform(fn)` yields `ZodPipe<SELF, ZodTransform<OUT, output<SELF>>>`, so transformers, non-strict tuples and `savedAs` attribute renaming all surface as pipes. The input side is reached with `.in` (`.innerType()` in v3).
- **One multi-value literal instead of a union of literals** for `boolean`/`number` enums: `z.literal([a, b, c])` is a single `ZodLiteral<a | b | c>`. This deletes v3's `ZodLiteralMap` helper. `string` enums stay `z.enum()` (`ZodEnum<util.ToEnum<…>>`), with a lone value still a literal.
- **`z.ZodTypeAny` became `z.ZodType`** — v4's loosest schema type.

## Files

- `index.ts` — the subpath barrel (`ZodParser` for now).
- `utils.ts` — `withValidate` and `withMeta`, applied by the type files (`item.ts` applies `withMeta` alone, as in v3), plus `SavedAsAttributes`.
- `parser/` — builds a zod schema for the write/input side (`ZodParser`): `schema.ts` dispatches, one file per schema type (`any.ts`, `null.ts`, `boolean.ts`, `number.ts`, `string.ts`, `binary.ts`, `set.ts`, `list.ts`, `tuple.ts`, `map.ts`, `record.ts`, `anyOf.ts`, `item.ts`), `types.ts` for `ZodParserOptions`, `utils.ts` for the `withX` wrappers.

`parser/utils.ts` holds the wrappers each type file applies, in this order: `withEncoding` (the schema's transformer), `withAttributeNameEncoding` (`savedAs`), `withValidate`, `withMeta`, `withDefault`, `withOptional`. Each takes `(schema, zodSchema, options)` and returns early.

Every type file has a colocated `*.unit.test.ts` asserting both the emitted type (`A.Equals`) and the runtime instance.

## Gotchas

- **`z.union([…])` infers a `readonly` tuple of options** (its type param is `const`), while `z.discriminatedUnion` does not. `anyOf.ts` has to say `readonly [...]` on the plain-union arm only.
- **`z.strictObject` and `z.object` are indistinguishable at the type level** (`$strict` and `$strip` are structurally identical), so `map.ts`/`item.ts` emit a bare `z.ZodObject<Shape>` and carry `strict` at runtime only. The tests assert `def.catchall` instead: a `ZodNever` when strict, `undefined` when stripped.
- **A discriminated union only accepts options that carry the discriminant**, which the loose `z.ZodType` of the recursion does not say — hence the documented double cast in `anyOf.ts`.
- **Three runtime casts remain**, all commented. Two are in `parser/utils.ts`: every schema type declares `transform?: unknown` in its props, so reading it as a `Transformer` is a cast, and the `savedAs` encoder is handed an `unknown` because zod types a `.transform` callback's argument as `unknown` at the call site. The third is in `parser/record.ts`, where the recursion types a record's key schema as the loose `z.ZodType`.
