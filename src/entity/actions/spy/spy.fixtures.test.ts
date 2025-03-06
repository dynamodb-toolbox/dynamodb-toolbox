import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

import { Entity, Table, item, string } from '~/index.js'

const dynamoDbClient = new DynamoDBClient({ region: 'eu-west-1' })
export const documentClient = DynamoDBDocumentClient.from(dynamoDbClient)

export const TestTable = new Table({
  name: 'test-table',
  partitionKey: { type: 'string', name: 'pk' },
  sortKey: { type: 'string', name: 'sk' },
  documentClient
})

export const TestEntity = new Entity({
  name: 'TestEntity',
  schema: item({
    email: string().key().savedAs('pk'),
    sort: string().key().savedAs('sk'),
    test: string()
  }),
  table: TestTable
})
