# CLAUDE.md

Guidance for working in the DynamoDB-Toolbox repository.

## What this is

DynamoDB-Toolbox is a lightweight, type-safe query builder for DynamoDB in TypeScript. It sits on top of the AWS SDK (`@aws-sdk/client-dynamodb` + `@aws-sdk/lib-dynamodb`, both peer deps) and provides schema definition, validation, parsing/formatting, and command builders for DynamoDB operations — with full type inference.

- Homepage / docs: https://www.dynamodbtoolbox.com
- Runtime dep: `hotscript` only (type-level functions). Everything else is dev/peer.
- Ships dual ESM + CJS builds. Node >= 18.

## Project Board

Tasks are tracked on a Notion board: https://app.notion.com/p/thomasaribart/3ab0336842e88019bf40e6af72509946?v=3ab0336842e880bfbf36000c3bc70daa

Connect to it via the Notion MCP (`mcp__claude_ai_Notion__*` tools) to read or update tasks.

## Core architecture: the Action pattern

The whole library is built around three primitives — **Schema**, **Table**, **Entity** (plus **Database**, a group of tables) — and **Actions**.

An **Action** is a method extracted into its own tree-shakable class. Instead of `entity.get(...)`, you write `entity.build(GetItemCommand).send(...)`. Each action:

- lives in its own `actions/<name>/` folder,
- extends a base action class (`SchemaAction`, `TableAction`, `EntityAction`),
- can be imported separately through a deep import: `import { EntityParser } from 'dynamodb-toolbox/entity/actions/parse'`

This keeps the bundle small — you only import the actions you use. Base classes are tiny, e.g.:

```ts
// src/schema/schema.ts
export class SchemaAction<SCHEMA extends Schema = Schema> {
  static actionName: string
  constructor(readonly schema: SCHEMA) {}
}
```

When adding a feature, the near-universal move is: **create a new `actions/<name>/` folder**, not add a method to the core class.

## Repository layout

```
src/
├── index.ts          # Public API barrel — every export re-exported here
├── schema/           # Schema definition (the shape/types of attributes)
├── entity/           # Entities = typed items living in a table
├── table/            # Table definition (keys, indexes, document client)
├── database/         # A group of tables
├── transformers/     # Reversible value encoders (prefix, suffix, trim, jsonStringify, ...)
├── options/          # Shared command option parsers (capacity, limit, select, ...)
├── errors/           # DynamoDBToolboxError + typed error blueprints
├── types/            # Type-level utilities (compute, merge, omit, narrow, ...)
└── utils/            # Runtime helpers (chunk, cloneDeep, pick, validation, ...)

docs/                 # Docusaurus documentation site (see below)
dist/                 # Build output (esm/ + cjs/) — generated, do not edit
```

### `schema/` — how to define DDB-TB schemas

Attribute type builders, each in its own folder with matching subpath export (`dynamodb-toolbox/schema/<type>`):

`any`, `null`, `boolean`, `number`, `string`, `binary`, `set`, `list`, `tuple`, `map`, `record`, `anyOf`, `item`, plus `primitive/` (shared primitive logic).

- `schema.ts` — `SchemaAction` base class.
- `index.ts` — exports the builder fns (`string()`, `number()`, ...) and their classes.
- `actions/` — everything you can _do_ with a schema (tree-shakable):
  - `parse` (`Parser`) — validate + transform input toward DynamoDB.
  - `format` (`Formatter`) — read/decode DynamoDB values back to app shape.
  - `parseCondition` (`ConditionParser`), `parsePaths` (`PathParser`).
  - `jsonSchemer` (`JSONSchemer`) — export to JSON Schema.
  - `zodSchemer` — convert DDB-TB schema → Zod; `fromZodSchema` — Zod → DDB-TB.
  - `dto` / `fromDTO` — serialize a schema to/from a JSON DTO.
  - `finder` — locate sub-schemas by path.

### `entity/` — the shape of DynamoDB items

An **Entity** binds an item schema to a Table. `entity.ts` is the core class; `decorator.ts`, `constants.ts`, internal-attribute logic live alongside.

`entity/actions/` — everything you can do with an entity:

- **Item commands:** `get`, `put`, `update`, `updateAttributes`, `delete`.
- **Batch:** `batchGet`, `batchPut`, `batchDelete` (build requests fed to a Table batch command).
- **Transactions:** `transactGet`, `transactPut`, `transactUpdate`, `transactDelete`, `transactCheck`, plus `transactWrite` (executor).
- **Parsing/formatting:** `parse` (`EntityParser`), `format`, `parseCondition`, `parsePaths`.
- **Other:** `accessPattern`, `spy` (test mocking), `repository`, `dto` / `fromDTO`.

`update` also exports symbols/extensions (`$set`, `$get`, `$add`, `$sum`, `$append`, ...) under `entity/actions/update/symbols`.

### `table/` — how to define a table

`table.ts` holds the `Table` class (partition/sort keys, indexes, `documentClient`, `tableName`). `actions/indexes.ts` types GSIs/LSIs.

`table/actions/` — everything you can do with a table:

- **Reads:** `query`, `scan`.
- **Writes:** `batchGet`, `batchWrite`, `deletePartition`.
- **Other:** `accessPattern`, `parsePrimaryKey`, `spy`, `repository`, `registry` (entity registry), `dto` / `fromDTO`.

### `database/` — a group of tables

`database.ts` defines a `Database`. `database/actions/`:

- `synchronize` — sync schemas (e.g. to a remote registry).
- `mcpToolkit` — expose the database over MCP (uses `@modelcontextprotocol/sdk`).

### `transformers/`

Reversible `{ encode, decode }` codecs applied to attribute values: `prefix`, `suffix`, `trim`, `jsonStringify`, and `pipe` (compose). `transformer.ts` defines the `Transformer` / `SerializableTransformer` interfaces. Each has its own subpath export.

### Supporting dirs

- `options/` — reusable parsers for command options shared across actions (`capacity`, `consistent`, `limit`, `maxPages`, `metrics`, `returnValues`, `select`, ...).
- `errors/` — `DynamoDBToolboxError` (single error class), `blueprint.ts` + `allErrors.ts` for typed error codes.
- `types/` — pure type-level utilities (no runtime).
- `utils/` — small runtime helpers + `validation/` (`isString`, etc.).

## Conventions

- **Casing:**
  - **Generics / type parameters** — `UPPER_SNAKE_CASE` (e.g. `SCHEMA`, `PARTITION_KEY`, `ENTITY_ATTRIBUTE_SAVED_AS`).
  - **Classes & types** — `PascalCase` (e.g. `Entity`, `GetItemCommand`, `FormattedItem`).
  - **Functions, variables, values** — `camelCase` (e.g. `string()`, `fromSchemaDTO`, `documentClient`).
- **Path alias:** `~/*` → `src/*` (see `tsconfig.json`). Import as `~/schema/index.js`.
- **`.js` extensions in imports** — required for ESM output even though sources are `.ts`.
- **Every folder has an `index.ts` barrel.** New public API must also be re-exported from `src/index.ts` **and** given a subpath in `package.json` `exports`.
- **Two class variants:** many schema types export both `XSchema` and `XSchema_` (the `_` variant is the "warm"/builder form used during definition).
- **Test files sit next to source:**
  - `*.unit.test.ts` — runtime unit tests (Vitest).
  - `*.type.test.ts` — type-level tests (`tsd` / `tsc`).

## Commands

```bash
npm test              # full suite: type + format + unit + lint + exports
npm run test-type     # tsc --noEmit
npm run test-unit     # vitest run
npm run test-unit-watch
npm run test-format   # prettier --check   (test-format-fix to write)
npm run test-lint     # eslint
npm run test-exports  # attw — validates package.json exports resolve
npm run build         # build:cjs + build:esm into dist/
```

Run `test-unit` filtered to a folder when iterating, then the full `npm test` before finishing.

## Documentation

`docs/` is a Docusaurus site. Prose docs live in `docs/docs/`, organized to mirror the concepts.

Each schema type and action has a corresponding doc page (e.g. `4-schemas/18-actions`, `4-schemas/19-transformers`). **When adding or changing a feature, update the matching doc page.** Read these pages to understand intended behavior before changing code.
