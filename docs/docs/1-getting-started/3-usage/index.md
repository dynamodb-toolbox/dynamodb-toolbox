---
title: Usage
---

# Usage

Schema > Entity > Table

## Tables

```ts
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

const dynamoDBClient = new DynamoDBClient()

export const documentClient = DynamoDBDocumentClient.from(
  dynamoDBClient,
  {
    marshallOptions: {
      // Specify your client options as usual
      removeUndefinedValues: true,
      convertEmptyValues: false,
      ...
    }
  }
)
```

## Entities

TODO

## Schemas

TODO

:::info

Schemas are a standalone feature of DynamoDB-Toolbox. You can use them on their own to validate or format data for instance. We have plan to outsource them in their own library someday.

:::
