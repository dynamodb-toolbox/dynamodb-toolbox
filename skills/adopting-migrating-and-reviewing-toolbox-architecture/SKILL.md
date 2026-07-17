---
name: adopting-migrating-and-reviewing-toolbox-architecture
description: >
  Migrate older dynamodb-toolbox code to current APIs, review whether a
  codebase is using the right abstraction level, and catch legacy patterns
  like freeze-era schemas, old attr naming, and outdated transformer
  parse/format APIs.
type: lifecycle
library: dynamodb-toolbox
library_version: "local"
sources:
  - "dynamodb-toolbox/dynamodb-toolbox:docs/versioned_docs/version-v1/6-migration-guide/index.md"
  - "dynamodb-toolbox/dynamodb-toolbox:docs/versioned_docs/version-v0.9/9-migration-guide/index.md"
  - "dynamodb-toolbox/dynamodb-toolbox:src/transformers/index.ts"
  - "dynamodb-toolbox/dynamodb-toolbox:src/schema/index.ts"
---

# DynamoDB-Toolbox - Adopting, Migrating, and Reviewing Toolbox Architecture

Use this skill when reviewing whether a codebase uses current Toolbox patterns coherently. Treat migration work as both API correction and architecture review: abstraction choice, internal attributes, schema patterns, and generated code quality all interact.

## Setup

```ts
import { string } from 'dynamodb-toolbox/schema/string'
import { item } from 'dynamodb-toolbox/schema/item'
import { Parser } from 'dynamodb-toolbox/schema/actions/parse'

const pokemonSchema = item({
  name: string()
})

pokemonSchema.build(Parser).parse({ name: 'Pikachu' })
```

## Core Patterns

### Prefer current schema entry points

```ts
import { schema, s } from 'dynamodb-toolbox/schema'
import { item } from 'dynamodb-toolbox/schema/item'
```

### Prefer current transformer names

```ts
const transformer = {
  encode: (value: string) => `P#${value}`,
  decode: (value: string) => value.slice(2)
}
```

### Review abstraction level, not just syntax

If a generated example reaches for `Database` or repositories immediately, verify that the code actually needs that level instead of command builders.

## Common Mistakes

### CRITICAL Using freeze-era schemas in current Toolbox

Wrong:

```ts
const schema = string().freeze()
schema.build(Parser).parse('pikachu')
```

Correct:

```ts
string().build(Parser).parse('pikachu')
```

Schemas no longer require a warm-then-freeze lifecycle; this is fixed but remains a legacy-risk pattern in older examples.

Source: dynamodb-toolbox/dynamodb-toolbox:docs/versioned_docs/version-v1/6-migration-guide/index.md

### HIGH Using old `attr` or pre-v2 schema naming

Wrong:

```ts
import { attr, schema } from 'dynamodb-toolbox/legacy'
```

Correct:

```ts
import { schema, s } from 'dynamodb-toolbox/schema'
import { item } from 'dynamodb-toolbox/schema/item'
```

Older naming conventions are still easy for agents to hallucinate from outdated examples.

Source: dynamodb-toolbox/dynamodb-toolbox:docs/versioned_docs/version-v1/6-migration-guide/index.md

### HIGH Using transformer `parse` and `format` names after the rename

Wrong:

```ts
const transformer = {
  parse: (value: string) => `P#${value}`,
  format: (value: string) => value.slice(2)
}
```

Correct:

```ts
const transformer = {
  encode: (value: string) => `P#${value}`,
  decode: (value: string) => value.slice(2)
}
```

Transformer naming changed, and stale examples still surface in generated code.

Source: dynamodb-toolbox/dynamodb-toolbox:docs/versioned_docs/version-v1/6-migration-guide/index.md