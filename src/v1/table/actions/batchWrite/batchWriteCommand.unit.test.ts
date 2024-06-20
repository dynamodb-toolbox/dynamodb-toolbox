import type { A } from 'ts-toolbelt'

import {
  DynamoDBToolboxError,
  EntityV2,
  TableV2,
  BatchPutRequest,
  BatchDeleteRequest,
  schema,
  string,
  number
} from 'v1/index.js'
import { $entities } from 'v1/table/index.js'

import { BatchWriteCommand } from './batchWriteCommand.js'

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

const EntityA = new EntityV2({
  name: 'EntityA',
  schema: schema({
    pkA: string().key().savedAs('pk'),
    skA: string().key().savedAs('sk'),
    commonAttribute: string(),
    name: string()
  }),
  table: TestTable
})

const EntityB = new EntityV2({
  name: 'EntityB',
  schema: schema({
    pkB: string().key().savedAs('pk'),
    skB: string().key().savedAs('sk'),
    commonAttribute: string(),
    age: number()
  }),
  table: TestTable
})

describe('BatchWriteCommand', () => {
  test('throws if there is no request', () => {
    const invalidCallA = () => TestTable.build(BatchWriteCommand).params()

    expect(invalidCallA).toThrow(DynamoDBToolboxError)
    expect(invalidCallA).toThrow(expect.objectContaining({ code: 'actions.incompleteAction' }))

    const invalidCallB = () => TestTable.build(BatchWriteCommand).requests().params()

    expect(invalidCallB).toThrow(DynamoDBToolboxError)
    expect(invalidCallB).toThrow(expect.objectContaining({ code: 'actions.incompleteAction' }))
  })

  test('infers correct type', () => {
    const command = TestTable.build(BatchWriteCommand).requests(
      EntityA.build(BatchDeleteRequest).key({ pkA: 'a', skA: 'a' }),
      EntityB.build(BatchDeleteRequest).key({ pkB: 'b', skB: 'b' })
    )

    type AssertEntities = A.Equals<typeof command[$entities], [typeof EntityA, typeof EntityB]>
    const assertEntities: AssertEntities = 1
    assertEntities

    expect(command[$entities]).toStrictEqual([EntityA, EntityB])
  })

  test('infers correct type even when receiving an array of requests', () => {
    const requests = [
      EntityA.build(BatchDeleteRequest).key({ pkA: 'a', skA: 'a' }),
      EntityB.build(BatchDeleteRequest).key({ pkB: 'b', skB: 'b' })
    ]

    const command = TestTable.build(BatchWriteCommand).requests(...requests)

    // We have to do like this because order is not guaranteed
    type AssertEntitiesAB = A.Equals<typeof command[$entities], [typeof EntityA, typeof EntityB]>
    type AssertEntitiesBA = A.Equals<typeof command[$entities], [typeof EntityB, typeof EntityA]>
    const assertEntities: AssertEntitiesAB | AssertEntitiesBA = 1
    assertEntities

    expect(command[$entities]).toStrictEqual([EntityA, EntityB])
  })

  test('builds expected input', () => {
    const input = TestTable.build(BatchWriteCommand)
      .requests(
        EntityA.build(BatchPutRequest).item({
          pkA: 'a',
          skA: 'a',
          name: 'foo',
          commonAttribute: 'bar'
        }),
        EntityB.build(BatchDeleteRequest).key({ pkB: 'b', skB: 'b' })
      )
      .params()

    expect(input).toStrictEqual([
      {
        PutRequest: {
          Item: {
            _et: 'EntityA',
            _ct: expect.any(String),
            _md: expect.any(String),
            commonAttribute: 'bar',
            name: 'foo',
            pk: 'a',
            sk: 'a'
          }
        }
      },
      { DeleteRequest: { Key: { pk: 'b', sk: 'b' } } }
    ])
  })
})
