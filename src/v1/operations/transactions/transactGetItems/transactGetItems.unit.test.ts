import { getTransactGetCommandInput } from './transactGetItems'
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
  beforeAll(() => {
    jest.spyOn(documentClient, 'send').mockImplementation(jest.fn())
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  it('should throw an error if dynamoDBDocumentClient is not found', async () => {
    const transactions: GetItemTransaction[] = []
    const options = {}
    await expect(transactGetItems(transactions, options)).rejects.toThrow(
      'DynamoDBDocumentClient not found'
    )
  })

  it('should send a transaction with the correct parameters', async () => {
    const transactions = [
      TestEntity.build(GetItemTransaction).key({
        email: 'titi@example.com',
        sort: 'titi'
      }),
      TestEntity2.build(GetItemTransaction).key({
        email: 'toto@example.com'
      })
    ]
    const options = { dynamoDBDocumentClient: documentClient }

    await transactGetItems(transactions, options)

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
