---
name: queries-scans-and-access-patterns
description: >
  Use QueryCommand, ScanCommand, and AccessPattern in dynamodb-toolbox with
  correct partition and range setup, projections, pagination, and bounded
  maxPages. Load this when implementing read paths from table or index access
  requirements rather than point reads.
type: core
library: dynamodb-toolbox
library_version: "local"
sources:
  - "dynamodb-toolbox/dynamodb-toolbox:docs/docs/2-tables/2-actions/1-scan/index.md"
  - "dynamodb-toolbox/dynamodb-toolbox:docs/docs/2-tables/2-actions/2-query/index.md"
  - "dynamodb-toolbox/dynamodb-toolbox:docs/docs/3-entities/4-actions/2-access-pattern/index.md"
  - "dynamodb-toolbox/dynamodb-toolbox:src/table/actions/query/queryParams/parseQuery.ts"
---

# DynamoDB-Toolbox - Queries, Scans, and Access Patterns

Use this skill when a read spans more than one known item key. The important work is correct partition and range modeling, index choice, projection shape, and pagination limits.

## Setup

```ts
import { QueryCommand } from 'dynamodb-toolbox/table/actions/query'
import { ScanCommand } from 'dynamodb-toolbox/table/actions/scan'

await AppTable.build(QueryCommand)
  .entities(PokemonEntity)
  .query({ partition: 'TRAINER#ash' })
  .options({ maxPages: 2, attributes: ['pokemonId', 'captureYear'] })
  .send()

await AppTable.build(ScanCommand)
  .entities(PokemonEntity)
  .options({ limit: 25 })
  .send()
```

## Core Patterns

### Start with the partition key, then add range conditions

```ts
await AppTable.build(QueryCommand)
  .entities(PokemonEntity)
  .query({
    partition: 'TRAINER#ash',
    range: { beginsWith: 'POKEMON#' }
  })
  .send()
```

### Bound pagination explicitly

```ts
await AppTable.build(QueryCommand)
  .entities(PokemonEntity)
  .query({ partition: 'TRAINER#ash' })
  .options({ maxPages: 3 })
  .send()
```

### Treat AccessPattern as a wrapper over a correct PK/range model

If an `AccessPattern` exists, its correctness still depends on the underlying partition and range setup.

## Common Mistakes

### CRITICAL Building a query without a valid partition clause

Wrong:

```ts
await AppTable.build(QueryCommand)
  .query({ range: { beginsWith: 'POKEMON#' } })
  .send()
```

Correct:

```ts
await AppTable.build(QueryCommand)
  .query({ partition: 'TRAINER#ash', range: { beginsWith: 'POKEMON#' } })
  .send()
```

Toolbox validates query shape and rejects range-only query input.

Source: dynamodb-toolbox/dynamodb-toolbox:src/table/actions/query/queryParams/parseQuery.ts

### MEDIUM Treating scans as a cheaper convenience query

Wrong:

```ts
await AppTable.build(ScanCommand)
  .options({ limit: 1000 })
  .send()
```

Correct:

```ts
await AppTable.build(QueryCommand)
  .query({ partition: 'TRAINER#ash' })
  .send()
```

Scans can be valid, but they do not become cheaper just because the API is easier to call.

Source: dynamodb-toolbox/dynamodb-toolbox:docs/docs/2-tables/2-actions/1-scan/index.md

### MEDIUM Using invalid projection shapes

Wrong:

```ts
await AppTable.build(QueryCommand)
  .entities(PokemonEntity)
  .options({ attributes: ['missingField'] })
  .send()
```

Correct:

```ts
await AppTable.build(QueryCommand)
  .entities(PokemonEntity)
  .options({ attributes: ['pokemonId', 'captureYear'] })
  .send()
```

Projection parsing is strict about attribute names and entity-aware selection.

Source: dynamodb-toolbox/dynamodb-toolbox:src/table/actions/query/queryParams/queryParams.ts

### HIGH Using `maxPages: Infinity` in normal application code

Wrong:

```ts
await AppTable.build(QueryCommand)
  .query({ partition: 'TRAINER#ash' })
  .options({ maxPages: Infinity })
  .send()
```

Correct:

```ts
await AppTable.build(QueryCommand)
  .query({ partition: 'TRAINER#ash' })
  .options({ maxPages: 3 })
  .send()
```

Unbounded page traversal turns one logical read into repeated requests and is a bad default for app paths.

Source: maintainer interview

## References

- [Query and scan options](references/query-scan-options.md)