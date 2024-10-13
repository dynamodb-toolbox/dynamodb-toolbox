---
title: TransactDelete
sidebar_custom_props:
  sidebarActionType: delete
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# DeleteTransaction

Builds a transaction to delete an entity item, to be used within [TransactWriteItems operations](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_TransactWriteItems.html):

```ts
import { execute } from 'dynamodb-toolbox/entity/actions/transactWrite'
import { DeleteTransaction } from 'dynamodb-toolbox/entity/actions/transactDelete'

const transaction = PokemonEntity.build(DeleteTransaction)

const params = transaction.params()
await execute(transaction, ...otherTransactions)
```

`DeleteTransactions` can be executed in conjunction with [`PutTransactions`](../12-transact-put/index.md), [`UpdateTransactions`](../13-transact-update/index.md) and [`ConditionChecks`](../15-condition-check/index.md).

:::info

Check the [Transaction Documentation](../10-transactions/index.md#transactwrite) to learn more about the `execute` function.

:::

## Request

### `.key(...)`

<p style={{ marginTop: '-15px' }}><i>(required)</i></p>

The key of the item to delete (i.e. attributes that are tagged as part of the primary key):

```ts
const transaction = PokemonEntity.build(
  DeleteTransaction
).key({ pokemonId: 'pikachu1' })
```

You can use the `KeyInput` type from the [`EntityParser`](../17-parse/index.md) action to explicitly type an object as a `BatchDeleteItemRequest` key object:

```ts
import type { KeyInput } from 'dynamodb-toolbox/entity/actions/parse'

const key: KeyInput<typeof PokemonEntity> = {
  pokemonId: 'pikachu1'
}

const transaction = PokemonEntity.build(
  DeleteTransaction
).key(key)
```

### `.options(...)`

Provides additional options:

```ts
const transaction = PokemonEntity.build(
  DeleteTransaction
)
  .key(...)
  .options({
    condition: { attr: 'archived', eq: true }
  })
```

You can use the `DeleteTransactionOptions` type to explicitly type an object as a `DeleteTransaction` options object:

```ts
import type { DeleteTransactionOptions } from 'dynamodb-toolbox/entity/actions/transactDelete'

const options: DeleteTransactionOptions<
  typeof PokemonEntity
> = {
  condition: { attr: 'archived', eq: true }
}

const transaction = PokemonEntity.build(
  DeleteTransaction
)
  .key(...)
  .options(options)
```

Available options (see the [DynamoDB documentation](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_TransactWriteItems.html#API_TransactWriteItems_RequestParameters) for more details):

| Option      |               Type                | Default | Description                                                                                                                                                                                                                      |
| ----------- | :-------------------------------: | :-----: | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `condition` | `Condition<typeof PokemonEntity>` |    -    | A condition that must be satisfied in order for the `DeleteTransaction` to succeed.<br/><br/>See the [`ConditionParser`](../18-parse-condition/index.md#building-conditions) action for more details on how to write conditions. |
| `tableName` |             `string`              |    -    | Overrides the `Table` name. Mostly useful for [multitenancy](https://en.wikipedia.org/wiki/Multitenancy).                                                                                                                        |

:::noteExamples

<Tabs>
<TabItem value="condition" label="Conditional write">

```ts
const transaction = PokemonEntity.build(DeleteTransaction)
  .key({ pokemonId: 'pikachu1' })
  .options({
    condition: { attr: 'archived', eq: true }
  })
```

</TabItem>
<TabItem value="multitenant" label="Multitenant">

```ts
const transaction = PokemonEntity.build(DeleteTransaction)
  .key({ pokemonId: 'pikachu1' })
  .options({
    tableName: `tenant-${tenantId}-pokemons`
  })
```

</TabItem>
</Tabs>

:::

:::info

Contrary to [`DeleteItemCommands`](../5-delete-item/index.md), delete transactions cannot return the values of the deleted items.

:::
