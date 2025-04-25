import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import type { __MetadataBearer } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, BatchGetCommand as _BatchGetCommand } from '@aws-sdk/lib-dynamodb'
import { mockClient } from 'aws-sdk-client-mock'
import type { AwsStub } from 'aws-sdk-client-mock'
import MockDate from 'mockdate'
import type { A } from 'ts-toolbelt'

import {
  BatchGetRequest,
  DynamoDBToolboxError,
  Entity,
  Table,
  item,
  number,
  string
} from '~/index.js'
import type { FormattedItem, KeyInputItem, SavedItem } from '~/index.js'
import { pick } from '~/utils/pick.js'

import { BatchGetCommand } from './batchGetCommand.js'
import { execute, getCommandInput } from './execute.js'

const dynamoDbClient = new DynamoDBClient({ region: 'eu-west-1' })
const documentClient = DynamoDBDocumentClient.from(dynamoDbClient)
let documentClientMock: AwsStub<object, __MetadataBearer, unknown>

const TestTable1 = new Table({
  name: 'test-table-1',
  partitionKey: { type: 'string', name: 'pk' },
  sortKey: { type: 'string', name: 'sk' },
  documentClient
})

const EntityA = new Entity({
  name: 'EntityA',
  schema: item({
    pkA: string().key().savedAs('pk'),
    skA: string().key().savedAs('sk'),
    common: string(),
    name: string()
  }),
  table: TestTable1
})
const keyA: KeyInputItem<typeof EntityA> = { pkA: 'a', skA: 'a' }
const savedItemA: SavedItem<typeof EntityA> = {
  _et: 'EntityA',
  _ct: '2021-09-01T00:00:00.000Z',
  _md: '2021-09-01T00:00:00.000Z',
  pk: 'a',
  sk: 'a',
  name: 'foo',
  common: 'bar'
}
const formattedItemA: FormattedItem<typeof EntityA> = {
  created: '2021-09-01T00:00:00.000Z',
  modified: '2021-09-01T00:00:00.000Z',
  pkA: 'a',
  skA: 'a',
  name: 'foo',
  common: 'bar'
}

const EntityB = new Entity({
  name: 'EntityB',
  schema: item({
    pkB: string().key().savedAs('pk'),
    skB: string().key().savedAs('sk'),
    common: string().savedAs('_c'),
    age: number()
  }),
  table: TestTable1
})
const keyB: KeyInputItem<typeof EntityB> = { pkB: 'b', skB: 'b' }
const savedItemB: SavedItem<typeof EntityB> = {
  _et: 'EntityB',
  _ct: '2021-09-01T00:00:00.000Z',
  _md: '2021-09-01T00:00:00.000Z',
  pk: 'b',
  sk: 'b',
  age: 42,
  _c: 'bar'
}
const formattedItemB: FormattedItem<typeof EntityB> = {
  created: '2021-09-01T00:00:00.000Z',
  modified: '2021-09-01T00:00:00.000Z',
  pkB: 'b',
  skB: 'b',
  age: 42,
  common: 'bar'
}

const TestTable2 = new Table({
  name: 'test-table-2',
  partitionKey: { type: 'string', name: 'pk' },
  sortKey: { type: 'string', name: 'sk' },
  documentClient
})

const EntityC = new Entity({
  name: 'EntityC',
  schema: item({
    pkC: string().key().savedAs('pk'),
    skC: string().key().savedAs('sk')
  }),
  table: TestTable2
})
const keyC: KeyInputItem<typeof EntityC> = { pkC: 'c', skC: 'c' }
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

describe('execute (batchGet)', () => {
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

  test('throws if no command has been provided', () => {
    const invalidCall = () => getCommandInput([])

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'actions.incompleteAction' }))
  })

  test('throws if two commands have the same Table', () => {
    const invalidCall = () =>
      getCommandInput([
        TestTable1.build(BatchGetCommand).requests(EntityA.build(BatchGetRequest).key(keyA)),
        TestTable1.build(BatchGetCommand).requests(EntityB.build(BatchGetRequest).key(keyB))
      ])

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'actions.invalidAction' }))
  })

  test('writes valid input otherwise', () => {
    const input = getCommandInput([
      TestTable1.build(BatchGetCommand).requests(
        EntityA.build(BatchGetRequest).key(keyA),
        EntityB.build(BatchGetRequest).key(keyB)
      ),
      TestTable2.build(BatchGetCommand).requests(EntityC.build(BatchGetRequest).key(keyC))
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

  test('returns correct response when receiving a tuple of requests', async () => {
    documentClientMock.on(_BatchGetCommand).resolves({
      Responses: {
        'test-table-1': [savedItemA, savedItemB],
        'test-table-2': [savedItemC]
      }
    })

    const { Responses } = await execute(
      TestTable1.build(BatchGetCommand).requests(
        EntityA.build(BatchGetRequest).key(keyA),
        EntityB.build(BatchGetRequest).key(keyB)
      ),
      TestTable2.build(BatchGetCommand).requests(EntityC.build(BatchGetRequest).key(keyC))
    )

    const assertResponse: A.Equals<
      typeof Responses,
      [
        [FormattedItem<typeof EntityA> | undefined, FormattedItem<typeof EntityB> | undefined],
        [FormattedItem<typeof EntityC> | undefined]
      ]
    > = 1
    assertResponse

    expect(Responses).toStrictEqual([[formattedItemA, formattedItemB], [formattedItemC]])
  })

  test('returns correct type even receiving an array of request', async () => {
    documentClientMock.on(_BatchGetCommand).resolves({
      Responses: {
        'test-table-1': [savedItemA, savedItemB],
        'test-table-2': [savedItemC]
      }
    })

    const requests1 = [
      EntityA.build(BatchGetRequest).key(keyA),
      EntityB.build(BatchGetRequest).key(keyB)
    ]

    const requests2 = [EntityC.build(BatchGetRequest).key(keyC)]

    const commands = [
      TestTable1.build(BatchGetCommand).requests(...requests1),
      TestTable2.build(BatchGetCommand).requests(...requests2)
    ]

    const { Responses } = await execute(...commands)

    const assertResponse: A.Equals<
      typeof Responses,
      (
        | (FormattedItem<typeof EntityA> | FormattedItem<typeof EntityB> | undefined)[]
        | (FormattedItem<typeof EntityC> | undefined)[]
      )[]
    > = 1
    assertResponse

    expect(Responses).toStrictEqual([[formattedItemA, formattedItemB], [formattedItemC]])
  })

  test('returns correct type even receiving a mix of tuple & array of requests', async () => {
    documentClientMock.on(_BatchGetCommand).resolves({
      Responses: {
        'test-table-1': [savedItemA, savedItemB],
        'test-table-2': [savedItemC]
      }
    })

    const requests1: [BatchGetRequest<typeof EntityA>, ...BatchGetRequest<typeof EntityB>[]] = [
      EntityA.build(BatchGetRequest).key(keyA),
      EntityB.build(BatchGetRequest).key(keyB)
    ]

    const { Responses } = await execute(TestTable1.build(BatchGetCommand).requests(...requests1))

    const assertResponse: A.Equals<
      typeof Responses,
      [
        [
          FormattedItem<typeof EntityA> | undefined,
          ...(FormattedItem<typeof EntityB> | undefined)[]
        ]
      ]
    > = 1
    assertResponse

    expect(Responses).toStrictEqual([[formattedItemA, formattedItemB]])
  })

  test('formats response', async () => {
    documentClientMock.on(_BatchGetCommand).resolves({
      Responses: {
        'test-table-1': [savedItemA, savedItemB],
        'test-table-2': [savedItemC]
      }
    })

    const { Responses } = await execute(
      TestTable1.build(BatchGetCommand)
        .requests(
          EntityA.build(BatchGetRequest).key(keyA),
          EntityB.build(BatchGetRequest).key(keyB)
        )
        .options({ attributes: ['age', 'name'] }),
      TestTable2.build(BatchGetCommand)
        .requests(EntityC.build(BatchGetRequest).key(keyC))
        .options({ attributes: ['pkC'] })
    )

    const assertResponse: A.Equals<
      typeof Responses,
      [
        [
          FormattedItem<typeof EntityA, { attributes: 'name' }> | undefined,
          FormattedItem<typeof EntityB, { attributes: 'age' }> | undefined
        ],
        [FormattedItem<typeof EntityC, { attributes: 'pkC' }> | undefined]
      ]
    > = 1
    assertResponse

    expect(Responses).toStrictEqual([
      [pick(formattedItemA, 'name'), pick(formattedItemB, 'age')],
      [pick(formattedItemC, 'pkC')]
    ])
  })

  test('re-orders response items if needed', async () => {
    documentClientMock.on(_BatchGetCommand).resolves({
      Responses: {
        'test-table-1': [savedItemB, savedItemA],
        'test-table-2': [savedItemC]
      }
    })

    const { Responses } = await execute(
      TestTable1.build(BatchGetCommand).requests(
        EntityA.build(BatchGetRequest).key(keyA),
        EntityB.build(BatchGetRequest).key(keyB)
      ),
      TestTable2.build(BatchGetCommand).requests(EntityC.build(BatchGetRequest).key(keyC))
    )

    expect(Responses).toStrictEqual([[formattedItemA, formattedItemB], [formattedItemC]])
  })

  test('passes correct options', async () => {
    documentClientMock.on(_BatchGetCommand).resolves({
      Responses: { 'test-table-1': [savedItemA] }
    })

    const { Responses } = await execute(
      { documentClient, capacity: 'TOTAL' },
      TestTable1.build(BatchGetCommand).requests(EntityA.build(BatchGetRequest).key(keyA))
    )

    const assertResponse: A.Equals<
      typeof Responses,
      [[FormattedItem<typeof EntityA> | undefined]]
    > = 1
    assertResponse

    expect(documentClientMock.calls()).toHaveLength(1)
    expect(documentClientMock.commandCalls(_BatchGetCommand)[0]?.args[0].input).toMatchObject({
      ReturnConsumedCapacity: 'TOTAL'
    })
  })

  test('correctly retries if maxAttempts is specified', async () => {
    const batchGetRequestA = EntityA.build(BatchGetRequest).key({ pkA: 'a', skA: 'a' })
    const batchGetRequestB = EntityA.build(BatchGetRequest).key({ pkA: 'b', skA: 'b' })
    const batchGetRequestC = EntityB.build(BatchGetRequest).key({ pkB: 'c', skB: 'c' })
    const batchGetRequestD = EntityB.build(BatchGetRequest).key({ pkB: 'd', skB: 'd' })

    const command = TestTable1.build(BatchGetCommand).requests(
      batchGetRequestA,
      batchGetRequestB,
      batchGetRequestC,
      batchGetRequestD
    )

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { Keys: keys = [], ...restCommand } = command.params()[TestTable1.getName()]!

    documentClientMock
      .on(_BatchGetCommand)
      .resolvesOnce({
        UnprocessedKeys: {
          [TestTable1.getName()]: { Keys: keys.slice(1), ...restCommand }
        }
      })
      .resolvesOnce({
        UnprocessedKeys: {
          [TestTable1.getName()]: { Keys: keys.slice(2), ...restCommand }
        }
      })
      .resolvesOnce({
        UnprocessedKeys: {
          [TestTable1.getName()]: { Keys: keys.slice(3), ...restCommand }
        }
      })

    const { UnprocessedKeys } = await execute({ maxAttempts: 3 }, command)

    expect(documentClientMock.commandCalls(_BatchGetCommand)).toHaveLength(3)
    expect(documentClientMock.commandCalls(_BatchGetCommand)[0]?.args[0].input).toMatchObject({
      RequestItems: {
        [TestTable1.getName()]: {
          Keys: [
            batchGetRequestA.params(),
            batchGetRequestB.params(),
            batchGetRequestC.params(),
            batchGetRequestD.params()
          ],
          ...restCommand
        }
      }
    })
    expect(documentClientMock.commandCalls(_BatchGetCommand)[1]?.args[0].input).toMatchObject({
      RequestItems: {
        [TestTable1.getName()]: {
          Keys: [batchGetRequestB.params(), batchGetRequestC.params(), batchGetRequestD.params()],
          ...restCommand
        }
      }
    })
    expect(documentClientMock.commandCalls(_BatchGetCommand)[2]?.args[0].input).toMatchObject({
      RequestItems: {
        [TestTable1.getName()]: {
          Keys: [batchGetRequestC.params(), batchGetRequestD.params()],
          ...restCommand
        }
      }
    })

    expect(UnprocessedKeys).toStrictEqual({
      [TestTable1.getName()]: { Keys: keys.slice(3), ...restCommand }
    })
  })
})
