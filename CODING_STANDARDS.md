# Coding standards

The goal is a library that stays **light, typesafe and tree-shakable**. When two rules pull in different directions, pick the option that leaves less code to read.

Repository layout, casing, the `~/*` alias and the `.js` import extensions live in [CLAUDE.md](./CLAUDE.md) — this file is about the code itself.

1. [Type safety](#1-type-safety)
2. [Functions](#2-functions)
3. [Code organization](#3-code-organization)
4. [Keep the library light](#4-keep-the-library-light)

---

## 1. Type safety

### 1.1 Type as narrowly as possible

Literal unions over `string` / `number`. The narrower the type, the more bugs the compiler catches for free — and the better the inference users get.

❌ No-go

```ts
type Key = { name: string; type: string }
```

✅ Go

```ts
type KeyType = 'string' | 'binary' | 'number'
type Key<KEY_NAME extends string = string, KEY_TYPE extends KeyType = KeyType> = { name: KEY_NAME; type: KEY_TYPE }
```

### 1.2 Casts are a type-level escape hatch, not a runtime one

At runtime, narrow with a guard from `src/utils/validation/` (`isString`, `isObject`, …) and throw a `DynamoDBToolboxError` when it fails. Never `as`, never `!` to make a runtime value fit.

A cast is legitimate only where the compiler cannot follow a generic computation the code has already proven — the `XSchema_` builders, `Overwrite`, the DTO round trips, `options: OPTIONS = {} as OPTIONS`. When it isn't obvious why it holds, say so in one line. `as const` and `satisfies` are always fine: they narrow, they don't lie.

❌ No-go

```ts
const { partitionKey } = table.indexes[indexName] as GlobalIndex
```

✅ Go

```ts
if (!isArray(inputValue)) {
  throw new DynamoDBToolboxError('parsing.invalidAttributeInput', {
    message: `Attribute${path !== undefined ? ` '${path}'` : ''} should be a ${type}.`,
    path,
    payload: { received: inputValue, expected: type }
  })
}
```

### 1.3 Model variants as discriminated unions

Schemas discriminate on `type`, indexes on `type`, conditions on their operator. Give a new variant a discriminant rather than a bag of optional fields, then `switch` on it exhaustively (`noFallthroughCasesInSwitch` is on, and a non-nullable return type turns a missing branch into a compile error — that is the point).

❌ No-go

```ts
interface Index { local?: true; global?: true; partitionKey?: Key; sortKey?: Key }
```

✅ Go

```ts
type Index = LocalIndex | GlobalIndex // both carry `type: 'local' | 'global'`
```

### 1.4 Inference is the product — prove it with type tests

A change to a public signature comes with the matching `*.type.test.ts` assertions next to it. A runtime test that passes while inference silently widened to `any` is a regression that ships.

### 1.5 Name type parameters in `UPPER_SNAKE_CASE`

After what they hold (`SCHEMA`, `PARTITION_KEY`, `ENTITY_ATTRIBUTE_SAVED_AS`), so they stand out from the concrete types around them.

---

## 2. Functions

### 2.1 Avoid nesting

Flat code reads top to bottom. Use early returns, extract a function, and `switch` on the discriminant rather than chaining ternaries.

❌ No-go

```ts
if (isArray(inputValue)) {
  if (maxLength !== undefined) {
    if (inputValue.length > maxLength) {
      throw new DynamoDBToolboxError(…)
    }
  }
} else {
  throw new DynamoDBToolboxError(…)
}
```

✅ Go

```ts
if (!isArray(inputValue)) {
  throw new DynamoDBToolboxError(…)
}

if (maxLength !== undefined && inputValue.length > maxLength) {
  throw new DynamoDBToolboxError(…)
}
```

### 2.2 Two positional arguments at most, then an options object

The recursive actions take `(schema, value, options)` — follow that shape. Past the two obvious arguments, everything goes in a single options object and is destructured in the signature, so call sites stay self-documenting and argument order stops mattering.

❌ No-go

```ts
const parseList = (schema: ListSchema, value: unknown, fill: boolean, transform: boolean, valuePath?: (string | number)[]) => …
```

✅ Go

```ts
const parseList = (schema: ListSchema, value: unknown, { fill = true, transform = true, valuePath }: ParseAttrValueOptions = {}) => …
```

### 2.3 Pure functions

No hidden inputs: read `new Date()`, `Math.random()` and anything else side-effectful **once, at the entry point** (the command's `params()` / `send()`), and pass the value down. Everything below is then trivially testable without mocking the clock.

### 2.4 Name by what it does, make it reusable

Name a function after what it does, not where it is called from. Generic names lead to generic parameters, which lead to reuse, which means less code.

❌ No-go

```ts
const queryProjection = (entities: Entity[], attributes: string[]) => …
```

✅ Go

```ts
const buildProjectionExpression = (entities: Entity[], attributes: string[]) => …
```

### 2.5 Document the exported API only, by what it does

`jsdoc/require-jsdoc` enforces presence across `src/`. One sentence by default, three at most — needing more means the function does too much. Describe the input → output contract, never the caller: a doc that names a command or a use case goes stale as soon as a second caller appears. Don't restate the signature, and wrap type and keyword names in backticks. Non-exported functions are documented by their name alone.

❌ No-go

```ts
/** Called by QueryCommand and ScanCommand to format the items they get back. */
export const formatItems = (…) => …
```

✅ Go

```ts
/** Format saved items against the entities they belong to. */
export const formatItems = (…) => …
```

### 2.6 Comment only the quirks

Code should read on its own: clear structure, names that say what they hold. Comment only a non-obvious quirk of DynamoDB, of the AWS SDK or of the type system, which no name could convey — once, where it is handled. State the _why_, not the _what_; a comment restating the code is noise.

❌ No-go

```ts
// Loop over the parsers
for (const parser of parsers) { … }
```

✅ Go

```ts
// Multi-attribute keys (plural props) are only supported by aws-cdk-lib >= 2.226
```

### 2.7 Functions are verbs, booleans are questions

A function gets a verb (`parse`, `format`, `build`, `get`, `to…`). A boolean, and a function returning one, gets a yes/no question (`is`, `has`, `can`, `should`). Schema builders (`string()`, `list()`, `map()`) keep their own convention: they are the public DSL.

### 2.8 Declare values next to their use

Code used together is defined together. Declare a value right before the statement that uses it, not ahead of unrelated steps.

---

## 3. Code organization

### 3.1 A feature is a new `actions/<name>/` folder, not a method on a core class

That is what keeps the bundle small: users import only the actions they use. Adding a method to `Entity`, `Table` or `Schema` puts the code in everyone's bundle, so it needs a reason.

New public API is re-exported from `src/index.ts` **and** given its own subpath in `package.json` `exports`.

### 3.2 Mirror the anatomy of the folder you are in

Inside a folder, the same kind of code always lands in the same file, so a reader who knows one folder knows them all:

- `index.ts` — the barrel
- `schema.ts` / `<name>Command.ts` — the class
- `schema_.ts` — the warm builder variant
- `types.ts` — props and type helpers
- `constants.ts`, `errors.ts`, `options.ts`

Keep that predictability over merging look-alike code from different folders into one shared helper.

### 3.3 Share as low as possible, and only when needed

Don't extract a helper with a single caller. When a second one appears, move it to the lowest common ancestor (`actions/utils/`, then `src/utils/`), not straight to the root.

### 3.4 Colocate tests

`*.unit.test.ts` and `*.type.test.ts` sit next to the source they cover, never in a separate tree.

---

## 4. Keep the library light

### 4.1 The best code is the code that doesn't exist

Challenge a feature that costs a lot of API surface for little value. Propose the cheaper version first — a prop on an existing schema usually beats a new schema type.

### 4.2 Don't add a runtime dependency

The runtime dependency surface is deliberately one package (`hotscript`). Order of preference: **native** (`Array`, `Set`, `structuredClone`…) → **something already in `src/utils/`** → **a few lines of custom code**. A new runtime dependency needs an explicit decision, not a default; `peerDependencies` and `devDependencies` are a different matter.

### 4.3 Tree-shakability is a feature

An action imports the schema types it needs, never a sibling action it only half-uses: one import can drag the whole library into a user's bundle. Type-only imports are free — use `import type` (ESLint enforces it).

### 4.4 Test logic, not declarations

Unit-test the behaviour (parsing, formatting, condition building, edge cases) and type-test the inference. Don't write tautological tests that restate a constant, a barrel export or TypeScript's own behaviour.

### 4.5 Automate the standards

When a rule here can be enforced by `tsconfig`, ESLint or Prettier, enforce it there and keep the prose for what can't be automated.

### 4.6 Watch the signs of bloat

Alarms, not hard limits: when one trips, look for a split before adding more.

- A function over **100 lines**: extract sub-functions (the query/scan `params` builders are the cautionary tale).
- A file over **200 lines**: split it by what each part does.
- The same block in two actions: extract it to `actions/utils/` the second time it appears, not the third.
