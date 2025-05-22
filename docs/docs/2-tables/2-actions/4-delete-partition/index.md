---
title: DeletePartition
sidebar_custom_props:
  sidebarActionType: delete
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# DeletePartition

:::warning

`DeletePartitionCommand` is exposed as a quality of life improvement, but is NOT an official DynamoDB operation (eventhough we wish it was).

Use it with ⚠️ **caution** ⚠️ It can be **long** and **costly** on large partitions, and **incomplete** in case of inconsistent read.

:::

Performs one or more [Query operations](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Query.html) on a `Table`, and then runs [`BatchWriteCommands`](../7-batch-write/index.md) to batch delete the returned items. Automatically iterates through query pages if needed:

```ts
import { DeletePartitionCommand } from 'dynamodb-toolbox/table/actions/deletePartition'

const deletePartitionCommand = PokeTable.build(
  DeletePartitionCommand
)

await deletePartitionCommand.send()
```

## Request

### `.query(...)`

<p style={{ marginTop: '-15px' }}><i>(required)</i></p>

The partition to query, with optional index and range condition:

- `partition`: The partition key to query
- <code>index <i>(optional)</i></code>: The name of a secondary index to query
- <code>range <i>(optional)</i></code>: If the table or index has a sort key, an additional <a href="../../entities/actions/parse-condition#range-conditions">Range or Equality Condition</a>

```ts
// Delete 'ashKetchum' pokemons
await PokeTable.build(DeletePartitionCommand)
  .entities(PokemonEntity)
  .query({ partition: 'ashKetchum' })
  .send()
```

:::info

See the [`QueryCommand`](../2-query/index.md#query) documentation for more details.

:::

### `.entities(...)`

<p style={{ marginTop: '-15px' }}><i>(required)</i></p>

Provides a list of entities to filter the deleted items (via the internal [`entity`](../../../3-entities/2-internal-attributes/index.md#entity) attribute). Required to build underlying [`BatchDeleteRequests`](../../../3-entities/4-actions/10-batch-delete/index.md):

```ts
await PokeTable.build(DeletePartitionCommand)
  // Deletes only `Pokemons` and `Trainers`
  .entities(PokemonEntity, TrainerEntity)
  .query(query)
  .send()
```

### `.options(...)`

Provides additional options:

```ts
await PokeTable.build(DeletePartitionCommand)
  .options({
    consistent: true,
    ...
  })
  .send()
```

You can use the `DeletePartitionOptions` type to explicitly type an object as a `DeletePartitionCommand` options object:

```ts
import type { DeletePartitionOptions } from 'dynamodb-toolbox/table/actions/deletePartition'

const queryOptions: DeletePartitionOptions<
  typeof PokeTable,
  [typeof PokemonEntity, typeof TrainerEntity]
  // 👇 Optional query
  { partition: string }
> = {
  consistent: true,
  ...
}

await PokeTable.build(DeletePartitionCommand)
  .entities(PokemonEntity, TrainerEntity)
  .query(query)
  .options(queryOptions)
  .send()
```

:::info

It is advised to provide `entities` and `query` first as they constrain the `options` type.

:::

Available options (see the [DynamoDB Query documentation](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Query.html#API_Query_RequestParameters) for more details):

<table>
    <thead>
        <tr>
            <th>Option</th>
            <th>Type</th>
            <th>Default</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>consistent</code></td>
            <td align="center"><code>boolean</code></td>
            <td align="center"><code>false</code></td>
            <td>
              By default, read operations are <b>eventually</b> consistent (which improves performances and reduces costs).
              <br/><br/>Set to <code>true</code> to use a <b>strongly</b> consistent query (unavailable on global secondary indexes).
            </td>
        </tr>
        <tr>
            <td><code>capacity</code></td>
            <td align="center"><code>CapacityOption</code></td>
            <td align="center"><code>"NONE"</code></td>
            <td>
              Determines the level of detail about provisioned or on-demand throughput consumption that is returned in the response.
              <br/><br/>Possible values are <code>"NONE"</code>, <code>"TOTAL"</code> and <code>"INDEXES"</code>.
              <br/><br/>(Applies for the query and the batch writes.)
            </td>
        </tr>
            <tr>
            <td><code>tableName</code></td>
            <td align="center"><code>string</code></td>
            <td align="center">-</td>
            <td>
              Overrides the <code>Table</code> name. Mostly useful for <a href="https://en.wikipedia.org/wiki/Multitenancy">multitenancy</a>.
            </td>
        </tr>
        <tr>
            <td><code>exclusiveStartKey</code></td>
            <td align="center"><code>Key</code></td>
            <td align="center">-</td>
            <td>The primary key of the first item that this operation evaluates.</td>
        </tr>
        <tr>
            <td><code>filters</code></td>
            <td align="center"><code>Record&lt;string, Condition&gt;</code></td>
            <td align="center">-</td>
            <td>
              For each entity name, a condition that must be satisfied in order for evaluated items of this entity to be deleted (improves performances but does not reduce costs).
              <br/><br/>See the <a href="../../entities/actions/parse-condition#building-conditions"><code>ConditionParser</code></a> action for more details on how to write conditions.
            </td>
        </tr>
        <tr>
          <td><code>entityAttrFilter</code></td>
          <td align="center"><code>boolean</code></td>
          <td align="center"><code>true</code></td>
          <td>
            By default, specifying <a href="#entities"><code>entities</code></a> introduces a <a href="https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Scan.html#API_Scan_RequestSyntax">Filter Expression</a> on the <a href="../../entities/internal-attributes#entity"><code>entity</code></a> internal attribute. Set this option to <code>false</code> to disable this behavior.
            <br/><br/>This option is useful for querying items that lack the <a href="../../entities/internal-attributes#entity"><code>entity</code></a> internal attribute (e.g., when migrating to DynamoDB-Toolbox). In this case, DynamoDB-Toolbox attempts to format the item for each entity and disregards it if none succeed.
            <br/><br/>Note that you can also use <a href="https://aws.amazon.com/fr/blogs/developer/middleware-stack-modular-aws-sdk-js/">Middleware Stacks</a> to reintroduce the entity attribute and improve performance.
          </td>
        </tr>
         <tr>
          <td><code>noEntityMatch<wbr/>Behavior</code></td>
          <td align="center"><code>NoEntityMatch<wbr/>Behavior</code></td>
          <td align="center"><code>"THROW"</code></td>
          <td>
            If <code>entityAttrFilter</code> is <code>false</code>, this option defines the behavior when a returned item fails to be formatted for all entities.
            <br/><br/>Possible values are <code>"THROW"</code> to throw an error and <code>"DISCARD"</code> to discard the item.
          </td>
        </tr>
    </tbody>
</table>

## Examples

:::note[Examples]

<Tabs>
<TabItem value="basic" label="Basic">

```ts
await PokeTable.build(DeletePartitionCommand)
  .entities(PokemonEntity)
  .query({ partition: 'ashKetchum' })
  .send()
```

</TabItem>
<TabItem value="consistent" label="Consistent">

```ts
await PokeTable.build(DeletePartitionCommand)
  .entities(PokemonEntity)
  .query({ partition: 'ashKetchum' })
  .options({ consistent: true })
  .send()
```

</TabItem>
<TabItem value="indexed" label="Index">

```ts
await PokeTable.build(DeletePartitionCommand)
  .entities(PokemonEntity)
  .query({
    index: 'byTrainerId',
    partition: 'ashKetchum',
    range: { gte: 50 }
  })
  .send()
```

</TabItem>
<TabItem value="filtered" label="Filtered">

```ts
await PokeTable.build(DeletePartitionCommand)
  .entities(PokemonEntity, TrainerEntity)
  .query({ partition: 'ashKetchum' })
  .options({
    filters: {
      POKEMONS: { attr: 'pokeType', eq: 'fire' },
      TRAINERS: { attr: 'age', gt: 18 }
    }
  })
  .send()
```

</TabItem>
<TabItem value="multitenant" label="Multitenant">

```ts
await PokeTable.build(DeletePartitionCommand)
  .entities(PokemonEntity)
  .query({ partition: 'ashKetchum' })
  .options({ tableName: `tenant-${tenantId}-pokemons` })
  .send()
```

</TabItem>
<TabItem value="aborted" label="Aborted">

```ts
const abortController = new AbortController()
const abortSignal = abortController.signal

await PokeTable.build(DeletePartitionCommand)
  .entities(PokemonEntity)
  .query({ partition: 'ashKetchum' })
  .send({ abortSignal })

// 👇 Aborts the command
abortController.abort()
```

</TabItem>
<TabItem value="entity-attr" label="Entity Attr.">

```ts
await PokeTable.build(DeletePartitionCommand)
  .entities(PokemonEntity, TrainerEntity)
  .query({ partition: 'ashKetchum' })
  .options({
    entityAttrFilter: false,
    noEntityMatchBehavior: 'DISCARD'
  })
  .send()
```

</TabItem>
</Tabs>

:::

## Response

The response syntax is similar to the [DynamoDB Query API](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Query.html#API_Query_ResponseElements), except that:

- `Items` are **not** returned
- The query `ConsumedCapacity` is renamed as `QueryConsumedCapacity`
- The batch write `ConsumedCapacity` is renamed as `BatchWriteConsumedCapacity`

You can use the `DeletePartitionResponse` type to explicitly type an object as a `DeletePartitionCommand` response object:

```ts
import type { DeletePartitionResponse } from 'dynamodb-toolbox/table/actions/deletePartition'

const deletePartitionResponse: DeletePartitionResponse<
  typeof PokeTable,
  // 👇 Query
  { partition: 'ashKetchum' },
  // 👇 Optional entities
  [typeof PokemonEntity],
> = { Count: ... }
```
