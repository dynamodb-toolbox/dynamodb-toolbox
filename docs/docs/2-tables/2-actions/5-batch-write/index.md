---
title: BatchWrite
sidebar_custom_props:
  sidebarActionType: write
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# BatchWriteCommand

Groups one or several [`BatchPutRequest`](../../../3-entities/3-actions/7-batch-put/index.md) and [`BatchDeleteRequest`](../../../3-entities/3-actions/8-batch-delete/index.md) from the `Table` entities to execute a [BatchWriteItem](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_BatchWriteItem.html) operation.

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

The [`BatchPutRequests`](../../../3-entities/3-actions/7-batch-put/index.md) and [`BatchDeleteRequests`](../../../3-entities/3-actions/8-batch-delete/index.md) to execute.

## Execution

```ts
import { execute } from 'dynamodb-toolbox/table/actions/batchWrite'

await execute(...batchWriteCommands)
```

:::caution

Only one `BatchWriteCommand` per Table is supported.

:::

### Options

The `execute` function accepts an additional object as a first argument for **operation-level** options:

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

:::noteExamples

<Tabs>
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
const { Response } = await execute(
  { maxAttempts: 3 },
  ...batchGetCommands
)
```

</TabItem>
</Tabs>

:::

### Response

The data is returned with the same response syntax as from the [DynamoDB BatchWriteItem API](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_BatchWriteItem.html#API_BatchWriteItem_ResponseSyntax).
