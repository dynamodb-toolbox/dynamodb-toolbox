---
title: CDK
sidebar_custom_props:
  sidebarActionType: util
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# CDKTableV2

:::note

`CDKTableV2` requires the `aws-cdk-lib` and `constructs` dependencies to be installed first (they usually already are in [AWS CDK](https://aws.amazon.com/cdk/) apps):

```bash
npm install aws-cdk-lib constructs
```

:::

Derives [`TableV2`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_dynamodb.TableV2.html) props from a `Table`, so that your `Table` is the **single source of truth** for keys and indexes:

```ts
import { TableV2, Billing } from 'aws-cdk-lib/aws-dynamodb'
import { CDKTableV2 } from 'dynamodb-toolbox/table/actions/cdk'

import { PokeTable } from '../src/tables'

new TableV2(this, 'PokeTable', {
  ...PokeTable.build(CDKTableV2).props(),
  billing: Billing.onDemand()
})
```

## Methods

### `props(...)`

<p style={{ marginTop: '-15px' }}><i><code>(options?: CDKTableV2Options) => CDKTableV2Props</code></i></p>

Returns the `partitionKey`, `sortKey`, `globalSecondaryIndexes`, `localSecondaryIndexes` and (optionally) `tableName` props of the `Table`:

| `Table`                                     | `TableV2` props                                                   |
| ------------------------------------------- | ----------------------------------------------------------------- |
| `partitionKey`                              | `partitionKey`                                                    |
| `sortKey`                                   | `sortKey` (omitted if the `Table` has none)                       |
| `global` indexes                            | `globalSecondaryIndexes` (omitted if none)                        |
| `local` indexes                             | `localSecondaryIndexes` (omitted if none)                         |
| `name`                                      | `tableName` (see [options](#options))                             |
| `'string'` / `'number'` / `'binary'` keys   | `AttributeType.STRING` / `AttributeType.NUMBER` / `AttributeType.BINARY` |

Indexes are emitted in their declaration order, with the index key as `indexName`. Global indexes with several `partitionKeys` / `sortKeys` are emitted as `partitionKeys` / `sortKeys`, while single keys (and single-element arrays) are emitted as `partitionKey` / `sortKey`.

#### Options

| Option      |   Type    | Default | Description                                                                                                                                                                                                                                  |
| ----------- | :-------: | :-----: | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tableName` | `boolean` |    -    | By default, `tableName` is only emitted if the `Table` name is a `string`.<br/><br/>If `true`, the name is always emitted (and resolved if it is a function). Throws a `table.missingTableName` error if the `Table` has no name.<br/><br/>If `false`, it is never emitted. |

:::note[Examples]

<Tabs>
<TabItem value="usage" label="Usage">

```ts
const props = PokeTable.build(CDKTableV2).props()
```

</TabItem>
<TabItem value="resolved-name" label="Resolved name">

```ts
const PokeTable = new Table({
  name: () => process.env.POKE_TABLE_NAME,
  ...
})

const props = PokeTable.build(CDKTableV2).props({
  tableName: true
})
```

</TabItem>
<TabItem value="no-name" label="No name">

```ts
// 👇 Let CloudFormation generate the table name
const props = PokeTable.build(CDKTableV2).props({
  tableName: false
})
```

</TabItem>
</Tabs>

:::

:::info

- Global indexes with **multi-attribute keys** (more than one `partitionKeys` or `sortKeys`) require `aws-cdk-lib` v2.226.0 or later.
- Index projections are not set, so they default to `ALL`.
- The `Table` `meta` is not mapped (`TableV2` has no title or description prop).
- The `Table` definition is not validated: invalid definitions (like a `local` index on a table without sort key) are passed as-is, and reported by CDK or CloudFormation at synth or deploy time.

:::
