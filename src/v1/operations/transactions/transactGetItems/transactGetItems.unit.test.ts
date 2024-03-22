import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

import {
  any,
  binary,
  boolean,
  DynamoDBToolboxError,
  EntityV2,
  list,
  map,
  number,
  GetItemTransaction,
  schema,
  set,
  string,
  TableV2,
  transactGetItems
} from 'v1'

import { formatTransactGetResponse, getTransactGetCommandInput } from './transactGetItems'

const dynamoDbClient = new DynamoDBClient({ region: 'eu-west-1' })

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

const TestEntity = new EntityV2({
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

const TestTable2 = new TableV2({
  name: 'test-table-2',
  partitionKey: { type: 'string', name: 'pk' },
  documentClient
})

const TestEntity2 = new EntityV2({
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

describe('transactGetItems', () => {
  beforeEach(() => {
    jest.spyOn(documentClient, 'send').mockImplementation(() =>
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
    jest.resetAllMocks()
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  it('should throw an error if dynamoDBDocumentClient is not found', async () => {
    const transactions: GetItemTransaction[] = []
    const options = {}
    await expect(transactGetItems(options, ...transactions)).rejects.toThrow(
      'DynamoDBDocumentClient not found'
    )
  })

  it('should send a transaction from a tuple of GetItemTransaction', async () => {
    const options = { dynamoDBDocumentClient: documentClient }

    const result = await transactGetItems(
      options,
      TestEntity.build(GetItemTransaction)
        .key({ email: 'toto@example.com', sort: 'toto' })
        .options({ attributes: ['test_string'] }),
      TestEntity2.build(GetItemTransaction).key({
        email: 'tata@example.com'
      }),
      TestEntity2.build(GetItemTransaction)
        .key({
          email: 'titi@example.com'
        })
        .options({})
    )

    // Check values and TypeScript attributes access
    expect(result.Responses).toHaveLength(3)
    // Transaction 1
    expect(result.Responses?.[0]).not.toBeUndefined()
    if (result.Responses?.[0] === undefined) throw new Error('Unexpected undefined')
    const response1 = result.Responses[0]
    // response1 is typed, test_string attribute is accessible
    expect(response1.test_string).toEqual('test_string')
    // response1 is typed, email attribute is not accessible,
    // as the options attributes are limited to 'test_string'
    // @ts-expect-error -- Property 'email' does not exist on type '{ test_string: string; }'
    expect(response1?.email).toBeUndefined()

    // Transaction 2
    expect(result.Responses?.[1]?.email).toEqual('tata@example.com')

    // Transaction 3
    expect(result.Responses?.[2]?.email).toEqual('titi@example.com')

    expect(documentClient.send).toHaveBeenCalledTimes(1)
  })

  it('should send a transaction from an array of GetItemTransaction', async () => {
    const options = { dynamoDBDocumentClient: documentClient }
    const transactions = [
      TestEntity.build(GetItemTransaction)
        .key({ email: 'toto@example.com', sort: 'toto' })
        .options({ attributes: ['test_string'] }),
      TestEntity2.build(GetItemTransaction).key({
        email: 'titi@example.com'
      }),
      TestEntity2.build(GetItemTransaction)
        .key({
          email: 'tutu@example.com'
        })
        .options({})
    ]

    const result = await transactGetItems(options, ...transactions)

    // Check values and TypeScript attributes access
    // @ts-expect-error -- items are not typed completely due to the fact transactions is a generic array of GetItemTransactionInterface
    expect(result.Responses?.[0].test_string).toEqual('test_string')
    // Access to an unknown attribute is not forbidden by TypeScript
    expect(result.Responses?.[0]?.undefinedAttribute).toBeUndefined()

    expect(documentClient.send).toHaveBeenCalledTimes(1)
  })
})

const mockDate = '2023-12-15T16:22:49.834Z'

describe('generateTransactGetCommandInput', () => {
  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(new Date(mockDate))
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  it('should throw an error if an invalid option is set', async () => {
    const transactions = [
      TestEntity.build(GetItemTransaction).key({
        email: 'titi@example.com',
        sort: 'titi'
      })
    ]

    const invalidTransactGetCommandInputGeneration = () =>
      getTransactGetCommandInput(transactions, {
        // @ts-expect-error
        extra: true
      })

    expect(invalidTransactGetCommandInputGeneration).toThrow(DynamoDBToolboxError)
    expect(invalidTransactGetCommandInputGeneration).toThrow(
      expect.objectContaining({ code: 'operations.unknownOption' })
    )
  })
  it('should generate a transaction with the correct parameters', async () => {
    const transactions = [
      TestEntity.build(GetItemTransaction).key({
        email: 'tata@example.com',
        sort: 'tata'
      }),
      TestEntity2.build(GetItemTransaction)
        .key({
          email: 'toto@example.com'
        })
        .options({ attributes: ['created', 'test_composite'] })
    ]

    const transactGetCommandInput = getTransactGetCommandInput(transactions, {
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
  it('should format a transactGet response', async () => {
    const response = {
      $metadata: {},
      ConsumedCapacity: [
        {
          CapacityUnits: 1,
          TableName: 'test-table'
        },
        {
          CapacityUnits: 1,
          TableName: 'test-table-2'
        }
      ],
      Responses: [
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
    }

    const formattedResponse = formatTransactGetResponse(
      response,
      TestEntity.build(GetItemTransaction).key({
        email: 'toto@example.com',
        sort: 'toto'
      }),
      TestEntity2.build(GetItemTransaction)
        .key({
          email: 'tata@example.com'
        })
        .options({ attributes: ['test_composite'] })
    )
    expect(formattedResponse).toHaveLength(2)
    expect(formattedResponse?.[0]).toEqual({
      created: '2023-12-15T16:22:49.834Z',
      modified: '2023-12-15T16:22:49.834Z',
      email: 'toto@example.com',
      sort: 'toto',
      test_string: 'test string',
      test_number_defaulted: 2
    })
    expect(formattedResponse?.[1]).toEqual({
      test_composite: 'test_composite'
    })
  })

  it('should format a transactGet with no projected attribute', async () => {
    const response = {
      $metadata: {},
      ConsumedCapacity: [
        {
          CapacityUnits: 1,
          TableName: 'test-table'
        }
      ],
      Responses: [
        {
          Item: {}
        }
      ]
    }

    const formattedResponse = formatTransactGetResponse(
      response,
      TestEntity.build(GetItemTransaction)
        .key({
          email: 'toto@example.com',
          sort: 'toto'
        })
        .options({ attributes: [] })
    )
    expect(formattedResponse).toHaveLength(1)
    expect(formattedResponse?.[0]).toEqual({})
  })

  it('should format a null response', async () => {
    const response = {
      $metadata: {},
      ConsumedCapacity: [
        {
          CapacityUnits: 1,
          TableName: 'test-table'
        }
      ],
      Responses: [{ Item: undefined }]
    }

    const formattedResponse = formatTransactGetResponse(
      response,
      TestEntity.build(GetItemTransaction).key({
        email: 'toto@example.com',
        sort: 'toto'
      })
    )
    expect(formattedResponse).toHaveLength(1)
    expect(formattedResponse?.[0]).toBeUndefined()
  })

  it('should format an undefined response', async () => {
    const response = {
      $metadata: {}
    }

    const formattedResponse = formatTransactGetResponse(response)
    expect(formattedResponse).toBeUndefined()
  })

  it('should throw an error if response length is different from transactions length', async () => {
    const response = {
      $metadata: {},
      ConsumedCapacity: [
        {
          CapacityUnits: 1,
          TableName: 'test-table'
        }
      ],
      Responses: [{ Item: undefined }, { Item: undefined }]
    }
    const invalidFormatting = () =>
      formatTransactGetResponse(
        response,
        TestEntity.build(GetItemTransaction).key({
          email: 'toto@example.com',
          sort: 'toto'
        })
      )

    expect(invalidFormatting).toThrow(DynamoDBToolboxError)
    expect(invalidFormatting).toThrow(
      expect.objectContaining({ code: 'operations.inconsistentNumberOfItems' })
    )
  })
})
