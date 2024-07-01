import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

import {
  ConditionCheck,
  DynamoDBToolboxError,
  Entity,
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

const dynamoDbClient = new DynamoDBClient({})

const documentClient = DynamoDBDocumentClient.from(dynamoDbClient)

const TestTable = new Table({
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

describe('condition check transaction', () => {
  test('sets condition', () => {
    const { ExpressionAttributeNames, ExpressionAttributeValues, ConditionExpression } =
      TestEntity.build(ConditionCheck)
        .key({ email: 'x', sort: 'y' })
        .condition({ attr: 'email', gt: 'test' })
        .params()

    expect(ExpressionAttributeNames).toEqual({ '#c_1': 'pk' })
    expect(ExpressionAttributeValues).toEqual({ ':c_1': 'test' })
    expect(ConditionExpression).toBe('#c_1 > :c_1')
  })

  test('missing key', () => {
    const invalidCall = () => TestEntity.build(ConditionCheck).params()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'actions.incompleteAction' }))
  })

  test('missing condition', () => {
    const invalidCall = () =>
      TestEntity.build(ConditionCheck).key({ email: 'x', sort: 'y' }).params()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'actions.incompleteAction' }))
  })

  test('fails with invalid condition', () => {
    const invalidCall = () =>
      TestEntity.build(ConditionCheck)
        .key({ email: 'x', sort: 'y' })
        .condition({
          // @ts-expect-error
          extra: true
        })
        .params()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'actions.invalidCondition' }))
  })
})
