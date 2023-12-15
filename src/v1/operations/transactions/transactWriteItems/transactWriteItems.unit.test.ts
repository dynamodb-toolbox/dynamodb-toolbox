import {
  EntityV2,
  TableV2,
  PutItemTransaction,
  any,
  binary,
  boolean,
  list,
  map,
  number,
  schema,
  set,
  string
} from 'v1'
import { transactWriteItems, generateTransactWriteCommandInput } from './transactWriteItems'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'

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

describe('transactWriteItems', () => {
  it('should throw an error if dynamoDBDocumentClient is not found', async () => {
    const commands: PutItemTransaction[] = []
    const options = {}
    await expect(transactWriteItems(commands, options)).rejects.toThrow(
      'DynamoDBDocumentClient not found'
    )
  })

  it('should send a transaction with the correct parameters', async () => {
    const commands = [
      TestEntity.build(PutItemTransaction).item({ email: 'titi@example.com', sort: 'titi' }),
      TestEntity2.build(PutItemTransaction).item({
        email: 'toto@example.com'
      })
    ]
    const options = { dynamoDBDocumentClient: documentClient }

    jest.spyOn(documentClient, 'send').mockImplementation(jest.fn())

    await transactWriteItems(commands, options)

    expect(documentClient.send).toHaveBeenCalledTimes(1)
  })
})

describe('generateTransactWriteCommandInput', () => {
  it('should generate a transaction with the correct parameters', async () => {
    const mockDate = '2023-12-15T16:22:49.834Z'
    jest.useFakeTimers().setSystemTime(new Date(mockDate))

    const transactions = [
      TestEntity.build(PutItemTransaction).item({
        email: 'titi@example.com',
        sort: 'titi',
        test_any: 'any',
        test_binary: Buffer.from('a'),
        test_string: 'test string',
        count: 5,
        test_boolean: true,
        test_list: ['titi', 'tata'],
        test_map: { str: 'A' },
        test_string_set: new Set(['titi', 'tata']),
        test_number_set: new Set([1, 2, 3]),
        test_binary_set: new Set([Buffer.from('a'), Buffer.from('b')])
      }),
      TestEntity2.build(PutItemTransaction).item({
        email: 'toto@example.com',
        test_composite: 'hey',
        test_composite2: 'ho'
      })
    ]

    const transactWriteCommandInput = generateTransactWriteCommandInput(transactions)

    expect(transactWriteCommandInput).toEqual({
      TransactItems: [
        {
          Put: {
            Item: {
              _ct: mockDate,
              _et: 'TestEntity',
              _md: mockDate,
              pk: 'titi@example.com',
              sk: 'titi',
              test_any: 'any',
              test_binary: Buffer.from('a'),
              test_binary_set: new Set([Buffer.from('a'), Buffer.from('b')]),
              test_boolean: true,
              test_list: ['titi', 'tata'],
              test_map: {
                str: 'A'
              },
              test_number: 5,
              test_number_defaulted: 0,
              test_number_set: new Set([1, 2, 3]),
              test_string: 'test string',
              test_string_set: new Set(['titi', 'tata'])
            },
            TableName: 'test-table'
          }
        },
        {
          Put: {
            Item: {
              _ct: mockDate,
              _et: 'TestEntity2',
              _md: mockDate,
              pk: 'toto@example.com',
              sk: 'hey#ho',
              test_composite: 'hey',
              test_composite2: 'ho'
            },
            TableName: 'test-table-2'
          }
        }
      ]
    })
  })
})
