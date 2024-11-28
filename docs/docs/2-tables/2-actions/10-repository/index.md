---
title: Repository
sidebar_custom_props:
  sidebarActionType: util
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Repository

A utility action that exposes table actions as **methods**. Using it leads to heavier bundles (as it necessarily imports all of their code) but provides a more concise syntax:

```ts
import { Repository } from 'dynamodb-toolbox/table/actions/repository'

const pokeTableRepository = PokeTable.build(Repository)

// 👇 Sends a `ScanCommand`
await pokeTableRepository.scan()
```

:::note

Note that [`Spies`](../9-spy/index.md) can still be used in cunjunction with `Repositories` as commands are still sent under the hood.

:::

## Specifying entities

You can provide a list of entities to the repository. Those are then provided to all underlying actions:

```ts
const pokeTableRepository = PokeTable.build(Repository)
  .entities(PokemonEntity, TrainerEntity, ...)

// 👇 Typed as (Pokemon | Trainer | ...)[]
const { Items } = await pokeTableRepository.scan()
```

## Methods

### `scan(...)`

<p style={{ marginTop: '-15px' }}><i><code>(options?: OPTIONS) => ScanResponse&lt;TABLE, ENTITIES, OPTIONS&gt;</code></i></p>

Performs a [Scan Operation](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Scan.html). See [`ScanCommand`](../1-scan/index.md) for more details:

:::note[Examples]

<Tabs>
<TabItem value="usage" label="Usage">

```ts
const { Items } = await pokeTableRepository.scan()
```

</TabItem>
<TabItem value="options" label="Options">

```ts
const { Items } = await pokeTableRepository.scan({
  consistent: true,
  limit: 10
})
```

</TabItem>
</Tabs>

:::

### `query(...)`

<p style={{ marginTop: '-15px' }}><i><code>(query: QUERY, options?: OPTIONS) => QueryResponse&lt;TABLE, QUERY, ENTITIES, OPTIONS&gt;</code></i></p>

Performs a [Query Operation](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Query.html). See [`QueryCommand`](../2-query/index.md) for more details:

:::note[Examples]

<Tabs>
<TabItem value="usage" label="Usage">

```ts
// Get 'ashKetchum' pokemons
const { Items } = await pokeTableRepository.query({
  partition: 'ashKetchum'
})
```

</TabItem>
<TabItem value="index" label="Index">

```ts
// Get 'ashKetchum1' pokemons with a level ≥ 50
const { Items } = await pokeTableRepository.query({
  partition: 'ashKetchum1',
  index: 'byTrainerId',
  range: { gte: 50 }
})
```

</TabItem>
<TabItem value="options" label="Options">

```ts
// Consistently get less than 10 'ashKetchum' pokemons
const { Items } = await pokeTableRepository.query(
  { partition: 'ashKetchum' },
  { consistent: true, limit: 10 }
)
```

</TabItem>
</Tabs>

:::

### `deletePartition(...)`

<p style={{ marginTop: '-15px' }}><i><code>(query: QUERY, options?: OPTIONS) => DeletePartitionResponse&lt;TABLE, QUERY, OPTIONS&gt;</code></i></p>

:::warning

`DeletePartitionCommand` is exposed as a quality of life improvement, but is NOT an official DynamoDB operation (eventhough we wish it was).

:::

Performs a paginated [Query Operation](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Query.html) on a `Table` and run subsequent [`BatchWriteCommands`](../6-batch-write/index.md) to batch delete returned items. See [`DeletePartitionCommand`](../3-deletePartition/index.md) for more details:

:::note[Examples]

<Tabs>
<TabItem value="usage" label="Usage">

```ts
// Delete 'ashKetchum' pokemons
await pokeTableRepository.deletePartition({
  partition: 'ashKetchum'
})
```

</TabItem>
<TabItem value="index" label="Index">

```ts
// Delete 'ashKetchum1' pokemons with a level ≥ 50
await pokeTableRepository.deletePartition({
  partition: 'ashKetchum1',
  index: 'byTrainerId',
  range: { gte: 50 }
})
```

</TabItem>
<TabItem value="options" label="Options">

```ts
// Consistently delete less than 10 'ashKetchum' pokemons
await pokeTableRepository.deletePartition(
  { partition: 'ashKetchum' },
  { consistent: true, limit: 10 }
)
```

</TabItem>
</Tabs>

:::

## Batch Gets

### `batchGet(...)`

<p style={{ marginTop: '-15px' }}><i><code>(opt?: OPTIONS, ...req: REQUESTS) => BatchGetCommand&lt;TABLE, ENTITIES, REQUESTS, OPTIONS&gt;</code></i></p>

Groups one or several [`BatchGetRequest`](../../../3-entities/4-actions/7-batch-get/index.md) from the `Table` entities to execute a [BatchGetItem](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_BatchGetItem.html) operation. Additional options can be provided as a first argument. See [`BatchGet`](../5-batch-get/index.md) for more details:

:::note[Examples]

<Tabs>
<TabItem value="usage" label="Usage">

```ts
const batchGetCommand = pokeTableRepository.batchGet(
  PokemonEntity.build(BatchGetRequest).key(pikachuKey),
  TrainerEntity.build(BatchGetRequest).key(ashKetchumKey)
)
```

</TabItem>
<TabItem value="entity" label="Ent. Repository">

```ts
const batchGetCommand = pokeTableRepository.batchGet(
  pokemonRepository.batchGet(pikachuKey),
  trainerRepository.batchGet(ashKetchumKey)
)
```

</TabItem>
<TabItem value="options" label="Options">

```ts
const batchGetCommand = pokeTableRepository.batchGet(
  { consistent: true },
  pokemonRepository.batchGet(pikachuKey),
  trainerRepository.batchGet(ashKetchumKey)
)
```

</TabItem>
</Tabs>

:::

### `executeBatchGet(...)`

<p style={{ marginTop: '-15px' }}><i><code><b>static</b> (opt?: OPTIONS, ...cmd: COMMANDS) => ExecuteBatchGetResponses&lt;COMMANDS&gt;</code></i></p>

The [`BatchGetCommand` executor](../5-batch-get/index.md#execution) exposed as a **static** method:

:::note[Examples]

<Tabs>
<TabItem value="usage" label="Usage">

```ts
const { Responses } = await Repository.executeBatchGet(
  // Only one `BatchGetCommand` per table is supported
  pokeTableRepository.batchGet(...),
  otherTableRepository.batchGet(...),
)
```

</TabItem>
<TabItem value="options" label="Options">

```ts
const { Responses } = await Repository.executeBatchGet(
  { maxAttempts: Infinity },
  // Only one `BatchGetCommand` per table is supported
  pokeTableRepository.batchGet(...),
  otherTableRepository.batchGet(...),
)
```

</TabItem>
</Tabs>

:::

## Batch Writes

### `batchWrite(...)`

<p style={{ marginTop: '-15px' }}><i><code>(opt?: OPTIONS, ...req: REQUESTS) => BatchWriteCommand&lt;TABLE, ENTITIES, REQUESTS&gt;</code></i></p>

Groups one or several [`BatchPutRequest`](../../../3-entities/4-actions/8-batch-put/index.md) and [`BatchDeleteRequest`](../../../3-entities/4-actions/9-batch-delete/index.md) from the `Table` entities to execute a [BatchWriteItem](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_BatchWriteItem.html) operation. Additional options can be provided as a first argument. See [`BatchWrite`](../6-batch-write/index.md) for more details:

:::note[Examples]

<Tabs>
<TabItem value="usage" label="Usage">

```ts
const batchWriteCommand = pokeTableRepository.batchWrite(
  PokemonEntity.build(BatchPutRequest).item(pikachu),
  TrainerEntity.build(BatchPutRequest).item(ashKetchum)
)
```

</TabItem>
<TabItem value="entity" label="Ent. Repository">

```ts
const batchWriteCommand = pokeTableRepository.batchWrite(
  pokemonRepository.batchPut(pikachu),
  trainerRepository.batchPut(ashKetchum)
)
```

</TabItem>
<TabItem value="options" label="Options">

```ts
const batchWriteCommand = pokeTableRepository.batchWrite(
  { tableName: `tenant-${tenantId}-pokemons` },
  pokemonRepository.batchPut(pikachu),
  trainerRepository.batchPut(ashKetchum)
)
```

</TabItem>
</Tabs>

:::

### `executeBatchWrite(...)`

<p style={{ marginTop: '-15px' }}><i><code><b>static</b> (opt?: OPTIONS, ...cmd: COMMANDS) => BatchWriteCommandOutput</code></i></p>

The [`BatchWriteCommand` executor](../6-batch-write/index.md#execution) exposed as a **static** method:

:::note[Examples]

<Tabs>
<TabItem value="usage" label="Usage">

```ts
await Repository.executeBatchWrite(
  // Only one `BatchWriteCommand` per table is supported
  pokeTableRepository.batchWrite(...),
  otherTableRepository.batchWrite(...),
)
```

</TabItem>
<TabItem value="options" label="Options">

```ts
await Repository.executeBatchWrite(
  { maxAttempts: Infinity },
  // Only one `BatchWriteCommand` per table is supported
  pokeTableRepository.batchWrite(...),
  otherTableRepository.batchWrite(...),
)
```

</TabItem>
</Tabs>

:::

## Utils

### `parsePrimaryKey(...)`

<p style={{ marginTop: '-15px' }}><i><code>(input: unknown) => PrimaryKey&lt;TABLE&gt;</code></i></p>

Parses a [Primary Key](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.CoreComponents.html#HowItWorks.CoreComponents.PrimaryKey). See [`ParsePrimaryKey`](../8-parse-primary-key/index.md) for more details:

```ts
const primaryKey = pokeTableRepository.parsePrimaryKey({
  partitionKey: 'pikachu',
  sortKey: 42,
  foo: 'bar'
})
// ✅ => { partitionKey: 'pikachu', sortKey: 42 }

pokeTableRepository.parsePrimaryKey({ invalid: 'input' })
// ❌ Throws an error
```
