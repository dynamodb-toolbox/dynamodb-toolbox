---
name: schema-and-data-shaping-design
description: >
  Define item, map, list, set, record, and anyOf schemas in dynamodb-toolbox,
  validate savedAs and hidden rules, and use parse and format actions without
  invalid schema combinations. Load this for schema design, nested attribute
  modeling, and schema check failures.
type: core
library: dynamodb-toolbox
library_version: "local"
sources:
  - "dynamodb-toolbox/dynamodb-toolbox:docs/docs/4-schemas/1-usage/index.md"
  - "dynamodb-toolbox/dynamodb-toolbox:src/schema/item/schema.ts"
  - "dynamodb-toolbox/dynamodb-toolbox:src/schema/map/schema.ts"
  - "dynamodb-toolbox/dynamodb-toolbox:src/schema/record/schema.ts"
---

# DynamoDB-Toolbox - Schema and Data-Shaping Design

Schemas describe DynamoDB item structure before an entity or command uses it. The important work is choosing the right schema kind and staying inside each kind's property rules.

## Setup

```ts
import { anyOf } from 'dynamodb-toolbox/schema/anyOf'
import { item } from 'dynamodb-toolbox/schema/item'
import { list } from 'dynamodb-toolbox/schema/list'
import { map } from 'dynamodb-toolbox/schema/map'
import { number } from 'dynamodb-toolbox/schema/number'
import { record } from 'dynamodb-toolbox/schema/record'
import { set } from 'dynamodb-toolbox/schema/set'
import { string } from 'dynamodb-toolbox/schema/string'

const profileSchema = item({
  pokemonId: string().key(),
  name: string().required('always'),
  tags: set(string()),
  moves: list(string()),
  stats: map({ hp: number(), atk: number() }),
  metadata: record(string(), string()),
  variant: anyOf(string().enum('normal'), string().enum('shiny'))
})

profileSchema.check('profile')
```

## Core Patterns

### Use `item` at entity roots

```ts
const pokemonSchema = item({
  pokemonId: string().key(),
  species: string(),
  level: number()
})
```

`item` is the normal root shape for entities.

### Use `map` for nested finite objects

```ts
const statsSchema = map({
  hp: number(),
  atk: number(),
  speed: number()
})
```

### Use `record` only when keys are open-ended

```ts
const labelsSchema = record(string(), string())
```

This is for arbitrary key sets with one value type.

## Common Mistakes

### HIGH Creating duplicate savedAs aliases

Wrong:

```ts
const schema = item({
  a: string().savedAs('value'),
  b: string().savedAs('value')
})
schema.check()
```

Correct:

```ts
const schema = item({
  a: string().savedAs('a_value'),
  b: string().savedAs('b_value')
})
schema.check()
```

Item and map schemas reject duplicate savedAs aliases because formatted attributes would collide.

Source: dynamodb-toolbox/dynamodb-toolbox:src/schema/item/schema.ts

### HIGH Treating list or set elements like full attributes

Wrong:

```ts
const schema = list(string().optional())
schema.check()
```

Correct:

```ts
const schema = list(string())
schema.check()
```

List and set elements cannot carry optional, hidden, savedAs, or default props like root attributes do.

Source: dynamodb-toolbox/dynamodb-toolbox:src/schema/list/schema.ts

### MEDIUM Using record key schemas with savedAs or key props

Wrong:

```ts
const schema = record(string().savedAs('k'), number())
schema.check()
```

Correct:

```ts
const schema = record(string(), number())
schema.check()
```

Record keys cannot be key, optional, hidden, savedAs, or defaulted.

Source: dynamodb-toolbox/dynamodb-toolbox:src/schema/record/schema.ts

## References

- [Schema property rules](references/schema-property-rules.md)