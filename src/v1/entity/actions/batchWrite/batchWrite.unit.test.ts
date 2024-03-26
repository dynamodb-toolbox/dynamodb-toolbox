import {
  DynamoDBToolboxError,
  EntityV2,
  TableV2,
  schema,
  string,
  BatchPutItemRequest,
  BatchDeleteItemRequest
} from 'v1'

import { getBatchWriteCommandInput } from './batchWrite'

const TestTable = new TableV2({
  name: 'test-table',
  partitionKey: {
    type: 'string',
    name: 'pk'
  },
  sortKey: {
    type: 'string',
    name: 'sk'
  }
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
  }
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
    const invalidCall = () => getBatchWriteCommandInput([])

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'operations.incompleteOperation' }))
  })

  it('batchWrites data to a single table', () => {
    const result = getBatchWriteCommandInput([
      TestEntity.build(BatchPutItemRequest).item({ email: 'test', sort: 'testsk', test: 'test' })
    ])

    expect(result).toMatchObject({
      RequestItems: {
        'test-table': [{ PutRequest: { Item: { pk: 'test', sk: 'testsk', test: 'test' } } }]
      }
    })
  })

  it('fails when extra options', () => {
    const invalidCall = () =>
      getBatchWriteCommandInput(
        [
          TestEntity.build(BatchPutItemRequest).item({
            email: 'test',
            sort: 'testsk',
            test: 'test'
          })
        ],
        // @ts-expect-error
        { extra: true }
      )

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'operations.unknownOption' }))
  })

  it('sets capacity options', () => {
    const { ReturnConsumedCapacity } = getBatchWriteCommandInput(
      [
        TestEntity.build(BatchPutItemRequest).item({
          email: 'test',
          sort: 'testsk',
          test: 'test'
        })
      ],
      { capacity: 'TOTAL' }
    )

    expect(ReturnConsumedCapacity).toBe('TOTAL')
  })

  it('fails on invalid capacity option', () => {
    const invalidCall = () =>
      getBatchWriteCommandInput(
        [
          TestEntity.build(BatchPutItemRequest).item({
            email: 'test',
            sort: 'testsk',
            test: 'test'
          })
        ],
        // @ts-expect-error
        { capacity: 'test' }
      )
    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'operations.invalidCapacityOption' })
    )
  })

  it('sets metrics options', () => {
    const { ReturnItemCollectionMetrics } = getBatchWriteCommandInput(
      [
        TestEntity.build(BatchPutItemRequest).item({
          email: 'test',
          sort: 'testsk',
          test: 'test'
        })
      ],
      { metrics: 'SIZE' }
    )

    expect(ReturnItemCollectionMetrics).toBe('SIZE')
  })

  it('fails on invalid metrics setting', () => {
    const invalidCall = () =>
      getBatchWriteCommandInput(
        [
          TestEntity.build(BatchPutItemRequest).item({
            email: 'test',
            sort: 'testsk',
            test: 'test'
          })
        ],
        // @ts-expect-error
        { metrics: 'test' }
      )
    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'operations.invalidMetricsOption' })
    )
  })

  it('batchWrites data to a single table with multiple items', () => {
    const result = getBatchWriteCommandInput([
      TestEntity.build(BatchPutItemRequest).item({
        email: 'test',
        sort: 'testsk1',
        test: 'test1'
      }),
      TestEntity.build(BatchPutItemRequest).item({
        email: 'test',
        sort: 'testsk2',
        test: 'test2'
      }),
      TestEntity.build(BatchDeleteItemRequest).key({ email: 'test', sort: 'testsk3' })
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
    const result = getBatchWriteCommandInput([
      TestEntity.build(BatchPutItemRequest).item({
        email: 'test',
        sort: 'testsk1',
        test: 'test1'
      }),
      TestEntity.build(BatchPutItemRequest).item({
        email: 'test',
        sort: 'testsk2',
        test: 'test2'
      }),
      TestEntity2.build(BatchPutItemRequest).item({
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
