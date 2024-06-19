import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, BatchWriteCommand } from '@aws-sdk/lib-dynamodb'
import { AwsStub, mockClient } from 'aws-sdk-client-mock'

import {
  DynamoDBToolboxError,
  EntityV2,
  TableV2,
  schema,
  string,
  number,
  BatchDeleteItemRequest,
  BatchPutItemRequest
} from 'v1'

import { BatchWriteTableItemsRequest } from './batchWriteTableItems'
import { batchWrite, getBatchWriteCommandInput } from './batchWrite'

const dynamoDbClient = new DynamoDBClient({ region: 'eu-west-1' })
const documentClient = DynamoDBDocumentClient.from(dynamoDbClient)
let documentClientMock: AwsStub<object, unknown, unknown>

const TestTable1 = new TableV2({
  name: 'test-table-1',
  partitionKey: { type: 'string', name: 'pk' },
  sortKey: { type: 'string', name: 'sk' },
  documentClient
})

const EntityA = new EntityV2({
  name: 'EntityA',
  schema: schema({
    pkA: string().key().savedAs('pk'),
    skA: string().key().savedAs('sk'),
    commonAttribute: string(),
    name: string()
  }),
  table: TestTable1
})

const EntityB = new EntityV2({
  name: 'EntityB',
  schema: schema({
    pkB: string().key().savedAs('pk'),
    skB: string().key().savedAs('sk'),
    commonAttribute: string(),
    age: number()
  }),
  table: TestTable1
})

const TestTable2 = new TableV2({
  name: 'test-table-2',
  partitionKey: { type: 'string', name: 'pk' },
  sortKey: { type: 'string', name: 'sk' },
  documentClient
})

const EntityC = new EntityV2({
  name: 'EntityC',
  schema: schema({
    pkC: string().key().savedAs('pk'),
    skC: string().key().savedAs('sk')
  }),
  table: TestTable2
})

describe('getBatchWriteCommandInput', () => {
  beforeAll(() => {
    documentClientMock = mockClient(documentClient)
  })

  afterAll(() => {
    documentClientMock.restore()
  })

  beforeEach(() => {
    documentClientMock.reset()
  })

  it('throws if no BatchWriteTableItemsRequest has been provided', () => {
    const invalidCall = () => getBatchWriteCommandInput([])

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'actions.incompleteAction' }))
  })

  it('throws if two BatchWriteTableItemsRequests have the same Table', () => {
    const invalidCall = () =>
      getBatchWriteCommandInput([
        TestTable1.build(BatchWriteTableItemsRequest).requests(
          EntityA.build(BatchDeleteItemRequest).key({ pkA: 'a', skA: 'a' })
        ),
        TestTable1.build(BatchWriteTableItemsRequest).requests(
          EntityB.build(BatchDeleteItemRequest).key({ pkB: 'b', skB: 'b' })
        )
      ])

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'actions.incompleteAction' }))
  })

  it('writes valid input otherwise', () => {
    const input = getBatchWriteCommandInput([
      TestTable1.build(BatchWriteTableItemsRequest).requests(
        EntityA.build(BatchPutItemRequest).item({
          pkA: 'a',
          skA: 'a',
          name: 'foo',
          commonAttribute: 'bar'
        }),
        EntityB.build(BatchDeleteItemRequest).key({ pkB: 'b', skB: 'b' })
      ),
      TestTable2.build(BatchWriteTableItemsRequest).requests(
        EntityC.build(BatchDeleteItemRequest).key({ pkC: 'c', skC: 'c' })
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

  it('passes correct options', async () => {
    documentClientMock.on(BatchWriteCommand).resolves({})

    await batchWrite(
      { documentClient, capacity: 'TOTAL', metrics: 'SIZE' },
      TestTable1.build(BatchWriteTableItemsRequest).requests(
        EntityA.build(BatchDeleteItemRequest).key({ pkA: 'a', skA: 'a' })
      )
    )

    expect(documentClientMock.calls()).toHaveLength(1)
    expect(documentClientMock.commandCalls(BatchWriteCommand)[0].args[0].input).toMatchObject({
      ReturnConsumedCapacity: 'TOTAL',
      ReturnItemCollectionMetrics: 'SIZE'
    })
  })
})
