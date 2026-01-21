---
title: Batching
draft: true
---

# Batching

In this guide, we’ll explore how to use the **BatchGet** and **BatchWrite** actions:

- [**BatchGet**](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_BatchGetItem.html) **retrieves** multiple items from one or more DynamoDB tables in a single request.
- [**BatchWrite**](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_BatchWriteItem.html) **puts or deletes** multiple items in one or more DynamoDB tables in a single request.

## Retrieve Multiple Items

### Single Table, Single Entity

We can use the [`BatchGetCommand`](../../2-tables/2-actions/5-batch-get/index.md) action to retrieve multiple items from a table. This action works at the table level since it can access multiple entities (when using Single Table Design):

:::caution
DynamoDB Toolbox does not handle `BatchGetItem` edge cases for you. Refer to the [Handling `BatchGetItem` Edge Cases](#handling-batchgetitem-edge-cases) section for examples on how to handle these edge cases.
:::

```ts
import {
  BatchGetCommand,
  execute
} from 'dynamodb-toolbox/table/actions/batchGet'
import { BatchGetRequest } from 'dynamodb-toolbox/entity/actions/batchGet'

const pokemonIds = ['bulbasaur', 'charmander', 'squirtle']

// 👇 Map data into a collection of `BatchGetRequest` actions
const requests = pokemonIds.map((pokemonId) => {
  return PokemonEntity.build(BatchGetRequest).key(pokemonId)
})

// 👇 Create the `BatchGet` command. Don't forget the spread operator!
const command = PokeTable.build(BatchGetCommand).requests(...requests)

// 👇 Execute the command.
const { Responses } = await execute(command)

// 👇 `Responses` is an array of size 1 as we only sent one `BatchGetCommand`
const [pokemons] = Responses

for (const pokemon of pokemons) {
  // (note that `pokemon` might be `undefined`)
  if (pokemon === undefined) {

  }

  // ...do something with `pokemon` here
}
```

### Single Table, Multiple Entities

### Multiple Tables & Entities

### Handling `BatchGetItem` Edge Cases

There are several common edge cases that need to be handled when executing a `BatchGetItem` command:

- Retrieving collections of items larger than `BatchGetItem`'s limit of 100 items per request
- Attempting to execute a `BatchGetItem` command with an empty list of keys as input (this is possible when deriving keys from another query)
- Handling unprocessed keys in the response (i.e. when exceeding the 16MB data limit per command)

Below are some examples of how to handle these edge cases when working with **BatchGet** actions.

#### Handling `BatchGetItem`'s Item Limit

To retrieve collections of items larger than `BatchGetItem`'s limit of 100 items per request, we need to split  requests into 100-item chunks.

```ts
// 👇 Let's pretend this has 500+ IDs in it
const pokemonIds: string[] = []
const chunks: string[][] = []

// 👇 Split `pokemonIds` into chunks of 100
for (let i = 0; i < pokemonIds.length; i += 100) {
  const chunk = pokemonIds.slice(i, i + 100)

  if (chunk.length !== 0) {
    chunks.push(chunk)
  }
}

// 👇 Process each chunk in parallel
await Promise.all(chunks.map(async (chunk) => {
  // 👇 Build out our requests like usual
  const requests = chunk.map((pokemonId) => {
    return PokemonEntity.build(BatchGetRequest).key(pokemonId)
  })

  const command = PokeTable.build(BatchGetCommand).requests(...requests)
  const { Responses } = await execute(command)

  const [pokemons] = Responses

  for (const pokemon of pokemons) {
    // Do something with `pokemon` like usual
  }
}))

// 👇 Alternatively: Process each chunk sequentially
for await (const chunk of chunks) {
  // 👇 Build out our requests like usual
  const requests = chunk.map((pokemonId) => {
    return PokemonEntity.build(BatchGetRequest).key(pokemonId)
  })

  const command = PokeTable.build(BatchGetCommand).requests(...requests)
  const { Responses } = await execute(command)

  const [pokemons] = Responses

  for (const pokemon of pokemons) {
    // Do something with `pokemon` like usual
  }
}
```

#### Handling Empty Input Keys

TODO

#### Handling Unprocessed Keys

DynamoDB Toolbox can automatically handle unprocessed keys for you via the [`maxAttempts`](../../2-tables/2-actions/6-batch-get/index.md#options-1) option:

```ts
const { Response } = await execute(
  { maxAttempts: 5 }, // Attempt to retrieve unprocessed keys 5 times before ending the operation
  ...batchGetCommands
)
```

:::note
Higher `maxAttempts` values increase the likelihood that all unprocessed keys will be retrieved at the cost of (potentially) slower operations. Tweak this value according to the average item size for your data. Note that `Infinity` is also a valid (albeit dangerous) option.
:::

## Write Multiple Items

### Single Table, Single Entity

### Single Table, Multiple Entities

### Multiple Tables

### Handling `BatchWriteItem` Edge Cases
