---
title: Scan
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

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

Although it is not required, providing a list of entities to your `ScanCommand` enables filtering through the `entityName` attribute, and types of the scan results.

It also enables validation of projection expression and filters. and PARSING.

```ts
// Typed as (Pokemon | Trainer)[]
const {
  Items: pokemonsAndTrainers = []
} = await PokeTable.build(ScanCommand)
  .entities(PokemonEntity, TrainerEntity)
  .send()
```

## Options

You can set additional options via the `options` setter:

```ts
const { Items } = await PokeTable.build(ScanCommand)
  .options({
    consistent: true,
    limit: 10
    ...
  })
  .send()
```

If needed, you can use the `ScanOptions` type to explicitely type an object as scan options:

```ts
import type { ScanOptions } from '@dynamodb-toolbox/table/actions/scan'

const scanOptions: ScanOptions<
  typeof PokeTable,
  // 👇 Optional entities
  [typeof PokemonEntity, typeof TrainerEntity]
> = { consistent: true, ... }

const command = PokeTable.build(ScanCommand).options(
  scanOptions
)
```

:::info

Providing `entities` first will activate and improve the typing of some options, so you should definitely use the `options` only after.

:::

### Base options

| Option       |            Type            | Default  | Description                                               |
| ------------ | :------------------------: | :------: | --------------------------------------------------------- |
| `consistent` |         `boolean`          | `false`  | Cannot be set to `true` if a secondary has been provided. |
| `capacity`   |      `CapacityOption`      | `"NONE"` | See [Capacity](TODO)                                      |
| `index`      | `IndexNames<typeof Table>` |    -     | Table secondary index to base the scan on.                |

:::noteExamples

<Tabs>
<TabItem value="consistent" label="Consistent">

```ts
// WARNING: Will be charged double
const { Items } = await PokeTable.build(ScanCommand)
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

### Pagination

| Option              |     Type      | Default | Description                                                                                                                |
| ------------------- | :-----------: | :-----: | -------------------------------------------------------------------------------------------------------------------------- |
| `limit`             | `integer ≥ 1` |    -    | The limit. Note that this does not guarantee... (1MB limit)                                                                |
| `exclusiveStartKey` |     `Key`     |    -    | The startKey. To use in conjonction with the response `LastEvaluatedKey` property...                                       |
| `maxPages`          | `integer ≥ 1` |   `1`   | A "meta"-option provided by DynamoDB-Toolbox to retrieve multiple pages in a single promise. `Infinity` is a valid option. |

:::noteExamples

<Tabs>
<TabItem value="db" label="All DB">

```ts
// Retrieve all items from the table (beware of RAM issues!)
const { Items: allItems = [] } = await PokeTable.build(
  ScanCommand
)
  .options({ maxPages: Infinity })
  .send()
```

</TabItem>

<TabItem value="entity" label="All Pokemons">

```ts
// Retrieve all items from the table (beware of RAM issues!)
const { Items: allPokemons = [] } = await PokeTable.build(
  ScanCommand
)
  .entities(PokemonEntity)
  .options({ maxPages: Infinity })
  .send()
```

</TabItem>

<TabItem value="page-stream" label="Paginated workload">

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

### Filters

| Option       |            Type             |       Default       | Description                                                                                                                                                                                                                                                                        |
| ------------ | :-------------------------: | :-----------------: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `select`     |       `SelectOption`        | `"ALL_ATTRIBUTES"?` | See [Select](TODO). Possible values are: <ul><li>`"ALL_ATTRIBUTES"`</li><li>`"ALL_PROJECTED_ATTRIBUTES"`: (Only available when providing an `index`)</li><li>`"COUNT"`</li><li>`"SPECIFIC_ATTRIBUTES"`</li> (The only available option if `attributes` has been be specified)</ul> |
| `filters`    | `Record<string, Condition>` |          -          | Filter to apply. `entities` MUST be provided. Conditions are provided by entity name.                                                                                                                                                                                              |
| `attributes` |         `string[]`          |          -          | The attributes to return. `entities` must be provided?. Paths must be common to all attributes.                                                                                                                                                                                    |

:::noteExamples

<Tabs>
<TabItem value="filtered" label="Filtered">

```ts
// Retrieve all items from the table (beware of RAM issues!)
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
// Retrieve all items from the table (beware of RAM issues!)
const { Items } = await PokeTable.build(ScanCommand)
  .entities(PokemonEntity)
  .options({ attributes: ['name', 'type'] })
  .send()
```

</TabItem>
<TabItem value="count" label="Count">

```ts
// Retrieve all items from the table (beware of RAM issues!)
const { Count } = await PokeTable.build(ScanCommand)
  .options({ select: 'COUNT' })
  .send()
```

</TabItem>
</Tabs>

:::

### Segmenting

| Option         |     Type      | Default | Description                                                                                                    |
| -------------- | :-----------: | :-----: | -------------------------------------------------------------------------------------------------------------- |
| `segment`      | `integer ≥ 1` |    -    | For parallel scans. MUST be used in conjunction with `totalSegment` and MUST be less than or equal to it.      |
| `totalSegment` | `integer ≥ 1` |    -    | For parallel scans. MUST be used in conjunction with `segment` option and MUST be greater than or equal to it. |

:::noteExamples

<Tabs>
<TabItem value="segment" label="Segment">

```ts
const { Items: allItems = [] } = await PokeTable.build(
  ScanCommand
)
  .options({ segment: 1, totalSegment: 3 })
  .send()
```

</TabItem>
<TabItem value="db" label="All DB (segmented)">

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

You can use the `ScanResponse` type to explicitely type an object as a scan response:

```ts
import type { ScanResponse } from '@dynamodb-toolbox/table/actions/scan'

const scanResponse: ScanResponse<
  typeof PokeTable,
  // 👇 Optional entities
  [typeof PokemonEntity],
  // 👇 Optional options
  { attributes: ["name", "type"] }
> = { Items: ... }
```
