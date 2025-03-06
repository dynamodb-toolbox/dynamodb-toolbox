---
title: TransactUpdate
sidebar_custom_props:
  sidebarActionType: write
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# UpdateTransaction

Builds a transaction to update an entity item, to be used within [TransactWriteItems operations](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_TransactWriteItems.html):

```ts
import { execute } from 'dynamodb-toolbox/entity/actions/transactWrite'
import { UpdateTransaction } from 'dynamodb-toolbox/entity/actions/transactUpdate'

const transaction = PokemonEntity.build(UpdateTransaction)

const params = transaction.params()
await execute(transaction, ...otherTransactions)
```

`UpdateTransactions` can be executed in conjunction with [`PutTransactions`](../12-transact-put/index.md), [`DeleteTransactions`](../14-transact-delete/index.md) and [`ConditionChecks`](../15-condition-check/index.md).

:::info

Check the [Transaction Documentation](../10-transactions/index.md#transactwrite) to learn more about the `execute` function.

:::

## Request

### `.item(...)`

<p style={{ marginTop: '-15px' }}><i>(required)</i></p>

The attributes to update, including the key:

```ts
import { $add } from 'dynamodb-toolbox/entity/actions/update'

const transaction = PokemonEntity.build(UpdateTransaction)
  .item({
    pokemonId: 'pikachu1',
    level: $add(1),
    ...
  })
```

Check the [`UpdateItemCommand`](../3-update-item/index.md) action to learn more about the `UpdateItem` syntax. You can use the `UpdateItemInput` type to explicitly type an object as an `UpdateTransaction` item object:

```ts
import type { UpdateItemInput } from 'dynamodb-toolbox/entity/actions/update'

const item: UpdateItemInput<typeof PokemonEntity> = {
  pokemonId: 'pikachu1',
  level: $add(1),
  ...
}

const transaction = PokemonEntity.build(
  UpdateTransaction
).item(item)
```

### `.options(...)`

Provides additional options:

```ts
const transaction = PokemonEntity.build(UpdateTransaction)
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

You can use the `UpdateTransactionOptions` type to explicitly type an object as a `UpdateTransaction` options object:

```ts
import type { UpdateTransactionOptions } from 'dynamodb-toolbox/entity/actions/transactUpdate'

const options: UpdateTransactionOptions<
  typeof PokemonEntity
> = {
  condition: { attr: 'level', lt: 99 }
}

const transaction = PokemonEntity.build(UpdateTransaction)
  .item(...)
  .options(options)
```

Available options (see the [DynamoDB documentation](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_TransactWriteItems.html#API_TransactWriteItems_RequestParameters) for more details):

| Option                                          |               Type                | Default  | Description                                                                                                                                                                                                                      |
| ----------------------------------------------- | :-------------------------------: | :------: | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `condition`                                     | `Condition<typeof PokemonEntity>` |    -     | A condition that must be satisfied in order for the `UpdateTransaction` to succeed.<br/><br/>See the [`ConditionParser`](../18-parse-condition/index.md#building-conditions) action for more details on how to write conditions. |
| <code>returnValuesOn<wbr/>ConditionFalse</code> |       `ReturnValuesOption`        | `"NONE"` | To get the item attributes if the `condition` fails.<br/><br/>Possible values are `"NONE"` and `"ALL_OLD"`.                                                                                                                      |
| `tableName`                                     |             `string`              |    -     | Overrides the `Table` name. Mostly useful for [multitenancy](https://en.wikipedia.org/wiki/Multitenancy).                                                                                                                        |

## Examples

:::note[Examples]

<Tabs>
<TabItem value="basic" label="Basic">

```ts
const transac = PokemonEntity.build(UpdateTransaction)
  .item({
    pokemonId: 'pikachu1',
    level: $add(1),
    ...
  })
```

</TabItem>
<TabItem value="condition" label="Conditional">

```ts
const transac = PokemonEntity.build(UpdateTransaction)
  .item(...)
  .options({
    // 👇 Makes sure that 'level' stays <= 99
    condition: { attr: 'level', lt: 99 },
    // 👇 Includes the Item in the error if not so
    returnValuesOnConditionFalse: 'ALL_OLD'
  })
```

</TabItem>
<TabItem value="multitenant" label="Multitenant">

```ts
const transac = PokemonEntity.build(UpdateTransaction)
  .item(...)
  .options({ tableName: `tenant-${tenantId}-pokemons` })
```

</TabItem>
</Tabs>

:::

:::info

Contrary to [`UpdateItemCommands`](../3-update-item/index.md), update transactions cannot return the previous or new values of the written items.

:::
