# `src/schema` — Schema definitions

Schemas describe the **shape and types** of DynamoDB attributes. They are the foundation the rest of the library builds on: entities wrap an `item()` schema, and every read/write command uses schema actions to validate, transform, and format values.

## The value lifecycle

A single attribute value passes through several typed representations. The `types/` folder defines each stage; actions move values between them:

```
InputValue  --parse-->  ValidValue  -->  TransformedValue  ==stored==>  (DynamoDB)
                                                                              |
FormattedValue  <--format--  DecodedValue  <-------------------------------- +
```

- **InputValue** — what the user passes in (defaults/links not yet applied).
- **ValidValue** — after validation, defaults, and links.
- **TransformedValue** — after transformers (e.g. `prefix`), the shape actually saved.
- **DecodedValue** — a saved item with transformers reversed.
- **FormattedValue** — the app-facing shape after projection/formatting.

## Layout

```
schema/
├── index.ts        # Barrel: exports every builder fn + type re-exports
├── schema.ts       # SchemaAction base class (all actions extend it)
├── errors.ts
├── types/          # The value-lifecycle types + Schema type, props, paths, validator
├── utils/          # Schema helpers: defaults (static/dynamic), links reset, key checks, light clones
├── primitive/      # Shared logic for primitive types (any/null/boolean/number/string/binary)
│
│   # One folder per attribute type — each exports a builder fn + XSchema / XSchema_ classes
├── any/  null/  boolean/  number/  string/  binary/
├── set/  list/  tuple/  map/  record/
├── anyOf/          # union of schemas
├── item/           # the root object schema an Entity is built from
│
└── actions/        # Everything you can DO with a schema (see actions/CLAUDE.md)
```

## Attribute type folders

Every type folder (`string/`, `map/`, ...) follows the same pattern:

- `index.ts` — barrel.
- `schema.ts` — the resolved `XSchema` class.
- `schema_.ts` — the `XSchema_` "builder" variant returned during definition (carries `.required()`, `.optional()`, `.default()`, `.transform()`, ... fluent methods; `_` = warm/mutable form).
- `resolve.ts` — resolves the declared type to its runtime TS type.
- `types.ts` — props/type helpers.

Builder functions are lowercase (`string()`, `number()`, `map()`, `anyOf()`, `item()`). `nul()` is the null builder (`null` is reserved). Each type also has a subpath export: `dynamodb-toolbox/schema/<type>`.

## Conventions

- **`SchemaAction` base** (`schema.ts`) is trivial — holds `.schema` and a static `actionName`. Every action extends it.
- Recursive actions (`parse`, `format`) have **one file per schema type** (`any.ts`, `map.ts`, `list.ts`, ...) implementing that type's branch of the recursion, plus a `schema.ts`/entry that dispatches.
- Adding a new attribute type = new folder mirroring an existing one + wire into `index.ts` + handle it in each recursive action.
