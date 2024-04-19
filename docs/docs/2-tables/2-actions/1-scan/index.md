---
title: Scan
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# ScanCommand

Performs a [Scan Operation](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Scan.html) on a table.

## Usage

```ts
import { ScanCommand } from '@dynamodb-toolbox/table/actions/scan'

const scanCommand = PokeTable.build(ScanCommand)

const params = scanCommand.params()
const { Items } = await scanCommand.send()
```

## Entities

Provides a list of entities to filter (via the [internal `entity` attribute](TODO)), format and type the returned scanned items.

<!-- It also enables validation of projection expression and filters. and PARSING. -->

```ts
// 👇 Typed as (Pokemon | Trainer)[]
const { Items } = await PokeTable.build(ScanCommand)
  .entities(PokemonEntity, TrainerEntity)
  .send()
```

## Options

Additional options:

```ts
const { Items } = await PokeTable.build(ScanCommand)
  .options({
    consistent: true,
    limit: 10
    ...
  })
  .send()
```

You can use the `ScanOptions` type to explicitely type an object as a `ScanCommand` options:

```ts
import type { ScanOptions } from '@dynamodb-toolbox/table/actions/scan'

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

It is advised to provide `entities` before `options` as the former will improve the typing of the latter.

:::

Available options are (see the [DynamoDB documentation](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Scan.html#API_Scan_RequestParameters) for more details):

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
            <td rowspan="3" align="center" style={{ writingMode: "vertical-lr", transform: "rotate(180deg)" }}>-</td>
            <td><code>consistent</code></td>
            <td align="center"><code>boolean</code></td>
            <td align="center"><code>false</code></td>
            <td>
              By default, read operations are <b>eventually</b> consistent (which improves performances and reduces costs).
              <br/>
              <br/>Set to <code>true</code> to use <b>strongly</b> consistent reads.
            </td>
        </tr>
        <tr>
            <td><code>index</code></td>
            <td align="center"><code>IndexNames&lt;typeof Table&gt;</code></td>
            <td align="center">-</td>
            <td>The name of a secondary index to scan. This index can be any local secondary index or global secondary index.</td>
        </tr>
        <tr>
            <td><code>capacity</code></td>
            <td align="center"><code>CapacityOption</code></td>
            <td align="center"><code>"NONE"</code></td>
            <td>
              Determines the level of detail about either provisioned or on-demand throughput consumption that is returned in the response.
              <br/>
              <br/>Possible values are <code>"NONE"</code>, <code>"TOTAL"</code> and <code>"INDEXES"</code>.
            </td>
        </tr>
        <tr>
            <td rowspan="3" align="center" style={{ writingMode: "vertical-lr", transform: "rotate(180deg)" }}><b>Pagination</b></td>
            <td><code>limit</code></td>
            <td align="center"><code>integer ≥ 1</code></td>
            <td align="center">-</td>
            <td>The limit. Note that this does not guarantee... (1MB limit)</td>
        </tr>
        <tr>
            <td><code>exclusiveStartKey</code></td>
            <td align="center"><code>Key</code></td>
            <td align="center">-</td>
            <td>The startKey. To use in conjonction with the response <code>LastEvaluatedKey</code> property...</td>
        </tr>
        <tr>
            <td><code>maxPages</code></td>
            <td align="center"><code>integer ≥ 1</code></td>
            <td align="center"><code>1</code></td>
            <td>A "meta"-option provided by DynamoDB-Toolbox to retrieve multiple pages in a single promise. <code>Infinity</code> is a valid option.</td>
        </tr>
        <tr>
            <td rowspan="3" align="center" style={{ writingMode: "vertical-lr", transform: "rotate(180deg)" }}><b>Filters</b></td>
            <td><code>select</code></td>
            <td align="center"><code>SelectOption</code></td>
            <td align="center"><code>"ALL_ATTRIBUTES"?</code></td>
            <td>See TODO. Possible values are:
              <code>"ALL_ATTRIBUTES"`</code>, <code>"ALL_PROJECTED_ATTRIBUTES"</code> (only available when providing an <code>index</code>), <code>"COUNT"</code><code>"SPECIFIC_ATTRIBUTES"</code> (the only available option if <code>attributes</code> has been be specified)
            </td>
        </tr>
        <tr>
            <td><code>filters</code></td>
            <td align="center"><code>Record&lt;string, Condition&gt;</code></td>
            <td align="center">-</td>
            <td>Filter to apply. <code>entities</code> MUST be provided. Conditions are provided by entity name.</td>
        </tr>
        <tr>
            <td><code>attributes</code></td>
            <td align="center"><code>string[]</code></td>
            <td align="center">-</td>
            <td>The attributes to return. <code>entities</code> must be provided?. Paths must be common to all attributes.</td>
        </tr>
        <tr>
            <td rowspan="2" align="center" style={{ writingMode: "vertical-lr", transform: "rotate(180deg)" }}><b>Threading</b></td>
            <td><code>segment</code></td>
            <td align="center"><code>integer ≥ 1</code></td>
            <td align="center">-</td>
            <td>For parallel scans. MUST be used in conjunction with <code>totalSegment</code> and MUST be less than or equal to it.</td>
        </tr>
        <tr>
            <td><code>totalSegment</code></td>
            <td align="center"><code>integer ≥ 1</code></td>
            <td align="center">-</td>
            <td>For parallel scans. MUST be used in conjunction with <code>segment</code> option and MUST be greater than or equal to it.</td>
        </tr>
    </tbody>
</table>

:::noteExamples

<Tabs>
<TabItem value="consistent" label="Consistent">

```ts
const { Items } = await PokeTable.build(ScanCommand)
  // WARNING: Will be charged double
  .options({ consistent: true })
  .send()
```

</TabItem>
<TabItem value="indexed" label="Index">

```ts
const { Items } = await PokeTable.build(ScanCommand)
  .options({ index: 'my-index' })
  .send()
```

</TabItem>
</Tabs>

:::

:::notePaginated

<Tabs>
<TabItem value="db" label="All DB">

```ts
const { Items } = await PokeTable.build(ScanCommand)
  // Retrieve all items from the table (beware of RAM issues!)
  .options({ maxPages: Infinity })
  .send()
```

</TabItem>

<TabItem value="entity" label="All Pokemons">

```ts
const { Items } = await PokeTable.build(ScanCommand)
  .entities(PokemonEntity)
  // Retrieve all pokemons from the table (beware of RAM issues!)
  .options({ maxPages: Infinity })
  .send()
```

</TabItem>

<TabItem value="page-stream" label="Paginated">

```ts
let lastEvaluatedKey:
  | Record<string, unknown>
  | undefined = undefined

do {
  // TODO
} while (lastEvaluatedKey !== undefined)
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
      POKEMONS: { attr: 'type', eq: 'fire' },
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
  .options({ attributes: ['name', 'type'] })
  .send()
```

</TabItem>
<TabItem value="count" label="Count">

```ts
const { Count } = await PokeTable.build(ScanCommand)
  .options({ select: 'COUNT' })
  .send()
```

</TabItem>
</Tabs>

:::

:::noteSegmented

<Tabs>
<TabItem value="segment" label="Segment">

```ts
const { Items } = await PokeTable.build(ScanCommand)
  .options({ segment: 1, totalSegment: 3 })
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
    .options({ segment: 1, ...opts })
    .send(),
  PokeTable.build(ScanCommand)
    .options({ segment: 2, ...opts })
    .send(),
  PokeTable.build(ScanCommand)
    .options({ segment: 3, ...opts })
    .send()
])

const allItems = [...segment1, ...segment2, ...segment3]
```

</TabItem>
</Tabs>

:::

## Response

The data is returned with the same response syntax as the [DynamoDB Scan API](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Scan.html#API_Scan_ResponseElements).

If a list of `entities` has been provided, the response `Items` will be formatted by their respective entities.

You can use the `ScanResponse` type to explicitely type an object as a `ScanCommand` response:

```ts
import type { ScanResponse } from '@dynamodb-toolbox/table/actions/scan'

const scanResponse: ScanResponse<
  typeof PokeTable,
  // 👇 Optional entities
  [typeof PokemonEntity],
  // 👇 Optional options
  { attributes: ['name', 'type'] }
> = { Items: ... }
```
