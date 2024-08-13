import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import {
  DynamoDBDocumentClient,
  BatchWriteCommand as _BatchWriteCommand
} from '@aws-sdk/lib-dynamodb'
import type { AwsStub } from 'aws-sdk-client-mock'
import { mockClient } from 'aws-sdk-client-mock'
import MockDate from 'mockdate'

import {
  BatchDeleteRequest,
  BatchPutRequest,
  DynamoDBToolboxError,
  Entity,
  Table,
  number,
  schema,
  string
} from '~/index.js'

import { BatchWriteCommand } from './batchWriteCommand.js'
import { execute, getCommandInput } from './execute.js'

const dynamoDbClient = new DynamoDBClient({ region: 'eu-west-1' })
const documentClient = DynamoDBDocumentClient.from(dynamoDbClient)
let documentClientMock: AwsStub<object, unknown, unknown>

const TestTable1 = new Table({
  name: 'test-table-1',
  partitionKey: { type: 'string', name: 'pk' },
  sortKey: { type: 'string', name: 'sk' },
  documentClient
})

const EntityA = new Entity({
  name: 'EntityA',
  schema: schema({
    pkA: string().key().savedAs('pk'),
    skA: string().key().savedAs('sk'),
    commonAttribute: string(),
    name: string()
  }),
  table: TestTable1
})

const EntityB = new Entity({
  name: 'EntityB',
  schema: schema({
    pkB: string().key().savedAs('pk'),
    skB: string().key().savedAs('sk'),
    commonAttribute: string(),
    age: number()
  }),
  table: TestTable1
})

const TestTable2 = new Table({
  name: 'test-table-2',
  partitionKey: { type: 'string', name: 'pk' },
  sortKey: { type: 'string', name: 'sk' },
  documentClient
})

const EntityC = new Entity({
  name: 'EntityC',
  schema: schema({
    pkC: string().key().savedAs('pk'),
    skC: string().key().savedAs('sk')
  }),
  table: TestTable2
})

describe('execute (batchWrite)', () => {
  beforeAll(() => {
    documentClientMock = mockClient(documentClient)
    MockDate.set(new Date())
  })

  afterAll(() => {
    documentClientMock.restore()
    MockDate.reset()
  })

  beforeEach(() => {
    documentClientMock.reset()
  })

  test('throws if no BatchWriteRequest has been provided', () => {
    const invalidCall = () => getCommandInput([])

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'actions.incompleteAction' }))
  })

  test('throws if two BatchWriteRequests have the same Table', () => {
    const invalidCall = () =>
      getCommandInput([
        TestTable1.build(BatchWriteCommand).requests(
          EntityA.build(BatchDeleteRequest).key({ pkA: 'a', skA: 'a' })
        ),
        TestTable1.build(BatchWriteCommand).requests(
          EntityB.build(BatchDeleteRequest).key({ pkB: 'b', skB: 'b' })
        )
      ])

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'actions.invalidAction' }))
  })

  test('writes valid input otherwise', () => {
    const input = getCommandInput([
      TestTable1.build(BatchWriteCommand).requests(
        EntityA.build(BatchPutRequest).item({
          pkA: 'a',
          skA: 'a',
          name: 'foo',
          commonAttribute: 'bar'
        }),
        EntityB.build(BatchDeleteRequest).key({ pkB: 'b', skB: 'b' })
      ),
      TestTable2.build(BatchWriteCommand).requests(
        EntityC.build(BatchDeleteRequest).key({ pkC: 'c', skC: 'c' })
      )
    ])

    expect(input).toStrictEqual({
      RequestItems: {
        'test-table-1': [
          {
            PutRequest: {
              Item: {
                _et: 'EntityA',
                _ct: expect.any(String),
                _md: expect.any(String),
                pk: 'a',
                sk: 'a',
                name: 'foo',
                commonAttribute: 'bar'
              }
            }
          },
          { DeleteRequest: { Key: { pk: 'b', sk: 'b' } } }
        ],
        'test-table-2': [{ DeleteRequest: { Key: { pk: 'c', sk: 'c' } } }]
      }
    })
  })

  test('accepts arrays of commands/requests', async () => {
    documentClientMock.on(_BatchWriteCommand).resolves({})

    const requests1 = [
      EntityA.build(BatchDeleteRequest).key({ pkA: 'a', skA: 'a' }),
      EntityB.build(BatchDeleteRequest).key({ pkB: 'b', skB: 'b' })
    ]

    const requests2 = [EntityC.build(BatchDeleteRequest).key({ pkC: 'c', skC: 'c' })]

    const commands = [
      TestTable1.build(BatchWriteCommand).requests(...requests1),
      TestTable2.build(BatchWriteCommand).requests(...requests2)
    ]

    await execute(...commands)

    expect(documentClientMock.calls()).toHaveLength(1)
    expect(documentClientMock.commandCalls(_BatchWriteCommand)[0].args[0].input).toMatchObject({
      RequestItems: {
        'test-table-1': [
          { DeleteRequest: { Key: { pk: 'a', sk: 'a' } } },
          { DeleteRequest: { Key: { pk: 'b', sk: 'b' } } }
        ],
        'test-table-2': [{ DeleteRequest: { Key: { pk: 'c', sk: 'c' } } }]
      }
    })
  })

  test('passes correct options', async () => {
    documentClientMock.on(_BatchWriteCommand).resolves({})

    await execute(
      { documentClient, capacity: 'TOTAL', metrics: 'SIZE' },
      TestTable1.build(BatchWriteCommand).requests(
        EntityA.build(BatchDeleteRequest).key({ pkA: 'a', skA: 'a' })
      )
    )

    expect(documentClientMock.calls()).toHaveLength(1)
    expect(documentClientMock.commandCalls(_BatchWriteCommand)[0].args[0].input).toMatchObject({
      ReturnConsumedCapacity: 'TOTAL',
      ReturnItemCollectionMetrics: 'SIZE'
    })
  })

  test('correctly retries if maxAttempts is specified', async () => {
    const batchDeleteRequestA = EntityA.build(BatchDeleteRequest).key({ pkA: 'a', skA: 'a' })
    const batchPutRequestA = EntityA.build(BatchPutRequest).item({
      pkA: 'a',
      skA: 'a',
      name: 'foo',
      commonAttribute: 'bar'
    })
    const batchDeleteRequestB = EntityB.build(BatchDeleteRequest).key({ pkB: 'b', skB: 'b' })
    const batchPutRequestB = EntityB.build(BatchPutRequest).item({
      pkB: 'c',
      skB: 'c',
      age: 42,
      commonAttribute: 'bar'
    })

    const command = TestTable1.build(BatchWriteCommand).requests(
      batchDeleteRequestA,
      batchPutRequestA,
      batchDeleteRequestB,
      batchPutRequestB
    )

    documentClientMock
      .on(_BatchWriteCommand)
      .resolvesOnce({
        UnprocessedItems: {
          [TestTable1.getName()]: [
            batchPutRequestA.params(),
            batchDeleteRequestB.params(),
            batchPutRequestB.params()
          ]
        }
      })
      .resolvesOnce({
        UnprocessedItems: {
          [TestTable1.getName()]: [batchDeleteRequestB.params(), batchPutRequestB.params()]
        }
      })
      .resolvesOnce({
        UnprocessedItems: {
          [TestTable1.getName()]: [batchPutRequestB.params()]
        }
      })

    const { UnprocessedItems } = await execute({ maxAttempts: 3 }, command)

    expect(documentClientMock.commandCalls(_BatchWriteCommand)).toHaveLength(3)
    expect(documentClientMock.commandCalls(_BatchWriteCommand)[0].args[0].input).toMatchObject({
      RequestItems: {
        [TestTable1.getName()]: [
          batchDeleteRequestA.params(),
          batchPutRequestA.params(),
          batchDeleteRequestB.params(),
          batchPutRequestB.params()
        ]
      }
    })
    expect(documentClientMock.commandCalls(_BatchWriteCommand)[1].args[0].input).toMatchObject({
      RequestItems: {
        [TestTable1.getName()]: [
          batchPutRequestA.params(),
          batchDeleteRequestB.params(),
          batchPutRequestB.params()
        ]
      }
    })
    expect(documentClientMock.commandCalls(_BatchWriteCommand)[2].args[0].input).toMatchObject({
      RequestItems: {
        [TestTable1.getName()]: [batchDeleteRequestB.params(), batchPutRequestB.params()]
      }
    })

    expect(UnprocessedItems).toStrictEqual({
      [TestTable1.getName()]: [batchPutRequestB.params()]
    })
  })
})
