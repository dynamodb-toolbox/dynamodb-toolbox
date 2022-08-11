import { DynamoDBClient } from '@aws-sdk/client-dynamodb'

import { PrimaryKey, Table } from './table'

const dynamoDbClient = new DynamoDBClient({})

export const MyTable = new Table({
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

type PK = PrimaryKey<typeof MyTable>
