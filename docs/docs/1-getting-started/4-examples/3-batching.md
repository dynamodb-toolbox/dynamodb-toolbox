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

```ts
import {
  BatchGetCommand,
  execute
} from 'dynamodb-toolbox/table/actions/batchGet'
import { BatchGetRequest } from 'dynamodb-toolbox/entity/actions/batchGet'

const pokemonIds = ['bulbasaur', 'charmander', 'squirtle']

// 👇 Map data into a collection of `BatchGetRequest` actions
const requests = pokemonIds.map((pokemonId) => {
  return PokemonEntity.build(BatchGetRequest).key({ id: pokemonId })
})

// 👇 Create the `BatchGet` command. Don't forget the spread operator!
const command = PokeTable.build(BatchGetCommand).requests(...requests)

// 👇 Execute the command.
const { Responses } = await execute(command)

// 👇 Extract your data from the responses
const [pokemon] = Responses
return pokemon.filter(item => item !== undefined)
```

### Single Table, Multiple Entities

### Multiple Tables & Entities

### Handling `BatchGetItem` Limits

## Write Multiple Items

### Single Table, Single Entity

### Single Table, Multiple Entities

### Multiple Tables

### Handling `BatchWriteItem` Limits
