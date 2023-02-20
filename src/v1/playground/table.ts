/* eslint-disable @typescript-eslint/no-unused-vars */
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

import { PrimaryKey, TableV2 } from 'v1/table'

const dynamoDbClient = new DynamoDBClient({})

const documentClient = DynamoDBDocumentClient.from(dynamoDbClient)

export const MyTable = new TableV2({
  name: 'MySuperTable',
  partitionKey: {
    name: 'userId',
    type: 'string'
  },
  sortKey: {
    name: 'sk',
    type: 'number'
  },
  documentClient
})

type PK = PrimaryKey<typeof MyTable>
