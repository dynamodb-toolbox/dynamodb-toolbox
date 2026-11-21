# `src/schema/actions` — Schema actions

Actions are the tree-shakable operations you can run on a schema. Each is a class extending `SchemaAction` (`../schema.ts`) with a static `actionName`, constructed with a schema and invoked via `schema.build(ActionClass)`. Import only what you use — each action has its own subpath export (`dynamodb-toolbox/schema/actions/<name>`).

```ts
const parser = mySchema.build(Parser)          // SchemaAction subclass
const { key, item } = parser.parse(input)
```

## The actions

| Folder | Export | Purpose |
| --- | --- | --- |
| `parse` | `Parser` | Validate + transform an **input** value → valid → transformed (the write path). |
| `format` | `Formatter` | Decode + format a **saved** value back to the app shape (the read path), with projection. |
| `parseCondition` | `ConditionParser` | Build a DynamoDB `ConditionExpression` (+ names/values) from a `SchemaCondition`. |
| `parsePaths` | `PathParser` | Build a `ProjectionExpression` (+ names) from attribute paths. |
| `jsonSchemer` | `JSONSchemer` | Convert a schema → JSON Schema (of the formatted value). |
| `dto` | `SchemaDTO` | Serialize a schema → JSON DTO (portable definition). |
| `fromDTO` | `fromSchemaDTO` | Rebuild a schema from a DTO (inverse of `dto`). |
| `zodSchemer/v3` | `ZodSchemer` | Derive zod v3 schemas (`ZodParser` / `ZodFormatter`) from a DDB-TB schema. |
| `zodSchemer/v4` | `ZodParser` | Same, for zod v4 schemas — parser side only so far, subpath not published yet. |
| `zodSchemer` | `ZodSchemer` | Deprecated alias of `zodSchemer/v3`. |
| `fromZodSchema/v3` | `fromZodSchema` | Convert a zod v3 schema → DDB-TB schema (inverse direction). |
| `fromZodSchema/v4` | `fromZodSchema` | Same, for zod v4 schemas (Classic or Mini). |
| `fromZodSchema` | `fromZodSchema` | Deprecated alias of `fromZodSchema/v3`, plus the error codes both versions share. |
| `finder` | `Finder` | Locate sub-schemas at a given path (used by path/condition logic). |
| `utils` | — | Shared internals: path parsing/formatting, deduper, errors. Not a public action. |
| `errors.ts` | — | Shared action error codes. |

## Recursive actions

`parse` and `format` are structural recursions over the schema tree, so they have **one file per schema type** (`any.ts`, `anyOf.ts`, `primitive.ts`, `set.ts`, `list.ts`, `tuple.ts`, `map.ts`, `record.ts`, `item.ts`) plus a `schema.ts`/entry dispatcher and `options.ts`. When adding a new attribute type, add its branch to both.

Each action folder has its own `CLAUDE.md` with details.
