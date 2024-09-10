---
title: ConditionCheck
sidebar_custom_props:
  sidebarActionType: util
---

# ConditionCheck

Builds a condition to check against an entity item for the transaction to succeed, to be used within [TransactWriteItems operations](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_TransactWriteItems.html):

```ts
import { execute } from 'dynamodb-toolbox/entity/actions/transactWrite'
import { ConditionCheck } from 'dynamodb-toolbox/entity/actions/transactCheck'

const transaction = PokemonEntity.build(ConditionCheck)

const params = transaction.params()
await execute(transaction, ...otherTransactions)
```

`ConditionCheck` can be executed in conjunction with [`PutTransactions`](../12-transact-put/index.md), [`UpdateTransactions`](../13-transact-update/index.md) and [`DeleteTransactions`](../14-transact-delete/index.md).

:::info

Check the [Transaction Documentation](../10-transactions/index.md#transactwrite) to learn more about the `execute` function.

:::

:::caution

Only **one transaction per item** is supported. For instance, you cannot run a `ConditionCheck` and an `UpdateTransaction` on the same item: You can, however, condition the `UpdateTransaction` itself.

:::

## Request

### `.key(...)`

<p style={{ marginTop: '-15px' }}><i>(required)</i></p>

The key of the item to check (i.e. attributes that are tagged as part of the primary key):

```ts
const transaction = PokemonEntity.build(ConditionCheck).key(
  { pokemonId: 'pikachu1' }
)
```

You can use the `KeyInput` type from the [`EntityParser`](../17-parse/index.md) action to explicitly type an object as a `ConditionCheck` key object:

```ts
import type { KeyInput } from 'dynamodb-toolbox/entity/actions/parse'

const key: KeyInput<typeof PokemonEntity> = {
  pokemonId: 'pikachu1'
}

const transaction =
  PokemonEntity.build(ConditionCheck).key(key)
```

### `.condition(...)`

<p style={{ marginTop: '-15px' }}><i>(required)</i></p>

The condition to check against:

```ts
const transaction = PokemonEntity.build(ConditionCheck)
  .key(...)
  .condition({ attr: 'level', gte: 50 })
```

See the [`ConditionParser`](../18-parse-condition/index.md#building-conditions) action for more details on how to write conditions.

### `.options(...)`

Provides additional options:

```ts
const transaction = PokemonEntity.build(ConditionCheck)
  .options({ ... })
```

You can use the `ConditionCheckOptions` type to explicitly type an object as a `ConditionCheck` options object:

```ts
import type { ConditionCheckOptions } from 'dynamodb-toolbox/entity/actions/transactCheck'

const options: ConditionCheckOptions<
  typeof PokemonEntity
> = { ... }

const transaction = PokemonEntity.build(ConditionCheck)
  .options(options)
```

Available options:

| Option      |   Type   | Default | Description                                                                                               |
| ----------- | :------: | :-----: | --------------------------------------------------------------------------------------------------------- |
| `tableName` | `string` |    -    | Overrides the `Table` name. Mostly useful for [multitenancy](https://en.wikipedia.org/wiki/Multitenancy). |

:::noteExamples

```ts
const transaction = PokemonEntity.build(ConditionCheck)
  .key(...)
  .condition(...)
  .options({
    tableName: `tenant-${tenantId}-pokemons`
  })
```

:::
