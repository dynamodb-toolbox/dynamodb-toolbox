---
title: BatchWrite
sidebar_custom_props:
  sidebarActionType: write
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# BatchWriteCommand

Groups one or several [`BatchPutRequest`](../../../3-entities/4-actions/9-batch-put/index.md) and [`BatchDeleteRequest`](../../../3-entities/4-actions/10-batch-delete/index.md) from the `Table` entities to execute a [BatchWriteItem](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_BatchWriteItem.html) operation.

BatchWriteItem operations can affect **multiple tables**, so `BatchWriteCommands` do not have a `.send(...)` method. Instead, they should be performed via the dedicated `execute` function:

```ts
import {
  BatchWriteCommand,
  execute
} from 'dynamodb-toolbox/table/actions/batchWrite'
import { BatchPutRequest } from 'dynamodb-toolbox/entity/actions/batchPut'
import { BatchDeleteRequest } from 'dynamodb-toolbox/entity/actions/batchDelete'

const pokeCmd = PokeTable.build(BatchWriteCommand).requests(
  PokemonEntity.build(BatchPutRequest).item(pikachu),
  PokemonEntity.build(BatchPutRequest).item(charizard)
)

const params = pokeCmd.params()

const ashCmd = OtherTable.build(BatchWriteCommand).requests(
  TrainerEntity.build(BatchDeleteRequest).key(ashKey)
)

await execute(pokeCmd, ashCmd)
```

:::note

Note that batch operations are more efficient than running their equivalent commands in parallel, but **do not reduce costs**.

:::

## Request

### `.requests(...)`

<p style={{ marginTop: '-15px' }}><i>(required)</i></p>

The [`BatchPutRequests`](../../../3-entities/4-actions/9-batch-put/index.md) and [`BatchDeleteRequests`](../../../3-entities/4-actions/10-batch-delete/index.md) to execute.

### `.options(...)`

Provides additional **table-level** options:

```ts
const command = PokeTable.build(BatchWriteCommand).options({
  ...
})
```

You can use the `BatchWriteCommandOptions` type to explicitly type an object as a `BatchWriteCommand` options object:

```ts
import type { BatchWriteCommandOptions } from 'dynamodb-toolbox/table/actions/batchWrite'

const batchWriteOptions: BatchWriteCommandOptions= {
  ...
}

const command = PokeTable.build(BatchWriteCommand)
  .requests(...)
  .options(batchWriteOptions)
```

Available options:

| Option      |   Type   | Default | Description                                                                                               |
| ----------- | :------: | :-----: | --------------------------------------------------------------------------------------------------------- |
| `tableName` | `string` |    -    | Overrides the `Table` name. Mostly useful for [multitenancy](https://en.wikipedia.org/wiki/Multitenancy). |

### Examples

:::note[Examples]

<Tabs>
<TabItem value="basic" label="Basic">

```ts
const command = PokeTable.build(BatchWriteCommand).requests(
  PokemonEntity.build(BatchPutRequest).item(pikachu),
  PokemonEntity.build(BatchPutRequest).item(charizard)
)
```

</TabItem>
<TabItem value="multitenant" label="Multitenant">

```ts
const command = PokeTable.build(BatchWriteCommand)
  .requests(...)
  .options({ tableName: `tenant-${tenantId}-pokemons` })
```

</TabItem>
</Tabs>

:::

## Execution

```ts
import { execute } from 'dynamodb-toolbox/table/actions/batchWrite'

await execute(...batchWriteCommands)
```

:::warning

Only one `BatchWriteCommand` per Table is supported.

:::

### Options

The `execute` function accepts an additional object as a first argument for **operation-level** options, as well as DocumentClient options such as [`abortSignal`](https://github.com/aws/aws-sdk-js-v3?tab=readme-ov-file#abortcontroller-example):

```ts
await execute(options, ...batchWriteCommands)
```

Available options (see the [DynamoDB documentation](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_BatchWriteItem.html#API_BatchWriteItem_RequestParameters) for more details):

| Option           |       Type       | Default  | Description                                                                                                                                                                              |
| ---------------- | :--------------: | :------: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `capacity`       | `CapacityOption` | `"NONE"` | Determines the level of detail about provisioned or on-demand throughput consumption that is returned in the response.<br/><br/>Possible values are `"NONE"`, `"TOTAL"` and `"INDEXES"`. |
| `metrics`        | `MetricsOption`  | `"NONE"` | Determines whether item collection metrics are returned.<br/><br/>Possible values are `"NONE"` and `"SIZE"`.                                                                             |
| `documentClient` | `DocumentClient` |    -     | By default, the `documentClient` attached to the `Table` of the first `BatchWriteCommand` is used to execute the operation.<br/><br/>Use this option to override this behavior.          |
| `maxAttempts`    |  `integer ≥ 1`   |   `1`    | A "meta" option provided by DynamoDB-Toolbox to retry failed requests in a single promise.<br/><br/>Note that <code>Infinity</code> is a valid (albeit dangerous) option.                |

### Examples

:::note[Examples]

<Tabs>
<TabItem value="basic" label="Basic">

```ts
const pokeCmd = PokeTable
  .build(BatchWriteCommand)
  .requests(...)

const ashCmd = OtherTable
  .build(BatchWriteCommand)
  .requests(...)

await execute(pokeCmd, ashCmd)
```

</TabItem>
<TabItem value="capacity" label="Capacity">

```ts
const { ConsumedCapacity } = await execute(
  { capacity: 'TOTAL' },
  ...batchWriteCommands
)
```

</TabItem>
<TabItem value="metrics" label="Metrics">

```ts
const { ItemCollectionMetrics } = await execute(
  { metrics: 'SIZE' },
  ...batchWriteCommands
)
```

</TabItem>
<TabItem value="document-client" label="Document client">

```ts
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

const documentClient = new DynamoDBDocumentClient(...)

await execute(
  { documentClient },
  ...batchWriteCommands
)
```

</TabItem>
<TabItem value="retries" label="Retries">

```ts
await execute({ maxAttempts: 3 }, ...batchWriteCommands)
```

</TabItem>
<TabItem value="aborted" label="Aborted">

```ts
const abortController = new AbortController()
const abortSignal = abortController.signal

await execute({ abortSignal }, ...batchWriteCommands)

// 👇 Aborts the command
abortController.abort()
```

</TabItem>
</Tabs>

:::

### Response

The data is returned using the same response syntax as the [DynamoDB BatchWriteItem API](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_BatchWriteItem.html#API_BatchWriteItem_ResponseSyntax).
