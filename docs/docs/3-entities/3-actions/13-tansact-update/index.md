---
title: TransactUpdate
sidebar_custom_props:
  sidebarActionType: write
---

# UpdateItemTransaction

Build an `UpdateItem` transaction on an entity item, to be used within [TransactWriteItems operations](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_TransactWriteItems.html).

:::info

Check the [Transaction Documentation](../9-transactions/index.md) to learn how to use `UpdateItemTransactions`.

:::

```ts
import { transactWriteItems } from 'dynamodb-toolbox/entity/actions/transactWrite'
import { UpdateItemTransaction } from 'dynamodb-toolbox/entity/actions/transactUpdate'

const transaction = PokemonEntity.build(
  UpdateItemTransaction
)

const params = transaction.params()
await transactWriteItems([
  transaction,
  ...otherTransactions
])
```

## Request

### `.item(...)`

<p style={{ marginTop: '-15px' }}><i>(required)</i></p>

The attributes to update, including the key:

```ts
import { $add } from 'dynamodb-toolbox/entity/actions/update'

const transaction = PokemonEntity.build(UpdateItemTransaction)
  .item({
    pokemonId: 'pikachu1',
    level: $add(1),
    ...
  })
```

You can use the `UpdateItemInput` type from the [`UpdateItemCommand`](../3-update-item/index.md) action to explicitely type an object as an `UpdateItemTransaction` item:

```ts
import type { UpdateItemInput } from 'dynamodb-toolbox/entity/actions/update'

const item: UpdateItemInput<typeof PokemonEntity> = {
  pokemonId: 'pikachu1',
  level: $add(1),
  ...
}

const transaction = PokemonEntity.build(
  UpdateItemTransaction
).item(item)
```

### `.options(...)`

Provides additional options:

```ts
const transaction = PokemonEntity.build(UpdateItemTransaction)
  .item({
    pokemonId: 'pikachu1',
    level: $add(1),
    ...
  })
  .options({
    // 👇 Make sure that 'level' stays <= 99
    condition: { attr: 'level', lt: 99 }
  })
```

You can use the `UpdateItemTransactionOptions` type to explicitely type an object as a `UpdateItemTransaction` options:

```ts
import type { UpdateItemTransactionOptions } from 'dynamodb-toolbox/entity/actions/transactUpdate'

const options: UpdateItemTransactionOptions<
  typeof PokemonEntity
> = {
  condition: { attr: 'level', lt: 99 }
}

const transaction = PokemonEntity.build(UpdateItemTransaction)
  .item(...)
  .options(options)
```

Available options are (see the [DynamoDB documentation](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_TransactWriteItems.html#API_TransactWriteItems_RequestParameters) for more details):

| Option      |               Type                | Default | Description                                                                                                                                                                                                                          |
| ----------- | :-------------------------------: | :-----: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `condition` | `Condition<typeof PokemonEntity>` |    -    | A condition that must be satisfied in order for the `UpdateItemTransaction` to succeed.<br/><br/>See the [`ConditionParser`](../17-parse-condition/index.md#building-conditions) action for more details on how to write conditions. |

```ts
PokemonEntity.build(UpdateItemTransaction)
  .item(...)
  .options({
    condition: { attr: 'level', lt: 99 }
  })
```

:::info

Contrary to [`UpdateItemCommands`](../3-update-item/index.md), update transactions cannot return the previous or new values of the written items.

:::
