---
title: TransactPut
sidebar_custom_props:
  sidebarActionType: write
---

# PutTransaction

Builds a transaction to put an entity item, to be used within [TransactWriteItems operations](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_TransactWriteItems.html):

```ts
import { execute } from 'dynamodb-toolbox/entity/actions/transactWrite'
import { PutTransaction } from 'dynamodb-toolbox/entity/actions/transactPut'

const transaction = PokemonEntity.build(PutTransaction)

const params = transaction.params()
await execute(transaction, ...otherTransactions)
```

`PutTransactions` can be executed in conjunction with [`UpdateTransactions`](../12-tansact-update/index.md), [`DeleteTransactions`](../13-tansact-delete/index.md) and [`ConditionChecks`](../14-condition-check/index.md).

:::info

Check the [Transaction Documentation](../9-transactions/index.md#transactwrite) to learn more on the `execute` function.

:::

## Request

### `.item(...)`

<p style={{ marginTop: '-15px' }}><i>(required)</i></p>

The item to write:

```ts
const transaction = PokemonEntity.build(PutTransaction)
  .item({
    pokemonId: 'pikachu1',
    name: 'Pikachu',
    pokeType: 'electric',
    level: 50,
    ...
  })
```

You can use the `PutItemInput` type from the [`PutItemCommand`](../2-put-item/index.md) action to explicitely type an object as a `PutTransaction` item:

```ts
import type { PutItemInput } from 'dynamodb-toolbox/entity/actions/put'

const item: PutItemInput<typeof PokemonEntity> = {
  pokemonId: 'pikachu1',
  name: 'Pikachu',
  ...
}

const transaction =
  PokemonEntity.build(PutTransaction).item(item)
```

### `.options(...)`

Provides additional options:

```ts
const transaction = PokemonEntity.build(PutTransaction)
  .item(...)
  .options({
    // 👇 Checks that item didn't previously exist
    condition: { attr: 'pokemonId', exists: false }
  })
```

You can use the `PutTransactionOptions` type to explicitely type an object as a `PutTransaction` options:

```ts
import type { PutTransactionOptions } from 'dynamodb-toolbox/entity/actions/transactPut'

const options: PutTransactionOptions<
  typeof PokemonEntity
> = {
  condition: { attr: 'pokemonId', exists: false }
}

const transaction = PokemonEntity.build(PutTransaction)
  .item(...)
  .options(options)
```

Available options are (see the [DynamoDB documentation](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_TransactWriteItems.html#API_TransactWriteItems_RequestParameters) for more details):

| Option      |               Type                | Default | Description                                                                                                                                                                                                                   |
| ----------- | :-------------------------------: | :-----: | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `condition` | `Condition<typeof PokemonEntity>` |    -    | A condition that must be satisfied in order for the `PutTransaction` to succeed.<br/><br/>See the [`ConditionParser`](../17-parse-condition/index.md#building-conditions) action for more details on how to write conditions. |

```ts
PokemonEntity.build(PutTransaction)
  .item(...)
  .options({
    condition: { attr: 'pokemonId', exists: false }
  })
```

:::info

Contrary to [`PutItemCommands`](../2-put-item/index.md), put transactions cannot return the previous values of the written items.

:::
