import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

import { EntityV2, TableV2, schema, string } from 'v1'
import { PutBatchItemRequest } from './putBatchItem/operation'
import { DeleteBatchItemRequest } from './deleteBatchItem/operation'
import { buildBatchWriteCommandInput } from './batchWrite'

const dynamoDbClient = new DynamoDBClient({})

const documentClient = DynamoDBDocumentClient.from(dynamoDbClient)

const TestTable = new TableV2({
  name: 'test-table',
  partitionKey: {
    type: 'string',
    name: 'pk'
  },
  sortKey: {
    type: 'string',
    name: 'sk'
  },
  documentClient
})
const TestTable2 = new TableV2({
  name: 'test-table2',
  partitionKey: {
    type: 'string',
    name: 'pk'
  },
  sortKey: {
    type: 'string',
    name: 'sk'
  },
  indexes: {
    GSI1: {
      partitionKey: { name: 'GSI1pk', type: 'string' },
      sortKey: { name: 'GSIsk1', type: 'string' },
      type: 'global'
    }
  },
  documentClient
})

const TestEntity = new EntityV2({
  name: 'TestEntity',
  schema: schema({
    email: string().key().savedAs('pk'),
    sort: string().key().savedAs('sk'),
    test: string()
  }),
  table: TestTable
})
const TestEntity2 = new EntityV2({
  name: 'TestEntity2',
  schema: schema({
    email: string().key().savedAs('pk'),
    sort: string().key().savedAs('sk'),
    test: string()
  }),
  table: TestTable2
})

describe('buildBatchWriteCommandInput', () => {
  it('fails on empty commands', () => {
    const invalidCall = () => buildBatchWriteCommandInput([])

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'operations.incompleteCommand' }))
  })

  it('batchWrites data to a single table', () => {
    const result = buildBatchWriteCommandInput([
      TestEntity.build(PutBatchItemRequest).item({ email: 'test', sort: 'testsk', test: 'test' })
    ])

    expect(result).toMatchObject({
      RequestItems: {
        'test-table': [{ PutRequest: { Item: { pk: 'test', sk: 'testsk', test: 'test' } } }]
      }
    })
  })

  it('batchWrites data to a single table with multiple items', () => {
    const result = buildBatchWriteCommandInput([
      TestEntity.build(PutBatchItemRequest).item({
        email: 'test',
        sort: 'testsk1',
        test: 'test1'
      }),
      TestEntity.build(PutBatchItemRequest).item({
        email: 'test',
        sort: 'testsk2',
        test: 'test2'
      }),
      TestEntity.build(DeleteBatchItemRequest).key({ email: 'test', sort: 'testsk3' })
    ])

    expect(result).toMatchObject({
      RequestItems: {
        'test-table': [
          {
            PutRequest: {
              Item: {
                pk: 'test',
                sk: 'testsk1',
                test: 'test1'
              }
            }
          },
          {
            PutRequest: {
              Item: {
                pk: 'test',
                sk: 'testsk2',
                test: 'test2'
              }
            }
          },
          {
            DeleteRequest: {
              Key: {
                pk: 'test',
                sk: 'testsk3'
              }
            }
          }
        ]
      }
    })
  })

  it('batchWrites data to multiple tables', () => {
    const result = buildBatchWriteCommandInput([
      TestEntity.build(PutBatchItemRequest).item({
        email: 'test',
        sort: 'testsk1',
        test: 'test1'
      }),
      TestEntity.build(PutBatchItemRequest).item({
        email: 'test',
        sort: 'testsk2',
        test: 'test2'
      }),
      TestEntity2.build(PutBatchItemRequest).item({
        email: 'test',
        sort: 'testsk3',
        test: 'test3'
      })
    ])

    expect(result).toMatchObject({
      RequestItems: {
        'test-table': [
          {
            PutRequest: {
              Item: {
                pk: 'test',
                sk: 'testsk1',
                test: 'test1'
              }
            }
          },
          {
            PutRequest: {
              Item: {
                pk: 'test',
                sk: 'testsk2',
                test: 'test2'
              }
            }
          }
        ],
        'test-table2': [
          {
            PutRequest: {
              Item: {
                pk: 'test',
                sk: 'testsk3',
                test: 'test3'
              }
            }
          }
        ]
      }
    })
  })
})
