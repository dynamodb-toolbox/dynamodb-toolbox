---
title: Usage
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Table

Each **Table** instance describes the configuration of a deployed DynamoDB Table: Its **name**, **primary key**, **secondary indexes**, and more.

<!-- _They are also used to organize and coordinate operations between **entities**. Tables support a number of actions that allow you to interact with your entities including performing **queries**, **scans**, **batch gets** and **batch writes**._ -->

```typescript
import { Table } from 'dynamodb-toolbox/table'

const PokeTable = new Table({
  ...
})
```

:::info

The configuration provided to the `Table` constructor must match your resources. But DynamoDB-Toolbox does NOT hold the responsibility of actually deploying them. This should be done by other means, like the [AWS CLI](https://aws.amazon.com/cli/), [Terraform](https://www.terraform.io/) or [Cloudformation](https://aws.amazon.com/cloudformation/).

:::

## Constructor

The `Table` constructor takes a single parameter of type `object` and accepts the following properties:

### `documentClient`

As mentioned in the [Getting Started section](../../1-getting-started/1-overview/index.md), DynamoDB-Tooblox is an **abstraction layer over the Document Client**, but it does not replace it. A `DocumentClient` instance is explicitly needed for commands to interact with DynamoDB:

```typescript
// From peer dependencies
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

const dynamoDBClient = new DynamoDBClient()

const documentClient = DynamoDBDocumentClient.from(
  dynamoDBClient,
  {
    marshallOptions: {
      // Specify your client options as usual
      removeUndefinedValues: true,
      convertEmptyValues: false
      ...
    }
  }
)

const PokeTable = new Table({
  documentClient,
  ...
})
```

You can also set it later in the code (but beware that commands fail if no client has been provided):

```typescript
const PokeTable = new Table(...)

// Later in the code
const documentClient = ...
PokeTable.documentClient = documentClient
```

### `name`

A `string` (or function returning a `string`) that matches the [name](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/WorkingWithTables.Basics.html#WorkingWithTables.Basics.CreateTable) of your DynamoDB table:

:::note[Examples]

<Tabs>
<TabItem value="fixed" label="Fixed">

```ts
const PokeTable = new Table({
  name: "poke-table",
  ...
});
```

</TabItem>
<TabItem value="env" label="From env">

```ts
const PokeTable = new Table({
  name: process.env.POKE_TABLE_NAME,
  ...
});
```

</TabItem>
<TabItem value="getter" label="Getter">

```ts
const PokeTable = new Table({
  // 👇 Only executed at command execution
  name: () => process.env.POKE_TABLE_NAME,
  ...
});
```

</TabItem>
</Tabs>

:::

You can also provide it through **command options** – which is useful for [multitenant apps](https://en.wikipedia.org/wiki/Multitenancy) – but beware that commands fail if no table name has been provided:

```ts
const PokeTable = new Table({
  // Omit `name` property
  documentClient,
  ...
})

// Scan tenant table
const { Items } = await PokeTable.build(ScanCommand)
  .options({ tableName: tenantTableName })
  .send()
```

### `partitionKey`

<p style={{ marginTop: '-15px' }}><i>(required)</i></p>

The [partition key](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.CoreComponents.html#HowItWorks.CoreComponents.PrimaryKey) attribute name and type of your DynamoDB table:

:::note[Examples]

<Tabs>
<TabItem value="string" label="String">

```ts
const MyTable = new Table({
  ...,
  partitionKey: {
    name: "pokemonId",
    type: "string",
  }
})
```

</TabItem>
<TabItem value="number" label="Number">

```ts
const MyTable = new Table({
  ...,
  partitionKey: {
    name: "pokemonId",
    type: "number",
  }
})
```

</TabItem>
<TabItem value="binary" label="Binary">

```ts
const MyTable = new Table({
  ...,
  partitionKey: {
    name: "pokemonId",
    type: "binary",
  }
})
```

</TabItem>
</Tabs>

:::

### `sortKey`

If present, the [sort key](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.CoreComponents.html#HowItWorks.CoreComponents.PrimaryKey) attribute name and type of your DynamoDB table:

```ts
const MyTable = new Table({
  ...,
  sortKey: {
    name: "level",
    type: "number",
  }
})
```

### `indexes`

An object that lists the [secondary indexes](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.CoreComponents.html#HowItWorks.CoreComponents.SecondaryIndexes) of your DynamoDB Table.

Secondary indexes are represented as key-value pairs, keys being the index names, and values containing:

- The `type` of the secondary index (`"local"` or `"global"`)
- For global secondary indexes, the `partitionKey` of the index (similar to the main [`partitionKey`](#partitionkey))
- If present, the `sortKey` of the index (similar to the main [`sortKey`](#sortkey))

:::note[Examples]

<Tabs>
<TabItem value="gsi" label="Global Index">

```ts
const MyTable = new Table({
  ...,
  indexes: {
    byTrainerId: {
      type: 'global',
      partitionKey: { name: 'trainerId', type: 'string' }
    }
  }
})
```

</TabItem>
<TabItem value="gsi-sort-key" label="Global Index (+ sort key)">

```ts
const MyTable = new Table({
  ...,
  indexes: {
    byTrainerId: {
      type: 'global',
      partitionKey: { name: 'trainerId', type: 'string' },
      sortKey: { name: 'level', type: 'number' }
    }
  }
})
```

</TabItem>
<TabItem value="lsi" label="Local Index">

```ts
const MyTable = new Table({
  ...,
  indexes: {
    byLevel: {
      type: 'local',
      sortKey: { name: 'level', type: 'number' }
    }
  }
})
```

</TabItem>
</Tabs>

:::

:::warning

When whitelisted, the projected attributes of a secondary index should include the `Table`'s [entity attribute](#entityattributesavedas) for a more performant formatting of the returned data.

:::

### `entityAttributeSavedAs`

DynamoDB-Toolbox tags your data via an internal and hidden [`entity`](../../3-entities/2-internal-attributes/index.md#entity) attribute. Any write command automatically sets its value to the corresponding `Entity` name.

To allow for appropriate formatting when fetching multiple items of the same `Table` in a single operation (like [Queries](../2-actions/2-query/index.md) or [Scans](../2-actions/1-scan/index.md)), **the key of this attribute must be the same accross all of its items**, so it must be set at the `Table` level.

Its default value is `_et`, but it can be renamed through the `entityAttributeSavedAs` argument:

```ts
const MyTable = new Table({
  ...
  // 👇 defaults to '_et'
  entityAttributeSavedAs: '__entity__',
});
```

:::warning

☝️ This property **cannot be updated** once your Table has its first item (at least not without a data migration first), so choose wisely!

:::

## Building Table Actions

To allow for **extensibility**, **better code-splitting** and **lighter bundles**, `Tables` only expose a `.build(...)` method which acts as a gateway to perform Table [Actions](../../1-getting-started/3-usage/index.md#how-do-actions-work):

```ts
import { ScanCommand } from 'dynamodb-toolbox/table/actions/scan'

const { Items } = await PokeTable.build(ScanCommand).send()
```

:::info

If you don't mind large bundle sizes, you can still use the [`EntityRepository`](../../3-entities/4-actions/22-repository/index.md) actions that expose all the others as methods.

:::
