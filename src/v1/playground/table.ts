import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

import { HasSK, PrimaryKey, TableV2 } from 'v1/table'

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

type HasSecKey = HasSK<typeof MyTable>
type PK = PrimaryKey<typeof MyTable>
