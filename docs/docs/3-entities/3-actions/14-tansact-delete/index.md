---
title: TransactDelete
sidebar_custom_props:
  sidebarActionType: delete
---

# DeleteItemTransaction

Build a `DeleteItem` transaction on an entity item, to be used within [TransactWriteItems operations](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_TransactWriteItems.html).

:::info

Check the [Transaction Documentation](../9-transactions/index.md) to learn how to use `DeleteItemTransactions`.

:::

```ts
import { transactWriteItems } from 'dynamodb-toolbox/entity/actions/transactWrite'
import { DeleteItemTransaction } from 'dynamodb-toolbox/entity/actions/transactDelete'

const transaction = PokemonEntity.build(
  DeleteItemTransaction
)

const params = transaction.params()
await transactWriteItems([
  transaction,
  ...otherTransactions
])
```

## Request

### `.key(...)`

<p style={{ marginTop: '-15px' }}><i>(required)</i></p>

The key of the item to delete (i.e. attributes that are tagged as part of the primary key):

```ts
const transaction = PokemonEntity.build(
  DeleteItemTransaction
).key({ pokemonId: 'pikachu1' })
```

You can use the `KeyInput` type from the [`EntityParser`](../16-parse/index.md) action to explicitely type an object as a `BatchDeleteItemRequest` key:

```ts
import type { KeyInput } from 'dynamodb-toolbox/entity/actions/parse'

const key: KeyInput<typeof PokemonEntity> = {
  pokemonId: 'pikachu1'
}

const transaction = PokemonEntity.build(
  DeleteItemTransaction
).key(key)
```

### `.options(...)`

Provides additional options:

```ts
const transaction = PokemonEntity.build(
  DeleteItemTransaction
)
  .key(...)
  .options({
    condition: { attr: 'archived', eq: true }
  })
```

You can use the `DeleteItemTransactionOptions` type to explicitely type an object as a `DeleteItemTransaction` options:

```ts
import type { DeleteItemTransactionOptions } from 'dynamodb-toolbox/entity/actions/transactDelete'

const options: DeleteItemTransactionOptions<
  typeof PokemonEntity
> = {
  condition: { attr: 'archived', eq: true }
}

const transaction = PokemonEntity.build(
  DeleteItemTransaction
)
  .key(...)
  .options(options)
```

Available options are (see the [DynamoDB documentation](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_TransactWriteItems.html#API_TransactWriteItems_RequestParameters) for more details):

| Option      |               Type                | Default | Description                                                                                                                                                                                                                          |
| ----------- | :-------------------------------: | :-----: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `condition` | `Condition<typeof PokemonEntity>` |    -    | A condition that must be satisfied in order for the `DeleteItemTransaction` to succeed.<br/><br/>See the [`ConditionParser`](../17-parse-condition/index.md#building-conditions) action for more details on how to write conditions. |

```ts
const transaction = PokemonEntity.build(
  DeleteItemTransaction
)
  .key({ pokemonId: 'pikachu1' })
  .options({
    condition: { attr: 'archived', eq: true }
  })
```

:::info

Contrary to [`DeleteItemCommands`](../4-delete-item/index.md), delete transactions cannot return the values of the deleted items.

:::
