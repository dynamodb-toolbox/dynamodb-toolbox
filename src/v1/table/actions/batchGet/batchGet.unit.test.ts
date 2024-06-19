import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, BatchGetCommand } from '@aws-sdk/lib-dynamodb'
import { mockClient, AwsStub } from 'aws-sdk-client-mock'
import { pick } from 'lodash'
import type { A } from 'ts-toolbelt'

import {
  DynamoDBToolboxError,
  EntityV2,
  TableV2,
  schema,
  string,
  BatchGetItemRequest,
  number,
  FormattedItem,
  SavedItem,
  KeyInput
} from 'v1'

import { BatchGetTableItemsRequest } from './batchGetTableItems'
import { batchGet, getBatchGetCommandInput } from './batchGet'

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
const keyA: KeyInput<typeof EntityA> = { pkA: 'a', skA: 'a' }
const savedItemA: SavedItem<typeof EntityA> = {
  _et: 'EntityA',
  _ct: '2021-09-01T00:00:00.000Z',
  _md: '2021-09-01T00:00:00.000Z',
  pk: 'a',
  sk: 'a',
  name: 'foo',
  commonAttribute: 'bar'
}
const formattedItemA: FormattedItem<typeof EntityA> = {
  created: '2021-09-01T00:00:00.000Z',
  modified: '2021-09-01T00:00:00.000Z',
  pkA: 'a',
  skA: 'a',
  name: 'foo',
  commonAttribute: 'bar'
}

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
const keyB: KeyInput<typeof EntityB> = { pkB: 'b', skB: 'b' }
const savedItemB: SavedItem<typeof EntityB> = {
  _et: 'EntityB',
  _ct: '2021-09-01T00:00:00.000Z',
  _md: '2021-09-01T00:00:00.000Z',
  pk: 'b',
  sk: 'b',
  age: 42,
  commonAttribute: 'bar'
}
const formattedItemB: FormattedItem<typeof EntityB> = {
  created: '2021-09-01T00:00:00.000Z',
  modified: '2021-09-01T00:00:00.000Z',
  pkB: 'b',
  skB: 'b',
  age: 42,
  commonAttribute: 'bar'
}

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
const keyC: KeyInput<typeof EntityC> = { pkC: 'c', skC: 'c' }
const savedItemC: SavedItem<typeof EntityC> = {
  _et: 'EntityC',
  _ct: '2021-09-01T00:00:00.000Z',
  _md: '2021-09-01T00:00:00.000Z',
  pk: 'c',
  sk: 'c'
}
const formattedItemC: FormattedItem<typeof EntityC> = {
  created: '2021-09-01T00:00:00.000Z',
  modified: '2021-09-01T00:00:00.000Z',
  pkC: 'c',
  skC: 'c'
}

describe('getBatchGetCommandInput', () => {
  beforeAll(() => {
    documentClientMock = mockClient(documentClient)
  })

  afterAll(() => {
    documentClientMock.restore()
  })

  beforeEach(() => {
    documentClientMock.reset()
  })

  it('throws if no batchGetTableItemsRequest has been provided', () => {
    const invalidCall = () => getBatchGetCommandInput([])

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'actions.incompleteAction' }))
  })

  it('throws if two batchGetTableItemsRequests have the same Table', () => {
    const invalidCall = () =>
      getBatchGetCommandInput([
        TestTable1.build(BatchGetTableItemsRequest).requests(
          EntityA.build(BatchGetItemRequest).key(keyA)
        ),
        TestTable1.build(BatchGetTableItemsRequest).requests(
          EntityB.build(BatchGetItemRequest).key(keyB)
        )
      ])

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'actions.incompleteAction' }))
  })

  it('writes valid input otherwise', () => {
    const input = getBatchGetCommandInput([
      TestTable1.build(BatchGetTableItemsRequest).requests(
        EntityA.build(BatchGetItemRequest).key(keyA),
        EntityB.build(BatchGetItemRequest).key(keyB)
      ),
      TestTable2.build(BatchGetTableItemsRequest).requests(
        EntityC.build(BatchGetItemRequest).key(keyC)
      )
    ])

    expect(input).toStrictEqual({
      RequestItems: {
        'test-table-1': {
          Keys: [
            { pk: 'a', sk: 'a' },
            { pk: 'b', sk: 'b' }
          ]
        },
        'test-table-2': { Keys: [{ pk: 'c', sk: 'c' }] }
      }
    })
  })

  it('returns correct response', async () => {
    documentClientMock.on(BatchGetCommand).resolves({
      Responses: {
        'test-table-1': [savedItemA, savedItemB],
        'test-table-2': [savedItemC]
      }
    })

    const { Responses } = await batchGet(
      TestTable1.build(BatchGetTableItemsRequest).requests(
        EntityA.build(BatchGetItemRequest).key(keyA),
        EntityB.build(BatchGetItemRequest).key(keyB)
      ),
      TestTable2.build(BatchGetTableItemsRequest).requests(
        EntityC.build(BatchGetItemRequest).key(keyC)
      )
    )

    type AssertResponse = A.Equals<
      typeof Responses,
      [
        [FormattedItem<typeof EntityA> | undefined, FormattedItem<typeof EntityB> | undefined],
        [FormattedItem<typeof EntityC> | undefined]
      ]
    >
    const assertResponse: AssertResponse = 1
    assertResponse

    expect(Responses).toStrictEqual([[formattedItemA, formattedItemB], [formattedItemC]])
  })

  it('formats response', async () => {
    documentClientMock.on(BatchGetCommand).resolves({
      Responses: {
        'test-table-1': [savedItemA, savedItemB],
        'test-table-2': [savedItemC]
      }
    })

    const { Responses } = await batchGet(
      TestTable1.build(BatchGetTableItemsRequest)
        .requests(
          EntityA.build(BatchGetItemRequest).key(keyA),
          EntityB.build(BatchGetItemRequest).key(keyB)
        )
        .options({ attributes: ['commonAttribute'] }),
      TestTable2.build(BatchGetTableItemsRequest)
        .requests(EntityC.build(BatchGetItemRequest).key(keyC))
        .options({ attributes: ['pkC'] })
    )

    type AssertResponse = A.Equals<
      typeof Responses,
      [
        [
          FormattedItem<typeof EntityA, { attributes: 'commonAttribute' }> | undefined,
          FormattedItem<typeof EntityB, { attributes: 'commonAttribute' }> | undefined
        ],
        [FormattedItem<typeof EntityC, { attributes: 'pkC' }> | undefined]
      ]
    >
    const assertResponse: AssertResponse = 1
    assertResponse

    expect(Responses).toStrictEqual([
      [pick(formattedItemA, 'commonAttribute'), pick(formattedItemB, 'commonAttribute')],
      [pick(formattedItemC, 'pkC')]
    ])
  })

  it('re-orders response item if needed', async () => {
    documentClientMock.on(BatchGetCommand).resolves({
      Responses: {
        'test-table-1': [savedItemB, savedItemA],
        'test-table-2': [savedItemC]
      }
    })

    const { Responses } = await batchGet(
      TestTable1.build(BatchGetTableItemsRequest).requests(
        EntityA.build(BatchGetItemRequest).key(keyA),
        EntityB.build(BatchGetItemRequest).key(keyB)
      ),
      TestTable2.build(BatchGetTableItemsRequest).requests(
        EntityC.build(BatchGetItemRequest).key(keyC)
      )
    )

    expect(Responses).toStrictEqual([[formattedItemA, formattedItemB], [formattedItemC]])
  })

  it('passes correct options', async () => {
    documentClientMock.on(BatchGetCommand).resolves({
      Responses: { 'test-table-1': [savedItemA] }
    })

    await batchGet(
      { documentClient, capacity: 'TOTAL' },
      TestTable1.build(BatchGetTableItemsRequest).requests(
        EntityA.build(BatchGetItemRequest).key(keyA)
      )
    )

    expect(documentClientMock.calls()).toHaveLength(1)
    expect(documentClientMock.commandCalls(BatchGetCommand)[0].args[0].input).toMatchObject({
      ReturnConsumedCapacity: 'TOTAL'
    })
  })
})
