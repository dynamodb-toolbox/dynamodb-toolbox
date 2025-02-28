import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

import { DynamoDBToolboxError, Entity, GetTransaction, Table, item, string } from '~/index.js'

const dynamoDbClient = new DynamoDBClient({})

const documentClient = DynamoDBDocumentClient.from(dynamoDbClient)

const TestTable = new Table({
  name: 'test-table',
  partitionKey: { type: 'string', name: 'pk' },
  sortKey: { type: 'string', name: 'sk' },
  documentClient
})

const TestEntity = new Entity({
  name: 'TestEntity',
  schema: item({
    email: string().key().savedAs('pk'),
    sort: string().key().savedAs('sk'),
    test: string()
  }),
  table: TestTable
})

const TestEntity2 = new Entity({
  name: 'TestEntity',
  schema: item({
    pk: string().key(),
    sk: string().key(),
    test: string()
  }),
  table: TestTable
})

describe('Get transaction', () => {
  test('Gets the key from inputs', async () => {
    const {
      Get: { TableName, Key }
    } = TestEntity.build(GetTransaction).key({ email: 'test-pk', sort: 'test-sk' }).params()

    expect(TableName).toBe('test-table')
    expect(Key).toStrictEqual({ pk: 'test-pk', sk: 'test-sk' })
  })

  test('filters out extra data', async () => {
    const {
      Get: { Key }
    } = TestEntity.build(GetTransaction)
      .key({
        email: 'test-pk',
        sort: 'test-sk',
        // @ts-expect-error
        test: 'test'
      })
      .params()

    expect(Key).not.toHaveProperty('test')
  })

  test('fails with undefined input', () => {
    expect(
      () =>
        TestEntity.build(GetTransaction)
          .key(
            // @ts-expect-error
            {}
          )
          .params()
      // eslint-disable-next-line quotes
    ).toThrow("Attribute 'email' is required")
  })

  test('fails when missing the sortKey', () => {
    expect(
      () =>
        TestEntity.build(GetTransaction)
          .key(
            // @ts-expect-error
            { pk: 'test-pk' }
          )
          .params()
      // eslint-disable-next-line quotes
    ).toThrow("Attribute 'email' is required")
  })

  test('fails when missing partitionKey (no alias)', () => {
    expect(
      () =>
        TestEntity2.build(GetTransaction)
          .key(
            // @ts-expect-error
            {}
          )
          .params()
      // eslint-disable-next-line quotes
    ).toThrow("Attribute 'pk' is required")
  })

  test('fails when missing the sortKey (no alias)', () => {
    expect(
      () =>
        TestEntity2.build(GetTransaction)
          .key(
            // @ts-expect-error
            { pk: 'test-pk' }
          )
          .params()
      // eslint-disable-next-line quotes
    ).toThrow("Attribute 'sk' is required")
  })

  // Options
  test('overrides tableName', () => {
    const {
      Get: { TableName }
    } = TestEntity.build(GetTransaction)
      .key({ email: 'x', sort: 'y' })
      .options({ tableName: 'tableName' })
      .params()

    expect(TableName).toBe('tableName')
  })

  test('fails on invalid tableName option', () => {
    const invalidCall = () =>
      TestEntity.build(GetTransaction)
        .key({ email: 'x', sort: 'y' })
        .options({
          // @ts-expect-error
          tableName: 42
        })
        .params()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'options.invalidTableNameOption' }))
  })

  test('fails on extra options', () => {
    const invalidCall = () =>
      TestEntity.build(GetTransaction)
        .key({ email: 'x', sort: 'y' })
        .options({
          // @ts-expect-error
          extra: true
        })
        .params()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'options.unknownOption' }))
  })

  test('sets projection', () => {
    const {
      Get: { ExpressionAttributeNames, ProjectionExpression }
    } = TestEntity.build(GetTransaction)
      .key({ email: 'x', sort: 'y' })
      .options({ attributes: ['test', 'sort'] })
      .params()

    expect(ExpressionAttributeNames).toEqual({ '#p_1': 'test', '#p_2': 'sk' })
    expect(ProjectionExpression).toBe('#p_1, #p_2')
  })

  test('missing key', () => {
    const invalidCall = () => TestEntity.build(GetTransaction).params()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'actions.incompleteAction' }))
  })
})
