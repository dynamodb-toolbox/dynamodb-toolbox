---
title: Scans & Queries
---

# Scans & Queries

In this guide, we’ll explore how to retrieve multiple items from your DynamoDB table using **Scan** and **Query** actions:

- [**Scans**](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Scan.html) are **costly and slow** — best used for maintenance tasks or small datasets.
- [**Queries**](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Query.html) are **efficient and targeted** — ideal for production usage with proper indexing.

## Scanning a Table

We can use the [`ScanCommand`](../../2-tables/2-actions/1-scan/index.md) action to retrieve all items from a table. This action works at the table level since it can access multiple entities (when using Single Table Design):

```ts
import { ScanCommand } from 'dynamodb-toolbox/table/actions/scan'

const command = PokeTable.build(ScanCommand)
  // 👇 Needed to validate & type returned Items
  .entities(PokemonEntity)

// 👇 Validated AND type-safe!
const { Items } = await command.send()
```

:::caution

Scanning is slow and expensive at scale. Use it sparingly.

:::

## Handling Pagination

DynamoDB paginates results. To process the full dataset, loop through pages using `LastEvaluatedKey`:

```ts
let lastEvaluatedKey: Record<string, unknown> | undefined

do {
  const page = await command
    .options({ exclusiveStartKey: lastEvaluatedKey })
    .send()

  // ...do something with page.Items here...

  lastEvaluatedKey = page.LastEvaluatedKey
} while (lastEvaluatedKey !== undefined)
```

## Querying a Table

Querying is a fast and efficient way to fetch items based on indexed keys (primary or secondary).

### 1. Add a Secondary Index

To query by attributes other than the primary key, define a [Secondary Index](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/SecondaryIndexes.html) in your table:

```typescript
const PokeTable = new Table({
  ...
  indexes: {
    byTrainerId: {
      type: 'global',
      partitionKey: { name: 'trainerId', type: 'string' },
      sortKey: { name: 'captureDate', type: 'string' }
    }
  }
})
```

### 2. Extend the Schema

Include the index attributes in your entity schema. We can mark them as optional as they only apply to certain items:

```ts
const pokemonSchema = item({
  ...
  // 👇 No need to tag attr. as `key()`
  trainerId: string().optional(),
  captureDate: string().optional()
})
```

:::tip

We can make use of [`links`](../../4-schemas/2-defaults-and-links/index.md) to auto-set or remove the `captureDate` based on the presence of `trainerId`:

<details className="details-in-admonition">
<summary>🔎 <b>Show code</b></summary>

```ts
import {
  isRemoval,
  $remove
} from 'dynamodb-toolbox/entity/actions/update/symbols'

const pokemonSchema = item({
  ...
  trainerId: string().optional()
}).and(prevSchema => ({
  captureDate: string()
    .optional()
    .putLink<typeof prevSchema>(({ trainerId }) =>
      trainerId !== undefined
        ? new Date().toISOString()
        : undefined
    )
    .updateLink<typeof prevSchema>(({ trainerId }) => {
      if (isRemoval(trainerId)) {
        // Remove captureDate if trainerId is removed
        return $remove()
      }

      return trainerId !== undefined
        ? new Date().toISOString()
        : undefined
    })
}))
```

</details>

:::

### 3. Assign Items to the Index

To populate the index, update the entity with the required attributes:

```ts
await PokemonEntity.build(UpdateItemCommand)
  .item({
    pokemonId: 'pikachu-1',
    trainerId: 'ash-ketchum',
    captureDate: new Date().toISOString()
  })
  .send()
```

### Query Pokemons

Now that the index is in place and populated, we can use the [QueryCommand](../../2-tables/2-actions/2-query/index.md) action to fetch Pokemons by `trainerId` and sorted by `captureDate`:

```ts
const command = PokeTable.build(QueryCommand)
  // 👇 Needed to validate & type returned Items
  .entities(PokemonEntity)
  .query({ index: 'byTrainerId', partition: 'ash-ketchum' })

// 👇 Validated AND type-safe!
const { Items } = await command.send()
```

:::info

Just like Scan, Query results are also paginated.

:::
