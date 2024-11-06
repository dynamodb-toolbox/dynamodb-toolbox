---
title: TransactGet
sidebar_custom_props:
  sidebarActionType: read
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# GetTransaction

Builds a transaction to get an entity item, to be used within [TransactGetItems operations](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_TransactGetItems.html).

BatchGetItem operations can affect **multiple items**, so `GetTransactions` do not have a `.send(...)` method. Instead, they should be performed via the dedicated `execute` function:

```ts
import {
  GetTransaction,
  execute
} from 'dynamodb-toolbox/entity/actions/transactGet'

const pikachuTransac =
  PokemonEntity.build(GetTransaction).key(pikachuKey)

const params = pikachuTransac.params()

const ashTransac =
  TrainerEntity.build(GetTransaction).key(ashKey)

const { Responses } = await execute(
  pikachuTransac,
  ashTransac,
  ...otherTransacs
)

// 🙌 Correctly typed!
const [{ Item: pikachu }, { Item: ash }] = Responses
```

## Request

### `.key(...)`

<p style={{ marginTop: '-15px' }}><i>(required)</i></p>

The key of the item to get (i.e. attributes that are tagged as part of the primary key):

```ts
const request = PokemonEntity.build(GetTransaction).key({
  pokemonId: 'pikachu1'
})
```

You can use the `KeyInputItem` generic type to explicitly type an object as a `GetTransaction` key object:

```ts
import type { KeyInputItem } from 'dynamodb-toolbox/entity'

const key: KeyInputItem<typeof PokemonEntity> = {
  pokemonId: 'pikachu1'
}

const request =
  PokemonEntity.build(BatchGetRequest).key(key)
```

### `.options(...)`

Provides additional options:

```ts
const transaction = PokemonEntity.build(GetTransaction)
  .key(...)
  .options({
    attributes: ["name", "level"]
  })
```

You can use the `GetTransactionOptions` type to explicitly type an object as a `GetTransaction` options object:

```ts
import type { GetTransactionOptions } from 'dynamodb-toolbox/entity/actions/transactGet'

const options: GetTransactionOptions<typeof PokemonEntity> =
  { attributes: ['name', 'level'] }

const transaction = PokemonEntity.build(GetTransaction)
  .key(...)
  .options(options)
```

Available options (see the [DynamoDB documentation](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_TransactGetItems.html#API_TransactGetItems_RequestParameters) for more details):

| Option       |       Type       | Default | Description                                                                                                                                                                                                               |
| ------------ | :--------------: | :-----: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `attributes` | `Path<Entity>[]` |    -    | To specify a list of attributes to retrieve (improves performances but does not reduce costs).<br/><br/>See the [`PathParser`](../19-parse-paths/index.md#paths) action for more details on how to write attribute paths. |
| `tableName`  |     `string`     |    -    | Overrides the `Table` name. Mostly useful for [multitenancy](https://en.wikipedia.org/wiki/Multitenancy).                                                                                                                 |

:::noteExamples

<Tabs>
<TabItem value="attributes" label="Attributes">

```ts
const transaction = PokemonEntity.build(GetTransaction)
  .key({ pokemonId: 'pikachu1' })
  .options({
    attributes: ['type', 'level']
  })
```

</TabItem>
<TabItem value="multitenant" label="Multitenant">

```ts
const transaction = PokemonEntity.build(GetTransaction)
  .key({ pokemonId: 'pikachu1' })
  .options({
    tableName: `tenant-${tenantId}-pokemons`
  })
```

</TabItem>
</Tabs>

:::

## Execution

```ts
import { execute } from 'dynamodb-toolbox/entity/actions/transactGet'

await execute(...getTransactions)
```

Note that the transactions can be provided as **tuples** or **arrays** (the output is typed accordingly):

:::noteExamples

<Tabs>
<TabItem value="tuple" label="Tuple">

```ts
await execute(
  PokemonEntity.build(GetTransaction).key(pikachuKey),
  TrainerEntity.build(GetTransaction).key(ashKey),
  ...
)
```

</TabItem>
<TabItem value="array" label="Array">

```ts
const commands: (
  | GetTransaction<typeof PokemonEntity>
  | GetTransaction<typeof TrainerEntity>
)[] = [
  PokemonEntity.build(GetTransaction).key(pikachuKey),
  TrainerEntity.build(GetTransaction).key(ashKey),
  ...
]

await execute(...commands)
```

</TabItem>
</Tabs>

:::

### Options

The `execute` function accepts an additional object as a first argument for **operation-level** options, as well as DocumentClient options such as [`abortSignal`](https://github.com/aws/aws-sdk-js-v3?tab=readme-ov-file#abortcontroller-example):

```ts
await execute(options, ...batchGetCommands)
```

Available options (see the [DynamoDB documentation](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_TransactGetItems.html#API_TransactGetItems_RequestParameters) for more details):

| Option           |       Type       | Default  | Description                                                                                                                                                                              |
| ---------------- | :--------------: | :------: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `capacity`       | `CapacityOption` | `"NONE"` | Determines the level of detail about provisioned or on-demand throughput consumption that is returned in the response.<br/><br/>Possible values are `"NONE"`, `"TOTAL"` and `"INDEXES"`. |
| `documentClient` | `DocumentClient` |    -     | By default, the `documentClient` attached to the `Table` of the first `GetTransaction` entity is used to execute the operation.<br/><br/>Use this option to override this behavior.      |

:::noteExamples

<Tabs>
<TabItem value="capacity" label="Capacity">

```ts
const { ConsumedCapacity } = await execute(
  { capacity: 'TOTAL' },
  ...getTransactions
)
```

</TabItem>
<TabItem value="document-client" label="Document client">

```ts
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

const documentClient = new DynamoDBDocumentClient(...)

const { Response } = await execute(
  { documentClient },
  ...getTransactions
)
```

</TabItem>
<TabItem value="aborted" label="Aborted">

```ts
const abortController = new AbortController()
const abortSignal = abortController.signal

const { Response } = await execute(
  { abortSignal },
  ...getTransactions
)

// 👇 Aborts the command
abortController.abort()
```

</TabItem>
</Tabs>

:::

### Response

The data is returned using the same response syntax as the [DynamoDB TransactGetItems API](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_TransactGetItems.html#API_TransactGetItems_ResponseSyntax). If present, the returned items are formatted by their respective entities.
