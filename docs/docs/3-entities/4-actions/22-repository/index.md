---
title: Repository
sidebar_custom_props:
  sidebarActionType: util
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Repository

A utility action that exposes entity actions as **methods**. Using it leads to heavier bundles (as it necessarily imports all of their code) but provides a more concise syntax:

```ts
import { Repository } from 'dynamodb-toolbox/entity/actions/repository'

const pokemonRepository = PokemonEntity.build(Repository)

// 👇 Sends a `PutItemCommand`
await pokemonRepository.put(pokemon)
```

:::note

Note that [`Spies`](../21-spy/index.md) can still be used in cunjunction with `Repositories` as commands are still sent under the hood.

:::

## Methods

### `get(...)`

<p style={{ marginTop: '-15px' }}><i><code>(key: KeyInputItem&lt;ENTITY&gt;, opt?: OPTIONS) => GetItemResponse&lt;ENTITY, OPTIONS&gt;</code></i></p>

Performs a [GetItem Operation](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_GetItem.html). See [`GetItemCommand`](../1-get-item/index.md) for more details:

:::note[Examples]

<Tabs>
<TabItem value="usage" label="Usage">

```ts
const { Item } = await pokemonRepository.get({
  pokemonId: 'pikachu1'
})
```

</TabItem>
<TabItem value="options" label="Options">

```ts
const { Item } = await pokemonRepository.get(
  { pokemonId: 'pikachu1' },
  { consistent: true }
)
```

</TabItem>
</Tabs>

:::

### `put(...)`

<p style={{ marginTop: '-15px' }}><i><code>(item: PutItemInput&lt;ENTITY&gt;, opt?: OPTIONS) => PutItemResponse&lt;ENTITY, OPTIONS&gt;</code></i></p>

Performs a [PutItem Operation](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_PutItem.html). See [`PutItemCommand`](../2-put-item/index.md) for more details:

:::note[Examples]

<Tabs>
<TabItem value="usage" label="Usage">

```ts
await pokemonRepository.put({
  pokemonId: 'pikachu1',
  name: 'Pikachu',
  pokeType: 'electric',
  level: 50
  ...
})
```

</TabItem>
<TabItem value="options" label="Options">

```ts
await pokemonRepository.put(
  {
    pokemonId: 'pikachu1',
    name: 'Pikachu',
    pokeType: 'electric',
    level: 50
    ...
  },
  { returnValues: 'ALL_OLD' }
)
```

</TabItem>
</Tabs>

:::

### `update(...)`

<p style={{ marginTop: '-15px' }}><i><code>(item: UpdateItemInput&lt;ENTITY&gt;, opt?: OPTIONS) => UpdateItemResponse&lt;ENTITY, OPTIONS&gt;</code></i></p>

Performs an [UpdateItem Operation](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_UpdateItem.html). See [`UpdateItemCommand`](../3-update-item/index.md) for more details:

:::note[Examples]

<Tabs>
<TabItem value="usage" label="Usage">

```ts
await pokemonRepository.update({
  pokemonId: 'pikachu1',
  level: $add(1)
  ...
})
```

</TabItem>
<TabItem value="options" label="Options">

```ts
await pokemonRepository.update(
  {
    pokemonId: 'pikachu1',
    level: $add(1)
    ...
  },
  { returnValues: 'UPDATED_OLD' }
)
```

</TabItem>
</Tabs>

:::

### `updateAttributes(...)`

<p style={{ marginTop: '-15px' }}><i><code>(item: UpdateAttributesInput&lt;ENTITY&gt;, opt?: OPTIONS) => UpdateAttributesResponse&lt;ENTITY, OPTIONS&gt;</code></i></p>

Performs an [UpdateAttributes Operation](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_UpdateAttributes.html) (similar to [`UpdateItemCommand`](../3-update-item/index.md) except than deep attribute updates are **non-partial**). See [`UpdateAttributesCommand`](../4-update-attributes/index.md) for more details:

:::note[Examples]

<Tabs>
<TabItem value="usage" label="Usage">

```ts
await pokemonRepository.updateAttributes({
  pokemonId: 'pikachu1',
  level: 12
  ...
})
```

</TabItem>
<TabItem value="options" label="Options">

```ts
await pokemonRepository.updateAttributes(
  {
    pokemonId: 'pikachu1',
    level: 12
    ...
  },
  { returnValues: 'UPDATED_OLD' }
)
```

</TabItem>
</Tabs>

:::

### `delete(...)`

<p style={{ marginTop: '-15px' }}><i><code>(item: KeyInputItem&lt;ENTITY&gt;, opt?: OPTIONS) => DeleteItemResponse&lt;ENTITY, OPTIONS&gt;</code></i></p>

Performs a [DeleteItem Operation](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_DeleteItem.html). See [`DeleteItemCommand`](../5-delete-item/index.md) for more details:

:::note[Examples]

<Tabs>
<TabItem value="usage" label="Usage">

```ts
await pokemonRepository.delete({ pokemonId: 'pikachu1' })
```

</TabItem>
<TabItem value="options" label="Options">

```ts
await pokemonRepository.delete(
  { pokemonId: 'pikachu1' },
  { returnValues: 'ALL_OLD' }
)
```

</TabItem>
</Tabs>

:::

## Batching

### `batchGet(...)`

<p style={{ marginTop: '-15px' }}><i><code>(key: KeyInputItem&lt;ENTITY&gt;) => BatchGetRequest&lt;ENTITY&gt;</code></i></p>

Builds a request to get an entity item, to be used within [`BatchGetCommands`](../../../2-tables/2-actions/5-batch-get/index.md). See [`BatchGetRequest`](../7-batch-get/index.md) for more details:

:::note[Examples]

```ts
const request = pokemonRepository.batchGet({
  pokemonId: 'pikachu1'
})
```

:::

### `batchPut(...)`

<p style={{ marginTop: '-15px' }}><i><code>(item: PutItemInput&lt;ENTITY&gt;) => BatchPutRequest&lt;ENTITY&gt;</code></i></p>

Builds a request to put an entity item, to be used within [`BatchWriteCommands`](../../../2-tables/2-actions/6-batch-write/index.md). See [`BatchPutRequest`](../8-batch-put/index.md) for more details:

:::note[Examples]

```ts
const request = pokemonRepository.batchPut({
  pokemonId: 'pikachu1',
  name: 'Pikachu',
  pokeType: 'electric',
  level: 50,
  ...
})
```

:::

### `batchDelete(...)`

<p style={{ marginTop: '-15px' }}><i><code>(key: KeyInputItem&lt;ENTITY&gt;) => BatchDeleteRequest&lt;ENTITY&gt;</code></i></p>

Builds a request to delete an entity item, to be used within [`BatchWriteCommands`](../../../2-tables/2-actions/6-batch-write/index.md). See [`BatchDeleteRequest`](../9-batch-delete/index.md) for more details:

:::note[Examples]

```ts
const request = pokemonRepository.batchDelete({
  pokemonId: 'pikachu1'
})
```

:::

## Transactions

### `transactGet(...)`

<p style={{ marginTop: '-15px' }}><i><code>(key: KeyInputItem&lt;ENTITY&gt;, opt?: OPTIONS) => GetTransaction&lt;ENTITY, OPTIONS&gt;</code></i></p>

Builds a transaction to get an entity item, to be used within [TransactGetItems operations](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_TransactGetItems.html). See [`GetTransaction`](../11-transact-get/index.md) for more details:

:::note[Examples]

<Tabs>
<TabItem value="usage" label="Usage">

```ts
const transaction = pokemonRepository.transactGet({
  pokemonId: 'pikachu1'
})
```

</TabItem>
<TabItem value="options" label="Options">

```ts
const transaction = pokemonRepository.transactGet(
  { pokemonId: 'pikachu1' },
  { attributes: ['name', 'level'] }
)
```

</TabItem>
</Tabs>

:::

### `executeTransactGet(...)`

<p style={{ marginTop: '-15px' }}><i><code><b>static</b> (opt?: OPTIONS, ...transac: TRANSACTIONS) => ExecuteTransactGetResponses&lt;TRANSACTIONS&gt;</code></i></p>

The [`TransactGet` executor](../11-transact-get/index.md#execution) exposed as a **static** method:

:::note[Examples]

<Tabs>
<TabItem value="usage" label="Usage">

```ts
const { Responses } = await Repository.executeTransactGet(
  pokemonRepository.transactGet(...),
  pokemonRepository.transactGet(...),
)
```

</TabItem>
<TabItem value="options" label="Options">

```ts
const { Responses } = await Repository.executeTransactGet(
   { capacity: 'TOTAL' },
  pokemonRepository.transactGet(...),
  pokemonRepository.transactGet(...),
)
```

</TabItem>
</Tabs>

:::

### `transactPut(...)`

<p style={{ marginTop: '-15px' }}><i><code>(item: PutItemInput&lt;ENTITY&gt;, opt?: OPTIONS) => PutTransaction&lt;ENTITY, OPTIONS&gt;</code></i></p>

Builds a transaction to put an entity item, to be used within [TransactWriteItems operations](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_TransactWriteItems.html). See [`PutTransaction`](../12-transact-put/index.md) for more details:

:::note[Examples]

<Tabs>
<TabItem value="usage" label="Usage">

```ts
const transaction = pokemonRepository.transactPut({
  pokemonId: 'pikachu1',
  name: 'Pikachu',
  pokeType: 'electric',
  level: 50
  ...
})
```

</TabItem>
<TabItem value="options" label="Options">

```ts
const transaction = pokemonRepository.transactPut(
  {
    pokemonId: 'pikachu1',
    name: 'Pikachu',
    pokeType: 'electric',
    level: 50
    ...
  },
  { condition: { attr: 'pokemonId', exists: false } }
)
```

</TabItem>
</Tabs>

:::

### `transactUpdate(...)`

<p style={{ marginTop: '-15px' }}><i><code>(item: UpdateItemInput&lt;ENTITY&gt;, opt?: OPTIONS) => UpdateTransaction&lt;ENTITY, OPTIONS&gt;</code></i></p>

Builds a transaction to update an entity item, to be used within [TransactWriteItems operations](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_TransactWriteItems.html). See [`UpdateTransaction`](../13-transact-update/index.md) for more details:

:::note[Examples]

<Tabs>
<TabItem value="usage" label="Usage">

```ts
const transaction = pokemonRepository.transactUpdate({
  pokemonId: 'pikachu1',
  level: $add(1)
  ...
})
```

</TabItem>
<TabItem value="options" label="Options">

```ts
const transaction = pokemonRepository.transactUpdate(
  {
    pokemonId: 'pikachu1',
    level: $add(1)
    ...
  },
  { condition: { attr: 'level', lt: 99 } }
)
```

</TabItem>
</Tabs>

:::

### `transactDelete(...)`

<p style={{ marginTop: '-15px' }}><i><code>(key: KeyInputItem&lt;ENTITY&gt;, opt?: OPTIONS) => DeleteTransaction&lt;ENTITY, OPTIONS&gt;</code></i></p>

Builds a transaction to delete an entity item, to be used within [TransactWriteItems operations](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_TransactWriteItems.html). See [`DeleteTransaction`](../14-transact-delete/index.md) for more details:

:::note[Examples]

<Tabs>
<TabItem value="usage" label="Usage">

```ts
const transaction = pokemonRepository.transactDelete({
  pokemonId: 'pikachu1'
})
```

</TabItem>
<TabItem value="options" label="Options">

```ts
const transaction = pokemonRepository.transactDelete(
  { pokemonId: 'pikachu1' },
  { condition: { attr: 'archived', eq: true } }
)
```

</TabItem>
</Tabs>

:::

### `transactCheck(...)`

<p style={{ marginTop: '-15px' }}><i><code>(key: KeyInputItem&lt;ENTITY&gt;, cond: Condition&lt;ENTITY&gt;, opt?: OPTIONS) => ConditionCheck&lt;ENTITY&gt;</code></i></p>

Builds a condition to check against an entity item for the transaction to succeed, to be used within [TransactWriteItems operations](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_TransactWriteItems.html). See [`ConditionCheck`](../15-condition-check/index.md) for more details:

:::note[Examples]

<Tabs>
<TabItem value="usage" label="Usage">

```ts
const transaction = pokemonRepository.transactCheck(
  { pokemonId: 'pikachu1' },
  { attr: 'level', gte: 50 }
)
```

</TabItem>
<TabItem value="options" label="Options">

```ts
const transaction = pokemonRepository.transactCheck(
  { pokemonId: 'pikachu1' },
  { attr: 'level', gte: 50 },
  { tableName: `tenant-${tenantId}-pokemons` }
)
```

</TabItem>
</Tabs>

:::

### `executeTransactWrite(...)`

<p style={{ marginTop: '-15px' }}><i><code><b>static</b> (opt?: OPTIONS, ...transac: TRANSACTIONS) => ExecuteTransactWriteResponses&lt;TRANSACTIONS&gt;</code></i></p>

The [`TransactGet` executor](../11-transact-get/index.md#execution) exposed as a **static** method:

:::note[Examples]

<Tabs>
<TabItem value="usage" label="Usage">

```ts
const { Responses } = await Repository.executeTransactGet(
  pokemonRepository.transactGet(...),
  pokemonRepository.transactGet(...),
)
```

</TabItem>
<TabItem value="options" label="Options">

```ts
const { Responses } = await Repository.executeTransactGet(
   { capacity: 'TOTAL' },
  pokemonRepository.transactGet(...),
  pokemonRepository.transactGet(...),
)
```

</TabItem>
</Tabs>

:::

## Utils

### `parse(...)`

<p style={{ marginTop: '-15px' }}><i><code>(input: unknown, opt?: OPTIONS) => ParserOutput&lt;ENTITY, OPTIONS&gt;</code></i></p>

Given an input of any type and a mode, validates that it respects the schema of the `Entity` and applies transformations. See [`EntityParser`](../17-parse/index.md) for more details:

:::note[Examples]

<Tabs>
<TabItem value="usage" label="Usage">

```ts
// 👇 Parsed item + Primary key
const { item, key } = pokemonRepository.parse(input)
```

</TabItem>
<TabItem value="options" label="Options">

```ts
// 👇 Primary key
const { key } = pokemonRepository.parse(input, {
  mode: 'key'
})
```

</TabItem>
</Tabs>

:::

### `parseCondition(...)`

<p style={{ marginTop: '-15px' }}><i><code>(condition: Condition&lt;ENTITY&gt;) => ConditionExpression</code></i></p>

Builds a [Condition Expression](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.ConditionExpressions.html) that can be used to condition write operations, or filter the results of a [Query](../../../2-tables/2-actions/2-query/index.md) or a [Scan](../../../2-tables/2-actions/1-scan/index.md). See [`ConditionParser`](../18-parse-condition/index.md) for more details:

:::note[Examples]

```ts
// 👇 To be used in DynamoDB commands
const {
  ConditionExpression,
  ExpressionAttributeNames,
  ExpressionAttributeValues
} = pokemonRepository.parseCondition({
  // Pokemons with levels ≥ 50
  attr: 'level',
  gte: 50
})
```

:::

### `parsePaths(...)`

<p style={{ marginTop: '-15px' }}><i><code>(paths: Path&lt;ENTITY&gt;[]) => ProjectionExpression</code></i></p>

Builds a [Projection Expression](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.ProjectionExpressions.html) that can be used to filter the returned attributes of a read operation like a [GetItem](../1-get-item/index.md), [Query](../../../2-tables/2-actions/2-query/index.md) or [Scan](../../../2-tables/2-actions/1-scan/index.md). See [`PathParser`](../19-parse-paths/index.md) for more details:

:::note[Examples]

```ts
// 👇 To be used in DynamoDB commands
const { ProjectionExpression, ExpressionAttributeNames } =
  pokemonRepository.parsePaths(['name', 'level'])
```

:::

### `format(...)`

<p style={{ marginTop: '-15px' }}><i><code>(item: unknown, opt?: OPTIONS) => FormattedItem&lt;ENTITY, OPTIONS&gt;</code></i></p>

Given a transformed item, validates that it respects the schema of the `Entity`, applies transformations backward and hide hidden attributes. See [`EntityFormatter`](../20-format/index.md) for more details:

:::note[Examples]

<Tabs>
<TabItem value="usage" label="Usage">

```ts
const formattedPikachu = pokemonRepository.format(
  transformedPikachu
)
```

</TabItem>
<TabItem value="options" label="Options">

```ts
const partialPikachu = pokemonRepository.format(
  transformedPikachu,
  { partial: true }
)
```

</TabItem>
</Tabs>

:::
