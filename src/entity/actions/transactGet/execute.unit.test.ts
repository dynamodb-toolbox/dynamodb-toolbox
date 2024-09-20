import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import type { A } from 'ts-toolbelt'

import {
  DynamoDBToolboxError,
  Entity,
  GetTransaction,
  Table,
  any,
  binary,
  boolean,
  list,
  map,
  number,
  schema,
  set,
  string
} from '~/index.js'
import type { FormattedItem } from '~/index.js'

import { formatResponses, getCommandInput } from './execute.js'
import { execute } from './execute.js'

const dynamoDbClient = new DynamoDBClient({ region: 'eu-west-1' })
const documentClient = DynamoDBDocumentClient.from(dynamoDbClient)

const TestTable = new Table({
  name: 'test-table',
  partitionKey: { type: 'string', name: 'pk' },
  sortKey: { type: 'string', name: 'sk' },
  documentClient
})

const TestEntity = new Entity({
  name: 'TestEntity',
  schema: schema({
    email: string().key().savedAs('pk'),
    sort: string().key().savedAs('sk'),
    test_any: any().optional(),
    test_binary: binary().optional(),
    test_string: string().putDefault('test string'),
    count: number().optional().savedAs('test_number'),
    test_number_defaulted: number().putDefault(0),
    test_boolean: boolean().optional(),
    test_list: list(string()).optional(),
    test_map: map({
      str: string()
    }).optional(),
    test_string_set: set(string()).optional(),
    test_number_set: set(number()).optional(),
    test_binary_set: set(binary()).optional()
  }),
  table: TestTable
})

const TestTable2 = new Table({
  name: 'test-table-2',
  partitionKey: { type: 'string', name: 'pk' },
  documentClient
})

const TestEntity2 = new Entity({
  name: 'TestEntity2',
  schema: schema({
    email: string().key().savedAs('pk'),
    test_composite: string().optional(),
    test_composite2: string().optional()
  }).and(schema => ({
    sort: string()
      .optional()
      .savedAs('sk')
      .putLink<typeof schema>(
        ({ test_composite, test_composite2 }) =>
          test_composite && test_composite2 && [test_composite, test_composite2].join('#')
      )
  })),
  table: TestTable2
})

describe('execute', () => {
  beforeEach(() => {
    vi.spyOn(documentClient, 'send').mockImplementation(() =>
      Promise.resolve({
        Responses: [
          {
            Item: {
              _et: 'TestEntity',
              _ct: mockDate,
              _md: mockDate,
              pk: 'toto@example.com',
              test_string: 'test_string',
              test_number_defaulted: 0,
              something: 'something'
            }
          },
          { Item: { _et: 'TestEntity2', _ct: mockDate, _md: mockDate, pk: 'tata@example.com' } },
          { Item: { _et: 'TestEntity2', _ct: mockDate, _md: mockDate, pk: 'titi@example.com' } }
        ]
      })
    )
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  afterAll(() => {
    vi.restoreAllMocks()
  })

  test('should throw an error if dynamoDBDocumentClient is not found', async () => {
    await expect(execute).rejects.toThrow(DynamoDBToolboxError)
    await expect(execute).rejects.toThrow(
      expect.objectContaining({ code: 'actions.incompleteAction' })
    )
  })

  test('should send a transaction from a tuple of GetTransaction', async () => {
    const { Responses: responses } = await execute(
      { documentClient },
      TestEntity.build(GetTransaction)
        .key({ email: 'toto@example.com', sort: 'toto' })
        .options({ attributes: ['test_string'] }),
      TestEntity2.build(GetTransaction).key({ email: 'tata@example.com' }),
      TestEntity2.build(GetTransaction).key({ email: 'titi@example.com' }).options({})
    )

    expect(responses).toHaveLength(3)

    const assertResponse: A.Equals<
      typeof responses,
      | [
          { Item?: FormattedItem<typeof TestEntity, { attributes: 'test_string' }> },
          { Item?: FormattedItem<typeof TestEntity2> },
          { Item?: FormattedItem<typeof TestEntity2> }
        ]
      | undefined
    > = 1
    assertResponse

    const [response1, response2, response3] = responses ?? []
    expect(response1).toStrictEqual({ Item: { test_string: 'test_string' } })
    expect(response2).toStrictEqual({
      Item: {
        created: '2023-12-15T16:22:49.834Z',
        modified: '2023-12-15T16:22:49.834Z',
        email: 'tata@example.com'
      }
    })
    expect(response3).toStrictEqual({
      Item: {
        created: '2023-12-15T16:22:49.834Z',
        modified: '2023-12-15T16:22:49.834Z',
        email: 'titi@example.com'
      }
    })

    expect(documentClient.send).toHaveBeenCalledTimes(1)
  })

  test('should send a transaction from an array of GetTransaction', async () => {
    const transactions = [
      TestEntity.build(GetTransaction)
        .key({ email: 'toto@example.com', sort: 'toto' })
        .options({ attributes: ['test_string'] }),
      TestEntity2.build(GetTransaction).key({ email: 'titi@example.com' }),
      TestEntity2.build(GetTransaction).key({ email: 'tutu@example.com' }).options({})
    ]

    const { Responses: responses } = await execute({ documentClient }, ...transactions)

    expect(responses).toHaveLength(3)

    const assertResponse: A.Equals<
      typeof responses,
      | (
          | { Item?: FormattedItem<typeof TestEntity, { attributes: 'test_string' }> }
          | { Item?: FormattedItem<typeof TestEntity2> }
        )[]
      | undefined
    > = 1
    assertResponse

    const [response1, response2, response3] = responses ?? []
    expect(response1).toStrictEqual({ Item: { test_string: 'test_string' } })
    expect(response2).toStrictEqual({
      Item: {
        created: '2023-12-15T16:22:49.834Z',
        modified: '2023-12-15T16:22:49.834Z',
        email: 'tata@example.com'
      }
    })
    expect(response3).toStrictEqual({
      Item: {
        created: '2023-12-15T16:22:49.834Z',
        modified: '2023-12-15T16:22:49.834Z',
        email: 'titi@example.com'
      }
    })

    expect(documentClient.send).toHaveBeenCalledTimes(1)
  })

  test('should send a transaction from a mix of tuple and array of GetTransaction', async () => {
    const transactions: [
      GetTransaction<typeof TestEntity, { attributes: ['test_string'] }>,
      ...GetTransaction<typeof TestEntity2>[]
    ] = [
      TestEntity.build(GetTransaction)
        .key({ email: 'toto@example.com', sort: 'toto' })
        .options({ attributes: ['test_string'] }),
      TestEntity2.build(GetTransaction).key({ email: 'titi@example.com' }),
      TestEntity2.build(GetTransaction).key({ email: 'tutu@example.com' }).options({})
    ]

    const { Responses: responses } = await execute({ documentClient }, ...transactions)

    expect(responses).toHaveLength(3)

    const assertResponse: A.Equals<
      typeof responses,
      | [
          { Item?: FormattedItem<typeof TestEntity, { attributes: 'test_string' }> },
          ...{ Item?: FormattedItem<typeof TestEntity2> }[]
        ]
      | undefined
    > = 1
    assertResponse

    const [response1, response2, response3] = responses ?? []
    expect(response1).toStrictEqual({ Item: { test_string: 'test_string' } })
    expect(response2).toStrictEqual({
      Item: {
        created: '2023-12-15T16:22:49.834Z',
        modified: '2023-12-15T16:22:49.834Z',
        email: 'tata@example.com'
      }
    })
    expect(response3).toStrictEqual({
      Item: {
        created: '2023-12-15T16:22:49.834Z',
        modified: '2023-12-15T16:22:49.834Z',
        email: 'titi@example.com'
      }
    })

    expect(documentClient.send).toHaveBeenCalledTimes(1)
  })
})

const mockDate = '2023-12-15T16:22:49.834Z'

describe('generateTransactGetCommandInput', () => {
  beforeAll(() => {
    vi.useFakeTimers().setSystemTime(new Date(mockDate))
  })

  afterAll(() => {
    vi.useRealTimers()
  })

  test('should throw an error if an invalid option is set', async () => {
    const transactions = [
      TestEntity.build(GetTransaction).key({
        email: 'titi@example.com',
        sort: 'titi'
      })
    ]

    const invalidTransactGetCommandInputGeneration = () =>
      getCommandInput(transactions, {
        // @ts-expect-error
        extra: true
      })

    expect(invalidTransactGetCommandInputGeneration).toThrow(DynamoDBToolboxError)
    expect(invalidTransactGetCommandInputGeneration).toThrow(
      expect.objectContaining({ code: 'options.unknownOption' })
    )
  })
  test('should generate a transaction with the correct parameters', async () => {
    const transactions = [
      TestEntity.build(GetTransaction).key({
        email: 'tata@example.com',
        sort: 'tata'
      }),
      TestEntity2.build(GetTransaction)
        .key({
          email: 'toto@example.com'
        })
        .options({ attributes: ['created', 'test_composite'] })
    ]

    const transactGetCommandInput = getCommandInput(transactions, {
      capacity: 'NONE'
    })

    expect(transactGetCommandInput).toEqual({
      ReturnConsumedCapacity: 'NONE',
      TransactItems: [
        {
          Get: {
            Key: {
              pk: 'tata@example.com',
              sk: 'tata'
            },
            TableName: 'test-table'
          }
        },
        {
          Get: {
            Key: {
              pk: 'toto@example.com'
            },
            TableName: 'test-table-2',
            ExpressionAttributeNames: {
              '#p_1': '_ct',
              '#p_2': 'test_composite'
            },
            ProjectionExpression: '#p_1, #p_2'
          }
        }
      ]
    })
  })
})

describe('formatTransactGetResponse', () => {
  test('should format a transactGet response', async () => {
    const responses = [
      {
        Item: {
          _ct: mockDate,
          _md: mockDate,
          _et: 'TestEntity',
          pk: 'toto@example.com',
          sk: 'toto',
          test_string: 'test string',
          test_number_defaulted: 2
        }
      },
      {
        Item: {
          pk: 'tata@example.com',
          test_composite: 'test_composite'
        }
      }
    ]

    const formattedResponse = formatResponses(
      responses,
      TestEntity.build(GetTransaction).key({
        email: 'toto@example.com',
        sort: 'toto'
      }),
      TestEntity2.build(GetTransaction)
        .key({ email: 'tata@example.com' })
        .options({ attributes: ['test_composite'] })
    )

    expect(formattedResponse).toHaveLength(2)
    expect(formattedResponse?.[0]).toEqual({
      Item: {
        created: '2023-12-15T16:22:49.834Z',
        modified: '2023-12-15T16:22:49.834Z',
        email: 'toto@example.com',
        sort: 'toto',
        test_string: 'test string',
        test_number_defaulted: 2
      }
    })
    expect(formattedResponse?.[1]).toEqual({
      Item: { test_composite: 'test_composite' }
    })
  })

  test('should format a transactGet with no projected attribute', async () => {
    const responses = [{ Item: {} }]

    const formattedResponse = formatResponses(
      responses,
      TestEntity.build(GetTransaction)
        .key({ email: 'toto@example.com', sort: 'toto' })
        .options({ attributes: [] })
    )
    expect(formattedResponse).toHaveLength(1)
    expect(formattedResponse?.[0]).toStrictEqual({ Item: {} })
  })

  test('should format a null response', async () => {
    const responses = [{ Item: undefined }]

    const formattedResponse = formatResponses(
      responses,
      TestEntity.build(GetTransaction).key({
        email: 'toto@example.com',
        sort: 'toto'
      })
    )
    expect(formattedResponse).toHaveLength(1)
    expect(formattedResponse?.[0]).toStrictEqual({ Item: undefined })
  })
})
