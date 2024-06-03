---
title: Query
sidebar_custom_props:
  sidebarActionType: read
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# QueryCommand

Performs a [Query Operation](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Query.html) on a `Table`.

## Usage

```ts
import { QueryCommand } from 'dynamodb-toolbox/table/actions/query'

const queryCommand = PokeTable.build(QueryCommand)

const params = queryCommand.params()
const { Items } = await queryCommand.send()
```

## Query

<p style={{ marginTop: '-15px' }}><i>(required)</i></p>

The partition to query, with optional index and range condition:

- `partition`: The partition key to query.
- <code>index <i>(optional)</i></code>: The name of a secondary index to query.
- <code>range <i>(optional)</i></code>: If the table or index has a sort key, an optional range condition.

```ts
// Get 'ashKetchum' pokemons with a level ≥ 50
await PokeTable.build(QueryCommand)
  .query({
    index: 'byTrainerId',
    partition: 'TRAINER:ashKetchum',
    range: { gte: 50 }
  })
  .send()
```

You can use the `Query` type to explicitely type an object as a `QueryCommand` query:

```ts
import type { Query } from 'dynamodb-toolbox/table/actions/query'

const query: Query<typeof PokeTable> = {
  index: 'byTrainerId',
  partition: 'TRAINER:ashKetchum1',
  range: { gte: 50 }
}

const { Items } = await PokeTable.build(QueryCommand)
  .query(query)
  .send()
```

## Entities

Provides a list of entities to filter the returned items (via the internal [`entity`](../../../3-entities/1-usage/index.md#entity-attribute) attribute). Does also format them and type the response.

```ts
// 👇 Typed as (Pokemon | Trainer)[]
const { Items } = await PokeTable.build(QueryCommand)
  .query(query)
  .entities(PokemonEntity, TrainerEntity)
  .send()
```

## Options

Provides additional options:

```ts
const { Items } = await PokeTable.build(QueryCommand)
  .options({
    consistent: true,
    limit: 10
    ...
  })
  .send()
```

You can use the `QueryOptions` type to explicitely type an object as a `QueryCommand` options:

```ts
import type { QueryOptions } from 'dynamodb-toolbox/table/actions/query'

const scanOptions: QueryOptions<
  typeof PokeTable,
  // 👇 Optional entities
  [typeof PokemonEntity, typeof TrainerEntity]
> = {
  consistent: true,
  limit: 10,
  ...
}

const { Items } = await PokeTable.build(QueryCommand)
  .query(query)
  .entities(PokemonEntity, TrainerEntity)
  .options(scanOptions)
  .send()
```

:::info

It is advised to provide `entities` and `query` first as they constrain the `options` type.

:::

Available options are (see the [DynamoDB documentation](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Query.html#API_Query_RequestParameters) for more details):

<table>
    <thead>
        <tr>
            <th>Cat.</th>
            <th>Option</th>
            <th>Type</th>
            <th>Default</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td rowspan="4" align="center" style={{ writingMode: "vertical-lr", transform: "rotate(180deg)" }}><b>General</b></td>
            <td><code>consistent</code></td>
            <td align="center"><code>boolean</code></td>
            <td align="center"><code>false</code></td>
            <td>
              By default, read operations are <b>eventually</b> consistent (which improves performances and reduces costs).
              <br/><br/>Set to <code>true</code> to use <b>strongly</b> consistent reads (unavailable on secondary indexes).
            </td>
        </tr>
        <tr>
            <td><code>index</code></td>
            <td align="center"><code>string</code></td>
            <td align="center">-</td>
            <td>
              The name of a secondary index to query.
              <br/><br/>This index can be any local secondary index or global secondary index.
            </td>
        </tr>
        <tr>
            <td><code>reverse</code></td>
            <td align="center"><code>boolean</code></td>
            <td align="center"><code>false</code></td>
            <td>
              Specifies the order for index traversal.
              <br/><br/>By default, the traversal is performed in ascending order. If set to <code>true</code>, the traversal is performed in descending order.
            </td>
        </tr>
        <tr>
            <td><code>capacity</code></td>
            <td align="center"><code>CapacityOption</code></td>
            <td align="center"><code>"NONE"</code></td>
            <td>
              Determines the level of detail about provisioned or on-demand throughput consumption that is returned in the response.
              <br/><br/>Possible values are <code>"NONE"</code>, <code>"TOTAL"</code> and <code>"INDEXES"</code>.
            </td>
        </tr>
        <tr>
            <td rowspan="3" align="center" style={{ writingMode: "vertical-lr", transform: "rotate(180deg)" }}><b>Pagination</b></td>
            <td><code>limit</code></td>
            <td align="center"><code>integer ≥ 1</code></td>
            <td align="center">-</td>
            <td>
              The maximum number of items to evaluate for 1 page.
              <br/><br/>Note that DynamoDB may return a lower number of items if it reaches the limit of 1MB, or if filters are applied.
            </td>
        </tr>
        <tr>
            <td><code>exclusiveStartKey</code></td>
            <td align="center"><code>Key</code></td>
            <td align="center">-</td>
            <td>The primary key of the first item that this operation evaluates. Use the <code>LastEvaluatedKey</code> from the previous operation.</td>
        </tr>
        <tr>
            <td><code>maxPages</code></td>
            <td align="center"><code>integer ≥ 1</code></td>
            <td align="center"><code>1</code></td>
            <td>
              A "meta" option provided by DynamoDB-Toolbox to send multiple requests in a single promise.
              <br/><br/>Note that <code>Infinity</code> is a valid (albeit dangerous) option.
              <br/><br/>If two pages or more have been fetched, the responses <code>Count</code> and <code>ScannedCount</code> are summed, but the <code>ConsumedCapacity</code> is omitted for the moment.
            </td>
        </tr>
        <tr>
            <td rowspan="3" align="center" style={{ writingMode: "vertical-lr", transform: "rotate(180deg)" }}><b>Filters</b></td>
            <td><code>select</code></td>
            <td align="center"><code>SelectOption</code></td>
            <td align="center">-</td>
            <td>
              The strategy for returned attributes. You can retrieve all attributes, specific attributes, the count of matching items, or in the case of an index, some or all of the projected attributes.
              <br/><br/>Possible values are <code>"ALL_ATTRIBUTES"</code>, <code>"ALL_PROJECTED_ATTRIBUTES"</code> (if <code>index</code> is specified), <code>"COUNT"</code> and <code>"SPECIFIC_ATTRIBUTES"</code> (if <code>attributes</code> are specified)
            </td>
        </tr>
        <tr>
            <td><code>filters</code></td>
            <td align="center"><code>Record&lt;string, Condition&gt;</code></td>
            <td align="center">-</td>
            <td>
              For each entity name, a condition that must be satisfied in order for evaluated items of this entity to be returned (improves performances but does not reduce costs).
              <br/><br/>Requires <a href="#entities"><code>entities</code></a>.
              <br/><br/>See the <a href="../../entities/actions/parse-condition"><code>ConditionParser</code> action</a> for more details on how to write conditions.
            </td>
        </tr>
        <tr>
            <td><code>attributes</code></td>
            <td align="center"><code>string[]</code></td>
            <td align="center">-</td>
            <td>
              To specify a list of attributes to retrieve (improves performances but does not reduce costs).
              <br/><br/>Requires <a href="#entities"><code>entities</code></a>. Paths must be common to all entities.
              <br/><br/>See the <a href="../../entities/actions/parse-paths"><code>PathParser</code> action</a> for more details on how to write attribute paths.
            </td>
        </tr>
    </tbody>
</table>

:::noteExamples

<Tabs>
<TabItem value="consistent" label="Strongly consistent">

```ts
const { Items } = await PokeTable.build(QueryCommand)
  .query({ partition: 'ashKetchum' })
  .entities(PokemonEntity)
  .options({ consistent: true })
  .send()
```

</TabItem>
<TabItem value="indexed" label="On index">

```ts
const { Items } = await PokeTable.build(QueryCommand)
  .query({
    index: 'byTrainerId',
    partition: 'TRAINER:ashKetchum',
    range: { gte: 50 }
  })
  .entities(PokemonEntity)
  .send()
```

</TabItem>
<TabItem value="reverse" label="Reversed">

```ts
const { Items } = await PokeTable.build(QueryCommand)
  .query({ partition: 'ashKetchum' })
  .entities(PokemonEntity)
  .options({ reverse: true })
  .send()
```

</TabItem>
</Tabs>

:::

:::notePaginated

<Tabs>
<TabItem value="paginated" label="Paginated">

```ts
let lastEvaluatedKey:
  | Record<string, unknown>
  | undefined = undefined
const command = PokeTable.build(QueryCommand).query({
  partition: 'ashKetchum'
})

do {
  const page = await command
    .options({ exclusiveStartKey: lastEvaluatedKey })
    .send()

  // ...do something with page.Items here...

  lastEvaluatedKey = page.LastEvaluatedKey
} while (lastEvaluatedKey !== undefined)
```

</TabItem>
<TabItem value="partition" label="All Partition">

```ts
const { Items } = await PokeTable.build(QueryCommand)
  .query({ partition: 'ashKetchum' })
  // Retrieve all items from the partition (beware of RAM issues!)
  .options({ maxPages: Infinity })
  .send()
```

</TabItem>

</Tabs>

:::

:::noteFiltered

<Tabs>
<TabItem value="filtered" label="Filtered">

```ts
const { Items } = await PokeTable.build(QueryCommand)
  .query({ partition: 'ashKetchum' })
  .entities(PokemonEntity, TrainerEntity)
  .options({
    filters: {
      POKEMONS: { attr: 'type', eq: 'fire' },
      TRAINERS: { attr: 'age', gt: 18 }
    }
  })
  .send()
```

</TabItem>
<TabItem value="attributes" label="Attributes">

```ts
const { Items } = await PokeTable.build(QueryCommand)
  .query({ partition: 'ashKetchum' })
  .entities(PokemonEntity)
  .options({ attributes: ['name', 'type'] })
  .send()
```

</TabItem>
<TabItem value="count" label="Count">

```ts
const { Count } = await PokeTable.build(QueryCommand)
  .query({ partition: 'ashKetchum' })
  .options({ select: 'COUNT' })
  .send()
```

</TabItem>
</Tabs>

:::

:::

## Response

The data is returned with the same response syntax as the [DynamoDB Query API](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Query.html#API_Query_ResponseElements).

If a [`entities`](#entities) have been provided, the response `Items` are formatted by their respective entities.

You can use the `QueryResponse` type to explicitely type an object as a `QueryCommand` response:

```ts
import type { QueryResponse } from 'dynamodb-toolbox/table/actions/query'

const scanResponse: QueryResponse<
  typeof PokeTable,
  // 👇 Query
  { partition: 'ashKetchum' },
  // 👇 Optional entities
  [typeof PokemonEntity],
  // 👇 Optional options
  { attributes: ['name', 'type'] }
> = { Items: ... }
```
