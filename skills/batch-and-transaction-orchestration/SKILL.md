---
name: batch-and-transaction-orchestration
description: >
  Use dynamodb-toolbox batch and transaction builders with the dedicated
  execute helpers, handle partial batch success and unprocessed items, add
  clientRequestToken for idempotency, and respect one-operation-per-item
  transaction constraints.
type: core
library: dynamodb-toolbox
library_version: "local"
sources:
  - "dynamodb-toolbox/dynamodb-toolbox:docs/docs/2-tables/2-actions/6-batch-get/index.md"
  - "dynamodb-toolbox/dynamodb-toolbox:docs/docs/2-tables/2-actions/7-batch-write/index.md"
  - "dynamodb-toolbox/dynamodb-toolbox:docs/docs/3-entities/4-actions/11-transactions/index.md"
  - "dynamodb-toolbox/dynamodb-toolbox:src/entity/actions/transactWrite/execute.ts"
---

# DynamoDB-Toolbox - Batch and Transaction Orchestration

Use batch and transaction APIs when one operation spans multiple items or tables. The important distinctions are execute helpers instead of `.send()`, partial batch success handling, and transaction constraints per item.

## Setup

```ts
import { BatchGetCommand, execute as executeBatchGet } from 'dynamodb-toolbox/table/actions/batchGet'
import { execute as executeTransactWrite } from 'dynamodb-toolbox/entity/actions/transactWrite'
import { PutTransaction } from 'dynamodb-toolbox/entity/actions/transactPut'
import { UpdateTransaction } from 'dynamodb-toolbox/entity/actions/transactUpdate'

const batchGet = AppTable.build(BatchGetCommand)
const batchGetResult = await executeBatchGet(batchGet)

const putTx = PokemonEntity.build(PutTransaction).item({ pokemonId: '001', species: 'PIKACHU' })
const updateTx = TrainerEntity.build(UpdateTransaction).item({ trainerId: 'ash', name: 'Ash' })

await executeTransactWrite({ clientRequestToken: 'tx-1' }, putTx, updateTx)
```

## Core Patterns

### Always use the dedicated execute helpers

Batch and transaction builders are not sendable commands.

### Check unprocessed batch results explicitly

```ts
const result = await executeBatchGet(batchGet)
if (result.UnprocessedKeys && Object.keys(result.UnprocessedKeys).length > 0) {
  throw new Error('Batch get returned unprocessed keys')
}
```

### Add idempotency tokens to transact-write paths

```ts
await executeTransactWrite({ clientRequestToken: 'tx-1' }, putTx, updateTx)
```

## Common Mistakes

### CRITICAL Calling `.send()` on batch or transaction builders

Wrong:

```ts
await AppTable.build(BatchGetCommand).send()
```

Correct:

```ts
const batchGet = AppTable.build(BatchGetCommand)
await executeBatchGet(batchGet)
```

These APIs use dedicated execute helpers because they orchestrate multiple requests.

Source: dynamodb-toolbox/dynamodb-toolbox:docs/docs/2-tables/2-actions/6-batch-get/index.md

### HIGH Putting two write operations on the same item in one transaction

Wrong:

```ts
await executeTransactWrite(checkTx, updateTx)
```

Correct:

```ts
await executeTransactWrite(updateTx)
```

The docs explicitly limit one transaction operation per item; merge conditions into the actual write where possible.

Source: dynamodb-toolbox/dynamodb-toolbox:docs/docs/3-entities/4-actions/11-transactions/index.md

### MEDIUM Selling batch APIs as a cost optimization

Wrong:

```ts
// Use batch get because it is cheaper than many gets.
```

Correct:

```ts
// Use batch get to coordinate many reads efficiently.
```

Batch APIs improve orchestration, not DynamoDB pricing.

Source: dynamodb-toolbox/dynamodb-toolbox:docs/docs/2-tables/2-actions/6-batch-get/index.md

### CRITICAL Ignoring unprocessed items or partial success

Wrong:

```ts
const result = await executeBatchGet(batchGet)
return result
```

Correct:

```ts
const result = await executeBatchGet(batchGet)
if (result.UnprocessedKeys && Object.keys(result.UnprocessedKeys).length > 0) {
  throw new Error('Retry unprocessed keys before treating the batch as complete')
}
return result
```

Batch APIs can resolve with partial work still outstanding, so treating the promise resolution as full success silently drops data or retries.

Source: maintainer interview