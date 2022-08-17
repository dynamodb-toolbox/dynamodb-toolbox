import { DynamoDBClient } from '@aws-sdk/client-dynamodb'

import { HasSK, PrimaryKey, TableV2 } from 'v1/table'

const dynamoDbClient = new DynamoDBClient({})

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
  dynamoDbClient
})

type HasSecKey = HasSK<typeof MyTable>
type PK = PrimaryKey<typeof MyTable>
