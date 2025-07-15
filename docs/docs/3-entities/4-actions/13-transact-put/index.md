---
title: TransactPut
sidebar_custom_props:
  sidebarActionType: write
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# PutTransaction

Builds a transaction to put an entity item, to be used within [TransactWriteItems operations](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_TransactWriteItems.html):

```ts
import { execute } from 'dynamodb-toolbox/entity/actions/transactWrite'
import { PutTransaction } from 'dynamodb-toolbox/entity/actions/transactPut'

const transaction = PokemonEntity.build(PutTransaction)

const params = transaction.params()
await execute(transaction, ...otherTransactions)
```

`PutTransactions` can be executed in conjunction with [`UpdateTransactions`](../15-transact-update/index.md), [`DeleteTransactions`](../14-transact-delete/index.md) and [`ConditionChecks`](../16-condition-check/index.md).

:::info

Check the [Transaction Documentation](../11-transactions/index.md#transactwrite) to learn more about the `execute` function.

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

You can use the `PutItemInput` type from the [`PutItemCommand`](../3-put-item/index.md) action to explicitly type an object as a `PutTransaction` item object:

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

You can **provide a callback** to partially update previous options:

```ts
const conditionedTransaction = putTransaction.options(
  prevOptions => ({
    ...prevOptions,
    condition: { attr: 'pokemonId', exists: false }
  })
)
```

You can use the `PutTransactionOptions` type to explicitly type an object as a `PutTransaction` options object:

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

Available options (see the [DynamoDB documentation](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_TransactWriteItems.html#API_TransactWriteItems_RequestParameters) for more details):

| Option                                          |               Type                | Default  | Description                                                                                                                                                                                                                   |
| ----------------------------------------------- | :-------------------------------: | :------: | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `condition`                                     | `Condition<typeof PokemonEntity>` |    -     | A condition that must be satisfied in order for the `PutTransaction` to succeed.<br/><br/>See the [`ConditionParser`](../19-parse-condition/index.md#building-conditions) action for more details on how to write conditions. |
| <code>returnValuesOn<wbr/>ConditionFalse</code> |       `ReturnValuesOption`        | `"NONE"` | To get the item attributes if the `condition` fails.<br/><br/>Possible values are `"NONE"` and `"ALL_OLD"`.                                                                                                                   |
| `tableName`                                     |             `string`              |    -     | Overrides the `Table` name. Mostly useful for [multitenancy](https://en.wikipedia.org/wiki/Multitenancy).                                                                                                                     |

## Examples

:::note[Examples]

<Tabs>
<TabItem value="basic" label="Basic">

```ts
const transac = PokemonEntity.build(PutTransaction).item({
  pokemonId: 'pikachu1',
  name: 'Pikachu',
  pokeType: 'electric',
  level: 50
})
```

</TabItem>
<TabItem value="condition" label="Conditional">

```ts
const transac = PokemonEntity.build(PutTransaction)
  .item(...)
  .options({
    // 👇 Checks that item didn't previously exist
    condition: { attr: 'pokemonId', exists: false },
    // 👇 Includes the Item in the error if so
    returnValuesOnConditionFalse: 'ALL_OLD'
  })
```

</TabItem>
<TabItem value="multitenant" label="Multitenant">

```ts
const transac = PokemonEntity.build(PutTransaction)
  .item(...)
  .options({ tableName: `tenant-${tenantId}-pokemons` })
```

</TabItem>
</Tabs>

:::

:::info

Contrary to [`PutItemCommands`](../3-put-item/index.md), put transactions cannot return the previous values of the written items.

:::
