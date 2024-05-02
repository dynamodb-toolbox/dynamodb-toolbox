---
title: Usage
---

# Table

Tables represent an actual DynamoDB table.

`@aws-sdk/client-dynamodb` and `@aws-sdk/lib-dynamodb` are exposed as peer dependencies. The document client is to provide as a dependency injection.

```ts
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import { Table } from 'dynamodb-toolbox'

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

const myTable = new TableV2({
  name: 'MySuperTable',
  partitionKey: {
    name: 'PK',
    type: 'string' // 'string' | 'number' | 'binary'
  },
  sortKey: {
    name: 'SK',
    type: 'string'
  },
  documentClient
})
```

:::info

Note that options provided to the `Table` constructor (including its `name`) MUST match your resources. But the responsibility to actually deploy the Table. This should be done by other means, such as the AWS CLI, Terraform, Cloudformation or any IaC tool you prefer.

:::

The table name can be provided with a getter, which can be useful in some contexts where you may want to use the class without actually running any command (e.g. tests or deployments):

```tsx
const myTable = new Table({
  ...
  // 👇 Only executed at command execution
  name: () => process.env.TABLE_NAME,
});
```

The documentClient can also be provided later.

DynamoDB-Toolbox tags your items with an entity identifier through an internal `entity` string attribute, saved as `"_et"` by default. This can be renamed at the `Table` level through the `entityAttributeSavedAs` argument:

```tsx
const myTable = new Table({
  ...
  // 👇 defaults to "_et"
  entityAttributeSavedAs: '__entity__',
});
```

## Constructor arguments

| Option       |       Type       | Default  | Description                                                                                                                                                                              |
| ------------ | :--------------: | :------: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `consistent` |    `boolean`     | `false`  | By default, read operations are <b>eventually</b> consistent (which improves performances and reduces costs).<br/><br/>Set to `true` to use <b>strongly</b> consistent reads.            |
| `attributes` | `Path<Entity>[]` |    -     | To specify a list of attributes to retrieve (improves performances but does not reduce costs).<br/><br/>See [Filtering Attributes](TODO) for more details on how to filter attributes.   |
| `capacity`   | `CapacityOption` | `"NONE"` | Determines the level of detail about provisioned or on-demand throughput consumption that is returned in the response.<br/><br/>Possible values are `"NONE"`, `"TOTAL"` and `"INDEXES"`. |
