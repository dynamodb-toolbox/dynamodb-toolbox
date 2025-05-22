---
title: KV Store
---

# Simple Key-Value Store

In this guide, we’ll build a simple [Key-Value Store](https://en.wikipedia.org/wiki/Key%E2%80%93value_database) to store `Pokemons` using their `pokemonId` as the key.

## Create an Entity

### 1. Define the Table

We first have to instanciate a [Table](../../2-tables/1-usage/index.md) that matches our deployed configuration:

```typescript
import { Table } from 'dynamodb-toolbox/table'
// 👇 Peer dependencies
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

const dynamoDBClient = new DynamoDBClient()

const PokeTable = new Table({
  // 👇 DynamoDB config.
  name: 'poke-table',
  partitionKey: { name: 'pokemonId', type: 'string' },
  // 👇 Inject the client
  documentClient:
    DynamoDBDocumentClient.from(dynamoDBClient)
})
```

:::info

DynamoDB-Toolbox does NOT hold the responsibility of actually deploying your table. This should be done by other means, like the [AWS CLI](https://aws.amazon.com/cli/), [Terraform](https://www.terraform.io/) or [Cloudformation](https://aws.amazon.com/cloudformation/).

:::

### 2. Design a Schema

Let's define a schema for our Pokemons.
You can read more on the `schema` syntax in the [dedicated section](../../4-schemas/1-usage/index.md):

```ts
// Use the shorthands: s.item(), s.string()...
import { schema, s } from 'dynamodb-toolbox/schema'
// ...or direct/deep imports
import { item } from 'dynamodb-toolbox/schema/item'
import { string } from 'dynamodb-toolbox/schema/string'
...

const pokemonSchema = item({
  // 👇 Key attributes
  pokemonId: string().key(),

  // 👇 Defaulted
  appearedAt: string().default(now),

  // 👇 Always required (but defaulted as well)
  updatedAt: string()
    .required('always')
    .putDefault(now) // Same as `.default(now)`
    .updateDefault(now),

  // 👇 Optional field
  customName: string().optional(),

  // 👇 Finite range of options
  species: string().enum('pikachu', 'charizard', ...),

  // 👇 Other types
  level: number(),
  isLegendary: boolean().optional(),
  pokeTypes: set(pokeTypeSchema),
  evolutions: list(evolutionSchema).default([]),
  resistances: record(pokeTypeSchema, number()).partial(),

  // 👇 Union of types
  captureState: anyOf(
    map({
      status: string().enum('captured'),
      capturedAt: string()
    }),
    map({ status: string().enum('wild') })
  )
    .discriminate('status')
    .default({ status: 'wild' }),

  // 👇 Any type (skips validation but can be casted)
  metadata: s.any().optional()
})
```

### 3. Create the Entity

Now that we have our schema, we can define our [`Entity`](../../3-entities/1-usage/index.md)!

Because we have a single `Entity` in this table, we can deactivate the internal [`entity`](../../3-entities/2-internal-attributes/index.md#entity) attribute (mostly useful for Single Table Design) as well as the internal [`timestamp`](../../3-entities/2-internal-attributes/index.md#timestamp-attributes) attributes (equivalent to `appearedAt` and `updatedAt`):

```ts
import { Entity } from 'dynamodb-toolbox/entity'

const PokemonEntity = new Entity({
  name: 'pokemon',
  table: PokeTable,
  schema: pokemonSchema,
  // Deactivate the internal attributes
  entityAttribute: false,
  timestamps: false
})
```

## Perform Operations

### Insert an Item

In order to [improve tree-shaking](../3-usage/index.md#methods-vs-actions), `Entities` only expose a single `.build(...)` method that acts as a gateway to perform [Actions](../3-usage/index.md#how-do-actions-work) (if you don't mind larger bundle sizes, you can use the [`EntityRepository`](../../3-entities/4-actions/23-repository/index.md) action instead).

Let's use the [`PutItemCommand`](../../3-entities/4-actions/3-put-item/index.md) action to write our first item:

```ts
import { PutItemCommand } from 'dynamodb-toolbox/entity/actions/put'

const command = PokemonEntity.build(PutItemCommand)
  // 👇 Validated AND type-safe!
  .item({
    pokemonId: 'pikachu-1',
    species: 'pikachu',
    level: 42,
    isLegendary: false,
    pokeTypes: new Set('electric'),
    resistances: { rock: 3 }
  })

// 👇 Inspects the DynamoDB command
console.log(command.params())

// 👇 Sends the command
await command.send()
```

Assuming that the `poke-table` exists and that you have correct permissions, this command writes the following item to DynamoDB:

```json
{
  "pokemonId": "pikachu-1",
  "species": "pikachu",
  "level": 42,
  "isLegendary": false,
  "pokeTypes": ["electric"], // (as a Set)
  "resistances": { "rock": 3 },
  // Defaulted attr. are automatically filled 🙌
  "appearedAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:00.000Z",
  "evolutions": [],
  "captureState": { "status": "wild" }
}
```

### Get an Item

Let's use the [`GetItemCommand`](../../3-entities/4-actions/1-get-item/index.md) action to retrieve our freshly written pokemon:

```ts
import { GetItemCommand } from 'dynamodb-toolbox/entity/actions/get'

const command = PokemonEntity.build(GetItemCommand)
  // 👇 Only (non-defaulted) key attr. are required!
  .key({ pokemonId: 'pikachu-1' })

// 👇 Validated AND type-safe!
const { Item: pikachu } = await command.send()
```

:::info

☝️ If the fetched data is invalid, DynamoDB-Toobox throws an error and the code is interrupted.

:::

You can refine most commands by using the `.options(...)` method:

```ts
const command = PokemonEntity.build(GetItemCommand)
  .key({ pokemonId: 'pikachu-1' })
  // 👇 Read consistently
  .options({ consistent: true })

const { Item: pikachu } = await command.send()
```

### Update an Item

We can update our pokemon with the [`UpdateItemCommand`](../../3-entities/4-actions/4-update-item/index.md) and [`UpdateAttributesCommand`](../../3-entities/4-actions/5-update-attributes/index.md). For instance, let's evolve our pokemon:

```ts
import {
  UpdateItemCommand,
  $add,
  $append
} from 'dynamodb-toolbox/entity/actions/update'

const command = PokemonEntity.build(UpdateItemCommand)
  // 👇 Validated AND type-safe!
  .item({
    // 👇 Only (non-defaulted) key & always required attr. are required!
    pokemonId: 'pikachu-1',
    species: 'raichu',
    // 👇 Native capabilities of DynamoDB
    level: $add(1),
    evolutions: $append({
      from: 'pikachu',
      to: 'raichu',
      at: new Date().toISOString()
    })
  })

await command.send()
```

### Delete an Item

Finally, we can clear our pokemon with the [`DeleteItemCommand`](../../3-entities/4-actions/6-delete-item/index.md):

```ts
import { DeleteItemCommand } from 'dynamodb-toolbox/entity/actions/delete'

const command = PokemonEntity.build(DeleteItemCommand)
  // 👇 Same input as GetItemCommand
  .key({ pokemonId: 'pikachu-1' })

await command.send()
```
