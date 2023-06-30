---
title: Table
---

# Table

A **Table** represents a one-to-one mappings to your DynamoDB table. They contain information about your table's name, primary keys, indexes, and more. They are also used to organize and coordinate operations between **entities**. Tables support a number of methods that allow you to interact with your entities including performing **queries**, **scans**, **batch gets** and **batch writes**.

## Defining a Table

To define a new table, import it into your script:

```typescript
import { Table } from 'dynamodb-toolbox'

const MyTable = new Table({
  ... // Table definition
})
```

## Specifying Table Definitions

`Table` takes a single parameter of type `object` that accepts the following properties:

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
| removeNullAttributes |       `boolean`       |    no    | Removes null and empty (e.g. `''`) attributes instead of setting them to `null` (default: `true`)                                                        |
| DocumentClient       |   `DocumentClient`    |    \*    | A valid instance of the AWS [DocumentClient](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html) |

\* _A Table can be instantiated without a DocumentClient, but most methods require it before execution_

## Table Attributes

The Table `attributes` property is an `object` that specifies the _names_ and _types_ of attributes associated with your DynamoDB table. This is an optional input that allows you to control attribute types. If an `Entity` object contains an attribute with the same name, but a different type, an error will be thrown. Each key in the object represents the **attribute name** and the value represents its DynamoDB **type**.

```typescript
const MyTable = new Table({
  attributes: {
    pk: 'string',
    sk: 'number',
    attr1: 'list',
    attr2: 'map',
    attr3: 'boolean'
    // ...
  }
})
```

Valid DynamoDB types are: `string`, `boolean`, `number`, `list`, `map`, `binary`, or `set`.

## Table Indexes

The `indexes` property is an `object` that specifies the _names_ and _keys_ of the secondary indexes on your DynamoDB table. Each key represents the **index name** and its value must contain an object with a `partitionKey` AND/OR a `sortKey`. `partitionKey`s and `sortKey`s require a value of type `string` that references an table attribute. If you use the same `partitionKey` as the table's `partitionKey`, or you only specify a `sortKey`, the library will recognize them as Local Secondary Indexes (LSIs). Otherwise, they will be Global Secondary Indexes (GSIs).

```typescript
const MyTable = new Table({
  indexes: {
    GSI1: { partitionKey: 'GSI1pk', sortKey: 'GSI1sk' },
    GSI2: { partitionKey: 'test' },
    LSI1: { partitionKey: 'pk', sortKey: 'other_sk' },
    LSI2: { sortKey: 'data' }
    // ...
  }
})
```

**NOTE:** The **index name** must match the index name on your table as it will be used in queries and other operations. The index must include the table's `entityField` attribute for automatic parsing of returned data.
