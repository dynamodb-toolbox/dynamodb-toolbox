---
title: Query
sidebar_custom_props:
  sidebarActionType: read
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# QueryCommand

Performs a [Query Operation](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Query.html) on a `Table`:

```ts
import { QueryCommand } from 'dynamodb-toolbox/table/actions/query'

const queryCommand = PokeTable.build(QueryCommand)

const params = queryCommand.params()
const { Items } = await queryCommand.send()
```

## Request

### `.query(...)`

<p style={{ marginTop: '-15px' }}><i>(required)</i></p>

The partition to query, with optional index and range condition:

- `partition`: The partition key to query
- <code>index <i>(optional)</i></code>: The name of a secondary index to query
- <code>range <i>(optional)</i></code>: If the table or index has a sort key, an additional <a href="../../entities/actions/parse-condition#range-conditions">Range or Equality Condition</a>

```ts
// Get 'ashKetchum' pokemons
await PokeTable.build(QueryCommand)
  .query({ partition: 'ashKetchum' })
  .send()
```

:::info

When working with a global secondary index with **multi-attribute keys**, you must supply an array containing the corresponding value/range for each attribute:

```ts
await PokeTable.build(QueryCommand)
  .query({
    index: 'byTrainerIdCaptureYearPokeTypeAndLevel',
    partition: ['ashKetchum', 2022], // trainerId > captureYear
    range: ['fire', { gte: 50 }] // type > level (range must be last)
  })
  .send()
```

:::

You can use the `Query` type to explicitly type an object as a `QueryCommand` query object:

```ts
import type { Query } from 'dynamodb-toolbox/table/actions/query'

// Get 'ashKetchum1' pokemons with a level ≥ 50
const query: Query<typeof PokeTable> = {
  index: 'byTrainerId',
  partition: 'ashKetchum1',
  range: { gte: 50 }
}

const { Items } = await PokeTable.build(QueryCommand)
  .query(query)
  .send()
```

### `.entities(...)`

Provides a list of entities to filter the returned items (via the internal [`entity`](../../../3-entities/2-internal-attributes/index.md#entity) attribute). Also **formats** them and **types** the response:

```ts
// 👇 Typed as (Pokemon | Trainer)[]
const { Items } = await PokeTable.build(QueryCommand)
  .entities(PokemonEntity, TrainerEntity)
  .query(query)
  .send()
```

### `.options(...)`

Provides additional options:

```ts
const { Items } = await PokeTable.build(QueryCommand)
  .options({
    consistent: true,
    limit: 10,
    ...
  })
  .send()
```

You can **provide a callback** to partially update previous options:

```ts
const { Items } = await queryCommand
  .options(prevOptions => ({ ...prevOptions, limit: 10 }))
  .send()
```

You can use the `QueryOptions` type to explicitly type an object as a `QueryCommand` options object:

```ts
import type { QueryOptions } from 'dynamodb-toolbox/table/actions/query'

const queryOptions: QueryOptions<
  typeof PokeTable,
  // 👇 Optional entities
  [typeof PokemonEntity, typeof TrainerEntity]
> = {
  consistent: true,
  limit: 10,
  ...
}

const { Items } = await PokeTable.build(QueryCommand)
  .entities(PokemonEntity, TrainerEntity)
  .query(query)
  .options(queryOptions)
  .send()
```

:::info

It is advised to provide `entities` and `query` first as they constrain the `options` type.

:::

Available options (see the [DynamoDB documentation](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Query.html#API_Query_RequestParameters) for more details):

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
            <td rowSpan="5" align="center" className="vertical"><b>General</b></td>
            <td><code>consistent</code></td>
            <td align="center"><code>boolean</code></td>
            <td align="center"><code>false</code></td>
            <td>
              By default, read operations are <b>eventually</b> consistent (which improves performances and reduces costs).
              <br/><br/>Set to <code>true</code> to use <b>strongly</b> consistent reads (unavailable on global secondary indexes).
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
            <td><code>tableName</code></td>
            <td align="center"><code>string</code></td>
            <td align="center">-</td>
            <td>
              Overrides the <code>Table</code> name. Mostly useful for <a href="https://en.wikipedia.org/wiki/Multitenancy">multitenancy</a>.
            </td>
        </tr>
        <tr>
            <td><code>showEntityAttr</code></td>
            <td align="center"><code>boolean</code></td>
            <td align="center"><code>false</code></td>
            <td>
              Includes the <a href="../../entities/internal-attributes#entity"><code>entity</code></a> internal attribute in the returned items (even if it is hidden). Useful for easily distinguishing items based on their entities.
            </td>
        </tr>
        <tr>
            <td rowSpan="3" align="center" className="vertical"><b>Pagination</b></td>
            <td><code>limit</code></td>
            <td align="center"><code>integer ≥ 1</code></td>
            <td align="center">-</td>
            <td>
              The maximum number of items to evaluate
              <br/><br/>Note that DynamoDB may return a lower number of items if it reaches the limit of 1MB, or if filters are applied.
              <br/><br/>Applies for each page if <code>maxPages</code> is used.
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
            <td rowSpan="6" align="center" className="vertical"><b>Filters</b></td>
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
              <br/><br/>See the <a href="../../entities/actions/parse-condition#building-conditions"><code>ConditionParser</code></a> action for more details on how to write conditions.
            </td>
        </tr>
        <tr>
            <td><code>filter</code></td>
            <td align="center"><code>Condition</code></td>
            <td align="center">-</td>
            <td>
              An untyped condition that must be satisfied in order for evaluated items to be returned (improves performances but does not reduce costs).
              <br/><br/>No effect if <a href="#entities"><code>entities</code></a> are provided (use <code>filters</code> instead).
              <br/><br/>See the <a href="../../entities/actions/parse-condition#building-conditions"><code>ConditionParser</code></a> action for more details on how to write conditions.
            </td>
        </tr>
        <tr>
            <td><code>attributes</code></td>
            <td align="center"><code>string[]</code></td>
            <td align="center">-</td>
            <td>
              To specify a list of attributes to retrieve (improves performances but does not reduce costs).
              <br/><br/>Requires <a href="#entities"><code>entities</code></a>. Each path must match at least one entity schema.
              <br/><br/>See the <a href="../../entities/actions/parse-paths#paths"><code>PathParser</code></a> action for more details on how to write attribute paths.
            </td>
        </tr>
        <tr>
          <td><code>entityAttrFilter</code></td>
          <td align="center"><code>boolean</code></td>
          <td align="center">-</td>
          <td>
            If <a href="#entities"><code>entities</code></a> are specified, introduces a <a href="https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Scan.html#API_Scan_RequestSyntax">Filter Expression</a> on the <a href="../../entities/internal-attributes#entity"><code>entity</code></a> attribute. Default value is <code>true</code> if the <code>entity</code> attribute is enabled in all entities and is not part of the queried <a href="#query"><code>index</code></a> key, <code>false</code> otherwise.
            <br/><br/>Setting this option to <code>false</code> is useful for querying items that lack the <a href="../../entities/internal-attributes#entity"><code>entity</code></a> internal attribute (e.g., when migrating to DynamoDB-Toolbox). In such cases, DynamoDB-Toolbox attempts to format the item with each entity until one succeeds.
            <br/><br/>Note that you can also use <a href="https://aws.amazon.com/fr/blogs/developer/middleware-stack-modular-aws-sdk-js/">Middleware Stacks</a> to reintroduce the entity attribute and improve performance.
          </td>
        </tr>
        <tr>
          <td><code>noEntityMatch<wbr/>Behavior</code></td>
          <td align="center"><code>NoEntityMatch<wbr/>Behavior</code></td>
          <td align="center"><code>"THROW"</code></td>
          <td>
            If <a href="#entities"><code>entities</code></a> are specified and <code>entityAttrFilter</code> is <code>false</code>, this option defines the behavior when a returned item fails to be formatted for all entities.
            <br/><br/>Possible values are <code>"THROW"</code> to throw an error and <code>"DISCARD"</code> to discard the item.
          </td>
        </tr>
    </tbody>
</table>

## Examples

:::note[Queries]

<Tabs>
<TabItem value="basic" label="Basic">

```ts
const { Items } = await PokeTable.build(QueryCommand)
  .query({ partition: 'ashKetchum' })
  .send()
```

</TabItem>
<TabItem value="entity" label="Entity">

```ts
const { Items } = await PokeTable.build(QueryCommand)
  .entities(PokemonEntity)
  .query({ partition: 'ashKetchum' })
  .send()
```

</TabItem>
<TabItem value="indexed" label="Index">

```ts
const { Items } = await PokeTable.build(QueryCommand)
  .query({
    index: 'byTrainerId',
    partition: 'ashKetchum',
    range: { gte: 50 }
  })
  .send()
```

</TabItem>
<TabItem value="multi-gsi-partition" label="Multi-attr. GSI (partition)">

```ts
const PokeTable = new Table({
  ...
  indexes: {
    byTrainerIdAndCaptureYear: {
      type: 'global',
      partitionKeys: [
        { name: 'trainerId', type: 'string' },
        { name: 'captureYear', type: 'number' }
      ]
    }
  }
})

const { Items } = await PokeTable.build(QueryCommand)
  .query({
    index: 'byTrainerIdAndCaptureYear',
    partition: ['ashKetchum', 2022]
  })
  .send()
```

</TabItem>
<TabItem value="multi-gsi-sort" label="Multi-attr. GSI (sort)">

```ts
const PokeTable = new Table({
  ...
  indexes: {
    byTrainerIdCaptureYearAndLevel: {
      type: 'global',
      partitionKey: { name: 'trainerId', type: 'string' },
      sortKeys: [
        { name: 'captureYear', type: 'number' },
        { name: 'level', type: 'number' }
      ]
    }
  }
})

// 👇 All Ash pokemons
const { Items } = await PokeTable.build(QueryCommand)
  .query({
    index: 'byTrainerIdCaptureYearAndLevel',
    partition: 'ashKetchum',
    range: []
  })
  .send()

// 👇 ...captured after 2022
const { Items } = await PokeTable.build(QueryCommand)
  .query({
    index: 'byTrainerIdCaptureYearAndLevel',
    partition: 'ashKetchum',
    range: [{ gte: 2022 }]
  })
  .send()

// 👇 ...captured in 2022 and level ≥ 50
const { Items } = await PokeTable.build(QueryCommand)
  .query({
    index: 'byTrainerIdCaptureYearAndLevel',
    partition: 'ashKetchum',
    range: [2022, { gte: 50 }]
  })
  .send()

// 👇 ...captured in 2022 and level = 50
const { Items } = await PokeTable.build(QueryCommand)
  .query({
    index: 'byTrainerIdCaptureYearAndLevel',
    partition: 'ashKetchum',
    range: [2022, 50] // Equivalent to [2022, { eq: 50 }]
  })
  .send()
```

</TabItem>
</Tabs>

:::

:::note[Options]

<Tabs>
<TabItem value="consistent" label="Consistent">

```ts
const { Items } = await PokeTable.build(QueryCommand)
  .query({ partition: 'ashKetchum' })
  .options({ consistent: true })
  .send()
```

</TabItem>
<TabItem value="reverse" label="Reversed">

```ts
const { Items } = await PokeTable.build(QueryCommand)
  .query({ partition: 'ashKetchum' })
  .options({ reverse: true })
  .send()
```

</TabItem>
<TabItem value="multitenant" label="Multitenant">

```ts
const { Items } = await PokeTable.build(QueryCommand)
  .query({ partition: 'ashKetchum' })
  .options({ tableName: `tenant-${tenantId}-pokemons` })
  .send()
```

</TabItem>
<TabItem value="multi-entity" label="Multi-Entities">

```ts
const { Items } = await PokeTable.build(QueryCommand)
  .entities(TrainerEntity, PokemonEntity)
  .query({ partition: 'ashKetchum' })
  .options({ showEntityAttr: true })
  .send()

for (const item of Items) {
  switch (item.entity) {
    case 'trainer':
      // 🙌 Typed as Trainer
      ...
    case 'pokemon':
      // 🙌 Typed as Pokemon
      ...
  }
}
```

</TabItem>
<TabItem value="aborted" label="Aborted">

```ts
const abortController = new AbortController()
const abortSignal = abortController.signal

const { Items } = await PokeTable.build(QueryCommand)
  .query({ partition: 'ashKetchum' })
  .send({ abortSignal })

// 👇 Aborts the command
abortController.abort()
```

</TabItem>
</Tabs>

:::

:::note[Paginated]

<Tabs>
<TabItem value="paginated" label="Paginated">

```ts
let lastEvaluatedKey: Record<string, unknown> | undefined
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

:::note[Filtered]

<Tabs>
<TabItem value="filters" label="Filters">

```ts
const { Items } = await PokeTable.build(QueryCommand)
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
<TabItem value="filter" label="Filter">

```ts
const { Items } = await PokeTable.build(QueryCommand)
  .query({ partition: 'ashKetchum' })
  .options({
    filter: { attr: 'pokeType', eq: 'fire' }
  })
  .send()
```

</TabItem>
<TabItem value="attributes" label="Attributes">

```ts
const { Items } = await PokeTable.build(QueryCommand)
  .entities(PokemonEntity)
  .query({ partition: 'ashKetchum' })
  .options({ attributes: ['name', 'type'] })
  .send()
```

</TabItem>
<TabItem value="entity-attr" label="Entity Attr.">

```ts
const { Items } = await PokeTable.build(QueryCommand)
  .entities(PokemonEntity, TrainerEntity)
  .query({ partition: 'ashKetchum' })
  .options({
    entityAttrFilter: false,
    noEntityMatchBehavior: 'DISCARD'
  })
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

## Response

The data is returned using the same response syntax as the [DynamoDB Query API](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Query.html#API_Query_ResponseElements).

If [`entities`](#entities) are provided, the response `Items` are formatted by their respective entities.

You can use the `QueryResponse` type to explicitly type an object as a `QueryCommand` response object:

```ts
import type { QueryResponse } from 'dynamodb-toolbox/table/actions/query'

const queryResponse: QueryResponse<
  typeof PokeTable,
  // 👇 Query
  { partition: 'ashKetchum' },
  // 👇 Optional entities
  [typeof PokemonEntity],
  // 👇 Optional options
  { attributes: ['name', 'type'] }
> = { Items: ... }
```
