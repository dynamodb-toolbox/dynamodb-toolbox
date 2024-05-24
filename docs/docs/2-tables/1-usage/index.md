---
title: Usage 👷
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Table 👷

Each **Table** describes the configuration of a deployed DynamoDB Table: Your table's **name**, **primary keys**, **indexes**, and more.

They are also used to organize and coordinate operations between **entities**. Tables support a number of actions that allow you to interact with your entities including performing **queries**, **scans**, **batch gets** and **batch writes**.

:::info

Note that options provided to the `Table` constructor (including its `name`) MUST match your resources. But the responsibility to actually deploy the Table. This should be done by other means, such as the AWS CLI, Terraform, Cloudformation or your IaC tool of choice.

:::

## Defining a Table

To define a new table, import it into your script:

```typescript
import { Table } from 'dynamodb-toolbox/table'

const PokeTable = new Table({
  ...
})
```

## Injecting the DocumentClient

Tables are also where the document client dependency is injected. DynamoDB-Toolbox works with the v3 of the AWS client:

```typescript
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

const MyTable = new Table({
  documentClient,
  ...
})
```

Note that the client needs not to be provided right away. This can be useful if you want to use the `Table` in a separate context in which the client is not needed (like using the [CDK](https://aws.amazon.com/cdk/)):

```typescript
const MyTable = new Table(...)

// Later in the code
const documentClient = ...
MyTable.documentClient = documentClient
```

## Specifying Table Definitions

`Table` takes a single parameter of type `object` that accepts the following properties:

The table name can be provided with a getter, which can be useful in some contexts where you may want to use the class without actually running any command (e.g. tests or deployments):

| Property             |         Type          | Required | Description                                                                                                                        |
| -------------------- | :-------------------: | :------: | ---------------------------------------------------------------------------------------------------------------------------------- |
| name                 |       `string`        |   yes    | The name of your DynamoDB table (this will be used as the `TableName` property)                                                    |
| alias                |       `string`        |    no    | An optional alias to reference your table when using "batch" features                                                              |
| partitionKey         |       `string`        |   yes    | The attribute name of your table's partitionKey                                                                                    |
| sortKey              |       `string`        |    no    | The attribute name of your table's sortKey                                                                                         |
| entityField          | `boolean` or `string` |    no    | Disables or overrides entity tracking field name (default: `_et`)                                                                  |
| attributes           |       `object`        |    no    | Complex type that optionally specifies the name and type of each attributes (see below)                                            |
| indexes              |       `object`        |    no    | Complex type that optionally specifies the name keys of your secondary indexes (see below)                                         |
| autoExecute          |       `boolean`       |    no    | Enables automatic execution of the DocumentClient method (default: `true`)                                                         |
| autoParse            |       `boolean`       |    no    | Enables automatic parsing of returned data when `autoExecute` is `true` (default: `true`)                                          |
| removeNullAttributes |       `boolean`       |    no    | Removes null and empty (e.g. `''`) attributes instead of setting them to `null` (default: `true`)                                  |
| DocumentClient       |   `DocumentClient`    |    \*    | A valid instance of the AWS [DocumentClient](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html) |

\* _A Table can be instantiated without a DocumentClient, but most methods require it before execution_

:::noteExamples

<Tabs>
<TabItem value="name-getter" label="Name getter">

```ts
const MyTable = new Table({
  ...
  // 👇 Only executed at command execution
  name: () => process.env.TABLE_NAME,
});
```

</TabItem>
<TabItem value="indexes" label="Indexes">

```ts
const MyTable = new Table({
  ...,
  indexes: {
    byLevel: {
      type: 'local',
      sortKey: {
        name: 'level',
        type: 'number'
      }
    },
    byTrainerId: {
      type: 'global',
      partitionKey: {
        name: 'trainerId',
        type: 'string'
      },
      sortKey: {
        name: 'level',
        type: 'number'
      }
    }
  }
})
```

</TabItem>
</Tabs>

:::

:::info

The **index name** must match the index name on your table as it will be used in queries and other operations. The index must include the table's `entityField` attribute for automatic parsing of returned data.

:::

## Inferring entities in Single Tables

DynamoDB-Toolbox tags your items with an entity identifier through an internal `entity` string attribute that is filled with your entity name.

To allow for appropriate formatting when fetching multiple items in a single operation, the key of this attribute in the Table must be the same accross all of its items. That's why it is set at the Table level.

It's default value is `"_et"`, but it can be renamed through the `entityAttributeSavedAs` argument:

```tsx
const MyTable = new Table({
  ...
  // 👇 defaults to "_et"
  entityAttributeSavedAs: '__entity__',
});
```

<!-- NOTE: 'caution' became 'warning' in docusaurus v3 -->

:::caution

☝️ This property **cannot be updated** once your Table has its first items (at least not without a data migration first), so choose wisely!

:::
