---
title: TransactPut
sidebar_custom_props:
  sidebarActionType: write
---

# PutItemTransaction

Build a `PutItem` transaction on an entity item, to be used within [TransactWriteItems operations](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_TransactWriteItems.html).

:::info

Check the [Transaction Documentation](../9-transactions/index.md) to learn how to use `PutItemTransactions`.

:::

```ts
import { transactWriteItems } from 'dynamodb-toolbox/entity/actions/transactWrite'
import { PutItemTransaction } from 'dynamodb-toolbox/entity/actions/transactPut'

const transaction = PokemonEntity.build(PutItemTransaction)

const params = transaction.params()
await transactWriteItems([
  transaction,
  ...otherTransactions
])
```

## Request

### `.item(...)`

<p style={{ marginTop: '-15px' }}><i>(required)</i></p>

The item to write:

```ts
const transaction = PokemonEntity.build(PutItemTransaction)
  .item({
    pokemonId: 'pikachu1',
    name: 'Pikachu',
    pokeType: 'electric',
    level: 50,
    ...
  })
```

You can use the `PutItemInput` type from the [`PutItemCommand`](../2-put-item/index.md) action to explicitely type an object as a `PutItemTransaction` item:

```ts
import type { PutItemInput } from 'dynamodb-toolbox/entity/actions/put'

const item: PutItemInput<typeof PokemonEntity> = {
  pokemonId: 'pikachu1',
  name: 'Pikachu'
  ...
}

const transaction = PokemonEntity.build(
  PutItemTransaction
).item(item)
```

### `.options(...)`

Provides additional options:

```ts
const transaction = PokemonEntity.build(PutItemTransaction)
  .item(...)
  .options({
    // 👇 Checks that item didn't previously exist
    condition: { attr: 'pokemonId', exists: false }
  })
```

You can use the `PutItemTransactionOptions` type to explicitely type an object as a `PutItemTransaction` options:

```ts
import type { PutItemTransactionOptions } from 'dynamodb-toolbox/entity/actions/transactPut'

const options: PutItemTransactionOptions<
  typeof PokemonEntity
> = {
  condition: { attr: 'pokemonId', exists: false }
}

const transaction = PokemonEntity.build(PutItemTransaction)
  .item(...)
  .options(options)
```

Available options are (see the [DynamoDB documentation](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_TransactWriteItems.html#API_TransactWriteItems_RequestParameters) for more details):

| Option      |               Type                | Default | Description                                                                                                                                                                                                                       |
| ----------- | :-------------------------------: | :-----: | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `condition` | `Condition<typeof PokemonEntity>` |    -    | A condition that must be satisfied in order for the `PutItemTransaction` to succeed.<br/><br/>See the [`ConditionParser`](../17-parse-condition/index.md#building-conditions) action for more details on how to write conditions. |

```ts
PokemonEntity.build(PutItemTransaction)
  .item(...)
  .options({
    condition: { attr: 'pokemonId', exists: false }
  })
```

:::info

Contrary to [`PutItemCommands`](../2-put-item/index.md), put transactions cannot return the previous values of the written items.

:::
