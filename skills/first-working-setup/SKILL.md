---
name: first-working-setup
description: >
  Install dynamodb-toolbox with @aws-sdk/client-dynamodb and
  @aws-sdk/lib-dynamodb, enable strict TypeScript settings, attach a
  DynamoDBDocumentClient to a Table, and send a first command successfully.
  Load this for initial setup, first examples, and missing documentClient or
  table name errors.
type: lifecycle
library: dynamodb-toolbox
library_version: "local"
sources:
  - "dynamodb-toolbox/dynamodb-toolbox:docs/docs/1-getting-started/2-installation/index.md"
  - "dynamodb-toolbox/dynamodb-toolbox:docs/docs/1-getting-started/3-usage/index.md"
  - "dynamodb-toolbox/dynamodb-toolbox:src/table/table.ts"
---

# DynamoDB-Toolbox - First Working Setup

Use DynamoDB-Toolbox as a modeling and request-building layer on top of the AWS SDK DocumentClient. Start with a real `DynamoDBDocumentClient`, one `Table`, one `Entity`, and one command sent end to end.

## Setup

```ts
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import { Entity } from 'dynamodb-toolbox/entity'
import { GetItemCommand } from 'dynamodb-toolbox/entity/actions/get'
import { string } from 'dynamodb-toolbox/schema/string'
import { item } from 'dynamodb-toolbox/schema/item'
import { Table } from 'dynamodb-toolbox/table'

const client = new DynamoDBClient({ region: 'us-east-1' })
const documentClient = DynamoDBDocumentClient.from(client)

const PokeTable = new Table({
  name: 'poke-table',
  documentClient,
  partitionKey: { name: 'pk', type: 'string' },
  sortKey: { name: 'sk', type: 'string' }
})

const PokemonEntity = new Entity({
  name: 'POKEMON',
  table: PokeTable,
  schema: item({
    pokemonId: string().savedAs('pk').key(),
    species: string().savedAs('sk').key(),
    level: string()
  })
})

await PokemonEntity.build(GetItemCommand)
  .key({ pokemonId: '001', species: 'PIKACHU' })
  .send()
```

## Core Patterns

### Use deep action imports for smaller entry points

```ts
import { PutItemCommand } from 'dynamodb-toolbox/entity/actions/put'

await PokemonEntity.build(PutItemCommand)
  .item({ pokemonId: '001', species: 'PIKACHU', level: '10' })
  .send()
```

Deep imports align with the library's tree-shakable action model.

### Set table name at construction or per command

```ts
const TenantTable = new Table({
  documentClient,
  partitionKey: { name: 'pk', type: 'string' }
})

await TenantTable.build(GetItemCommand as never)
```

For real sendable commands, either provide `name` on the table or pass `tableName` through command options when the docs allow it.

### Keep TypeScript strict

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "strict": true
  }
}
```

Strict mode preserves the inference that makes Toolbox valuable.

## Common Mistakes

### CRITICAL Sending commands without a document client

Wrong:

```ts
const table = new Table({
  name: 'poke-table',
  partitionKey: { name: 'pk', type: 'string' }
})
```

Correct:

```ts
const table = new Table({
  name: 'poke-table',
  documentClient,
  partitionKey: { name: 'pk', type: 'string' }
})
```

Table send paths call `getDocumentClient()` and fail at runtime if no client is attached.

Source: dynamodb-toolbox/dynamodb-toolbox:src/table/table.ts

### HIGH Omitting the table name entirely

Wrong:

```ts
const table = new Table({
  documentClient,
  partitionKey: { name: 'pk', type: 'string' }
})
```

Correct:

```ts
const table = new Table({
  name: 'poke-table',
  documentClient,
  partitionKey: { name: 'pk', type: 'string' }
})
```

The constructor permits omission, but send paths fail later unless a table name is provided through constructor or options.

Source: dynamodb-toolbox/dynamodb-toolbox:src/table/table.ts

### MEDIUM Using non-strict TypeScript settings

Wrong:

```json
{
  "compilerOptions": {
    "strict": false
  }
}
```

Correct:

```json
{
  "compilerOptions": {
    "strict": true
  }
}
```

The docs explicitly call out strict mode because loose settings degrade inference and hide contract mistakes.

Source: dynamodb-toolbox/dynamodb-toolbox:docs/docs/1-getting-started/2-installation/index.md