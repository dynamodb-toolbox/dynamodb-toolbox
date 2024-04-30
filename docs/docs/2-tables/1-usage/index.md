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

export const documentClient = DynamoDBDocumentClient.from(
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
  name: 'my-super-table',
  documentClient,
  ...
})
```

:::info

Note that options provided to the `Table` constructor (including its `name`) MUST match your resources. But the responsibility to actually deploy the Table. This should be done by other means, such as the AWS CLI, Terraform, Cloudformation or any IaC tool you prefer.

:::
