---
title: Scan
sidebar_custom_props:
  sidebarActionType: read
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# ScanCommand

Performs a [Scan Operation](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Scan.html) on a `Table`:

```ts
import { ScanCommand } from 'dynamodb-toolbox/table/actions/scan'

const scanCommand = PokeTable.build(ScanCommand)

const params = scanCommand.params()
const { Items } = await scanCommand.send()
```

## Request

### `.entities(...)`

Provides a list of entities to filter the returned items (via the internal [`entity`](../../../3-entities/1-usage/index.md#entity-attribute) attribute). Also formats them and types the response.

```ts
// 👇 Typed as (Pokemon | Trainer)[]
const { Items } = await PokeTable.build(ScanCommand)
  .entities(PokemonEntity, TrainerEntity)
  .send()
```

### `.options(...)`

Provides additional options:

```ts
const { Items } = await PokeTable.build(ScanCommand)
  .options({
    consistent: true,
    limit: 10
    ...
  })
  .send()
```

You can use the `ScanOptions` type to explicitly type an object as a `ScanCommand` options object:

```ts
import type { ScanOptions } from 'dynamodb-toolbox/table/actions/scan'

const scanOptions: ScanOptions<
  typeof PokeTable,
  // 👇 Optional entities
  [typeof PokemonEntity, typeof TrainerEntity]
> = {
  consistent: true,
  limit: 10,
  ...
}

const { Items } = await PokeTable.build(ScanCommand)
  .options(scanOptions)
  .send()
```

:::info

It is advised to provide `entities` first as it constrains the `options` type.

:::

Available options (see the [DynamoDB documentation](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Scan.html#API_Scan_RequestParameters) for more details):

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
            <td rowspan="4" align="center" class="vertical"><b>General</b></td>
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
              The name of a secondary index to scan.
              <br/><br/>This index can be any local secondary index or global secondary index.
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
            <td rowSpan="3" align="center" class="vertical"><b>Pagination</b></td>
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
            <td rowSpan="4" align="center" class="vertical"><b>Filters</b></td>
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
          <td><code>entityAttrFilter</code></td>
          <td align="center"><code>boolean</code></td>
          <td align="center"><code>true</code></td>
          <td>
            By default, specifying <a href="#entities"><code>entities</code></a> introduces a <a href="https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Scan.html#API_Scan_RequestSyntax">Filter Expression</a> on the <a href="../../entities/internal-attributes#entity"><code>entity</code></a> internal attribute. Set this option to <code>false</code> to disable this behavior.
            <br/><br/>This option is useful for querying items that miss the <a href="../../entities/internal-attributes#entity"><code>entity</code></a> internal attribute (e.g. when migrating to DynamoDB-Toolbox), for instance in combination with <a href="https://aws.amazon.com/fr/blogs/developer/middleware-stack-modular-aws-sdk-js/">Middleware Stacks</a>.
            <br/><br/>Note that this can result in types being wrongly inferred, so be extra careful.
          </td>
        </tr>
        <tr>
            <td><code>attributes</code></td>
            <td align="center"><code>string[]</code></td>
            <td align="center">-</td>
            <td>
              To specify a list of attributes to retrieve (improves performances but does not reduce costs).
              <br/><br/>Requires <a href="#entities"><code>entities</code></a>. Paths must be common to all entities.
              <br/><br/>See the <a href="../../entities/actions/parse-paths#paths"><code>PathParser</code></a> action for more details on how to write attribute paths.
            </td>
        </tr>
        <tr>
            <td rowSpan="2" align="center" class="vertical"><b>Parallelism</b></td>
            <td><code>segment</code></td>
            <td align="center"><code>integer ≥ 0</code></td>
            <td align="center">-</td>
            <td>
              Identifies an individual segment to be scanned by an application worker (zero-based).
              <br/><br/><code>totalSegments</code> must be provided.
            </td>
        </tr>
        <tr>
            <td><code>totalSegment</code></td>
            <td align="center"><code>integer ≥ 1</code></td>
            <td align="center">-</td>
            <td>
              Represents the total number of segments into which the Scan operation is divided.
              <br/><br/><code>segment</code> must be provided.
            </td>
        </tr>
    </tbody>
</table>

:::noteExamples

<Tabs>
<TabItem value="consistent" label="Strongly consistent">

```ts
const { Items } = await PokeTable.build(ScanCommand)
  .options({
    consistent: true
  })
  .send()
```

</TabItem>
<TabItem value="indexed" label="On index">

```ts
const { Items } = await PokeTable.build(ScanCommand)
  .options({
    index: 'my-index'
  })
  .send()
```

</TabItem>
<TabItem value="multitenant" label="Multitenant">

```ts
const { Items } = await PokeTable.build(ScanCommand)
  .options({
    tableName: `tenant-${tenantId}-pokemons`
  })
  .send()
```

</TabItem>
</Tabs>

:::

:::notePaginated

<Tabs>
<TabItem value="paginated" label="Paginated">

```ts
let lastEvaluatedKey: Record<string, unknown> | undefined
const command = PokeTable.build(ScanCommand)

do {
  const page = await command
    .options({ exclusiveStartKey: lastEvaluatedKey })
    .send()

  // ...do something with page.Items here...

  lastEvaluatedKey = page.LastEvaluatedKey
} while (lastEvaluatedKey !== undefined)
```

</TabItem>
<TabItem value="db" label="All DB">

```ts
const { Items } = await PokeTable.build(ScanCommand)
  // Retrieve all items from the table (beware of RAM issues!)
  .options({
    maxPages: Infinity
  })
  .send()
```

</TabItem>

<TabItem value="entity" label="All Pokemons">

```ts
const { Items } = await PokeTable.build(ScanCommand)
  .entities(PokemonEntity)
  // Retrieve all pokemons from the table (beware of RAM issues!)
  .options({
    maxPages: Infinity
  })
  .send()
```

</TabItem>
</Tabs>

:::

:::noteFiltered

<Tabs>
<TabItem value="filtered" label="Filtered">

```ts
const { Items } = await PokeTable.build(ScanCommand)
  .entities(PokemonEntity, TrainerEntity)
  .options({
    filters: {
      POKEMONS: { attr: 'pokeType', eq: 'fire' },
      TRAINERS: { attr: 'age', gt: 18 }
    }
  })
  .send()
```

</TabItem>
<TabItem value="attributes" label="Attributes">

```ts
const { Items } = await PokeTable.build(ScanCommand)
  .entities(PokemonEntity)
  .options({
    attributes: ['name', 'type']
  })
  .send()
```

</TabItem>
<TabItem value="count" label="Count">

```ts
const { Count } = await PokeTable.build(ScanCommand)
  .options({
    select: 'COUNT'
  })
  .send()
```

</TabItem>
</Tabs>

:::

:::noteParallel

<Tabs>
<TabItem value="segment" label="Segment">

```ts
const { Items } = await PokeTable.build(ScanCommand)
  .options({
    segment: 1,
    totalSegment: 3
  })
  .send()
```

</TabItem>
<TabItem value="db" label="All DB (3 threads)">

```ts
const opts = { totalSegment: 3, maxPages: Infinity }

const [
  { Items: segment1 = [] },
  { Items: segment2 = [] },
  { Items: segment3 = [] }
] = await Promise.all([
  PokeTable.build(ScanCommand)
    .options({ segment: 0, ...opts })
    .send(),
  PokeTable.build(ScanCommand)
    .options({ segment: 1, ...opts })
    .send(),
  PokeTable.build(ScanCommand)
    .options({ segment: 2, ...opts })
    .send()
])

const allItems = [...segment1, ...segment2, ...segment3]
```

</TabItem>
</Tabs>

:::

## Response

The data is returned using the same response syntax as the [DynamoDB Scan API](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Scan.html#API_Scan_ResponseElements).

If [`entities`](#entities) have been provided, the response `Items` are formatted by their respective entities.

You can use the `ScanResponse` type to explicitly type an object as a `ScanCommand` response object:

```ts
import type { ScanResponse } from 'dynamodb-toolbox/table/actions/scan'

const scanResponse: ScanResponse<
  typeof PokeTable,
  // 👇 Optional entities
  [typeof PokemonEntity],
  // 👇 Optional options
  { attributes: ['name', 'type'] }
> = { Items: ... }
```
