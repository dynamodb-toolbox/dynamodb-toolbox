---
name: single-table-modeling-from-scratch
description: >
  Define one DynamoDB table with multiple entities, internal entity tagging,
  default timestamps, key mapping, computeKey, and multi-attribute indexes.
  Load this when building a single-table model, choosing entityAttribute or
  timestamps behavior, or deciding between direct key mapping and computeKey.
type: core
library: dynamodb-toolbox
library_version: "local"
sources:
  - "dynamodb-toolbox/dynamodb-toolbox:docs/docs/2-tables/1-usage/index.md"
  - "dynamodb-toolbox/dynamodb-toolbox:docs/docs/2-tables/2-actions/2-query/index.md"
  - "dynamodb-toolbox/dynamodb-toolbox:docs/docs/3-entities/1-usage/index.md"
  - "dynamodb-toolbox/dynamodb-toolbox:docs/docs/3-entities/2-internal-attributes/index.md"
  - "dynamodb-toolbox/dynamodb-toolbox:src/entity/entity.ts"
---

# DynamoDB-Toolbox - Single-Table Modeling From Scratch

Use this skill when a single physical DynamoDB table stores multiple item types. The core decisions are table keys and indexes, entity boundaries, and whether the default internal attributes should remain enabled.

## Setup

```ts
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import { Entity } from 'dynamodb-toolbox/entity'
import { item } from 'dynamodb-toolbox/schema/item'
import { number } from 'dynamodb-toolbox/schema/number'
import { string } from 'dynamodb-toolbox/schema/string'
import { Table } from 'dynamodb-toolbox/table'

const client = new DynamoDBClient({ region: 'us-east-1' })
const documentClient = DynamoDBDocumentClient.from(client)

const AppTable = new Table({
  name: 'app-table',
  documentClient,
  partitionKey: { name: 'pk', type: 'string' },
  sortKey: { name: 'sk', type: 'string' },
  indexes: {
    byTrainerAndYear: {
      type: 'global',
      partitionKeys: {
        trainerId: { type: 'string' },
        captureYear: { type: 'number' }
      }
    }
  }
})

const PokemonEntity = new Entity({
  name: 'POKEMON',
  table: AppTable,
  schema: item({
    trainerId: string().key(),
    pokemonId: string().key(),
    captureYear: number(),
    pk: string().key().link<typeof PokemonEntity['schema']>(({ trainerId }) => `TRAINER#${trainerId}`),
    sk: string().key().link<typeof PokemonEntity['schema']>(({ pokemonId }) => `POKEMON#${pokemonId}`)
  }),
  entityAttribute: true,
  timestamps: true
})
```

## Core Patterns

### Keep the default internal attributes unless you have a reason to change them

`entity` is hidden by default and saved as `_et`. `created` and `modified` are enabled by default and saved as `_ct` and `_md`. Those defaults help mixed-entity reads and reduce boilerplate.

### Use `computeKey` when the schema keys do not directly fit the table schema

```ts
const UserEntity = new Entity({
  name: 'USER',
  table: AppTable,
  schema: item({
    userId: string().key(),
    orgId: string().key()
  }),
  computeKey: ({ userId, orgId }) => ({
    pk: `ORG#${orgId}`,
    sk: `USER#${userId}`
  })
})
```

### Prefer multi-attribute indexes when DynamoDB supports the shape directly

Multi-attribute GSIs let you index natural attributes directly instead of inventing synthetic concatenated keys. That keeps writes simpler, preserves type-safety on each attribute, and makes new access patterns easier to add later because DynamoDB indexes the existing attributes directly.

```ts
const table = new Table({
  name: 'app-table',
  documentClient,
  partitionKey: { name: 'pk', type: 'string' },
  indexes: {
    byTrainerAndYear: {
      type: 'global',
      partitionKeys: {
        trainerId: { type: 'string' },
        captureYear: { type: 'number' }
      }
    }
  }
})
```

Use string concatenation only when the physical index really requires it.

### Query multi-attribute GSIs with arrays, not synthetic key strings

When a GSI uses `partitionKeys` or `sortKeys`, DynamoDB-Toolbox expects arrays in key order.

```ts
const TournamentTable = new Table({
  name: 'tournament-matches',
  documentClient,
  partitionKey: { name: 'matchId', type: 'string' },
  indexes: {
    TournamentRegionIndex: {
      type: 'global',
      partitionKeys: [
        { name: 'tournamentId', type: 'string' },
        { name: 'region', type: 'string' }
      ],
      sortKeys: [
        { name: 'round', type: 'string' },
        { name: 'bracket', type: 'string' },
        { name: 'matchId', type: 'string' }
      ]
    }
  }
})

const { Items } = await TournamentTable.build(QueryCommand)
  .query({
    index: 'TournamentRegionIndex',
    partition: ['WINTER2024', 'NA-EAST'],
    range: ['SEMIFINALS', 'UPPER', { gte: 'match-002' }]
  })
  .send()
```

### Follow the multi-attribute query rules exactly

- Supply every multi-attribute partition key component with equality semantics.
- Query sort key components from left to right with no gaps.
- Once you use an inequality or `begins_with`, it must be the final sort-key condition.

Examples:

- Valid: `partition: ['WINTER2024', 'NA-EAST']`
- Valid: `range: ['SEMIFINALS']`
- Valid: `range: ['SEMIFINALS', 'UPPER']`
- Valid: `range: ['SEMIFINALS', 'UPPER', { gte: 'match-002' }]`
- Invalid: `partition: ['WINTER2024']`
- Invalid: `range: ['SEMIFINALS', 'match-002']`
- Invalid: `range: [{ gte: 'SEMIFINALS' }, 'UPPER']`

## Common Mistakes

### HIGH Disabling entity tagging in single-table flows

Wrong:

```ts
const entity = new Entity({
  name: 'POKEMON',
  table: AppTable,
  entityAttribute: false,
  schema
})
```

Correct:

```ts
const entity = new Entity({
  name: 'POKEMON',
  table: AppTable,
  entityAttribute: true,
  schema
})
```

Disabling entity tagging removes the cheapest entity-aware filter path and makes mixed-entity formatting rely on fallback probing.

Source: dynamodb-toolbox/dynamodb-toolbox:docs/docs/3-entities/2-internal-attributes/index.md

### CRITICAL Skipping computeKey when the schema does not fit

Wrong:

```ts
const entity = new Entity({
  name: 'POKEMON',
  table: AppTable,
  schema: item({ trainerId: string().key(), pokemonId: string().key() })
})
```

Correct:

```ts
const entity = new Entity({
  name: 'POKEMON',
  table: AppTable,
  schema: item({ trainerId: string().key(), pokemonId: string().key() }),
  computeKey: ({ trainerId, pokemonId }) => ({
    pk: `TRAINER#${trainerId}`,
    sk: `POKEMON#${pokemonId}`
  })
})
```

If the schema key attributes do not validate directly against the table key schema, entity construction fails without `computeKey`.

Source: dynamodb-toolbox/dynamodb-toolbox:src/entity/entity.ts

### HIGH Renaming an entity after it already has data

Wrong:

```ts
const entity = new Entity({
  name: 'POKEMON_V2',
  table: AppTable,
  schema
})
```

Correct:

```ts
const entity = new Entity({
  name: 'POKEMON',
  table: AppTable,
  schema
})
```

Changing `name` after items exist is a data-migration concern because the entity marker is part of persisted item identity.

Source: dynamodb-toolbox/dynamodb-toolbox:docs/docs/3-entities/1-usage/index.md

### HIGH Colliding with default internal attributes

Wrong:

```ts
const entity = new Entity({
  name: 'POKEMON',
  table: AppTable,
  schema: item({
    entity: string(),
    created: string(),
    modified: string()
  })
})
```

Correct:

```ts
const entity = new Entity({
  name: 'POKEMON',
  table: AppTable,
  entityAttribute: { name: '__entity__', hidden: false },
  timestamps: {
    created: { name: 'createdAt' },
    modified: { name: 'updatedAt' }
  },
  schema: item({
    createdAt: string(),
    updatedAt: string()
  })
})
```

Toolbox injects `entity`, `created`, and `modified` by default, so reusing those names or savedAs slots causes reserved-attribute conflicts.

Source: dynamodb-toolbox/dynamodb-toolbox:src/entity/utils/buildEntitySchema/buildEntitySchema.ts

### MEDIUM String-concatenating multi-attribute indexes unnecessarily

Wrong:

```ts
indexes: {
  byTrainerAndYear: {
    type: 'global',
    partitionKey: { name: 'gsi1pk', type: 'string' },
    sortKey: { name: 'gsi1sk', type: 'string' }
  }
}
```

Correct:

```ts
indexes: {
  byTrainerAndYear: {
    type: 'global',
    partitionKeys: {
      trainerId: { type: 'string' },
      captureYear: { type: 'number' }
    }
  }
}
```

When DynamoDB supports the multi-attribute shape directly, extra string concatenation adds avoidable complexity and drift.

Source: maintainer interview

### HIGH Querying multi-attribute indexes as if they were concatenated strings

Wrong:

```ts
await TournamentTable.build(QueryCommand)
  .query({
    index: 'TournamentRegionIndex',
    partition: 'WINTER2024#NA-EAST',
    range: 'SEMIFINALS#UPPER#match-002'
  })
  .send()
```

Correct:

```ts
await TournamentTable.build(QueryCommand)
  .query({
    index: 'TournamentRegionIndex',
    partition: ['WINTER2024', 'NA-EAST'],
    range: ['SEMIFINALS', 'UPPER', 'match-002']
  })
  .send()
```

For native multi-attribute GSIs, Toolbox query values map to attribute arrays in key order. Generating concatenated strings reintroduces the exact synthetic-key coupling that the feature removes.

Source: dynamodb-toolbox/dynamodb-toolbox:docs/docs/2-tables/2-actions/2-query/index.md

### HIGH Skipping key components or placing inequalities too early in a multi-attribute query

Wrong:

```ts
await TournamentTable.build(QueryCommand)
  .query({
    index: 'TournamentRegionIndex',
    partition: ['WINTER2024', 'NA-EAST'],
    range: ['SEMIFINALS', { gte: 'match-002' }]
  })
  .send()
```

Correct:

```ts
await TournamentTable.build(QueryCommand)
  .query({
    index: 'TournamentRegionIndex',
    partition: ['WINTER2024', 'NA-EAST'],
    range: ['SEMIFINALS', 'UPPER', { gte: 'match-002' }]
  })
  .send()
```

Multi-attribute sort keys are queried left to right. You cannot skip `bracket` and then constrain `matchId`, and once an inequality appears it must be the last sort-key condition.

Source: dynamodb-toolbox/dynamodb-toolbox:docs/docs/2-tables/2-actions/2-query/index.md

## References

- [Table and entity options](references/table-entity-options.md)
- [Multi-attribute indexes](references/multi-attribute-indexes.md)