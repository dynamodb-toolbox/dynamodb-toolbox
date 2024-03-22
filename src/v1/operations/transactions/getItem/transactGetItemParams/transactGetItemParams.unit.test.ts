import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

import { TableV2, EntityV2, schema, string, DynamoDBToolboxError } from 'v1'

import { GetItemTransaction } from '../operation'

const dynamoDbClient = new DynamoDBClient({})

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
    test: string()
  }),
  table: TestTable
})

const TestEntity2 = new EntityV2({
  name: 'TestEntity',
  schema: schema({
    pk: string().key(),
    sk: string().key(),
    test: string()
  }),
  table: TestTable
})

describe('Get transaction', () => {
  it('Gets the key from inputs', async () => {
    const { TableName, Key } = TestEntity.build(GetItemTransaction)
      .key({ email: 'test-pk', sort: 'test-sk' })
      .params()

    expect(TableName).toBe('test-table')
    expect(Key).toStrictEqual({ pk: 'test-pk', sk: 'test-sk' })
  })

  it('filters out extra data', async () => {
    const { Key } = TestEntity.build(GetItemTransaction)
      .key({
        email: 'test-pk',
        sort: 'test-sk',
        // @ts-expect-error
        test: 'test'
      })
      .params()

    expect(Key).not.toHaveProperty('test')
  })

  it('fails with undefined input', () => {
    expect(
      () =>
        TestEntity.build(GetItemTransaction)
          .key(
            // @ts-expect-error
            {}
          )
          .params()
      // eslint-disable-next-line quotes
    ).toThrow("Attribute 'email' is required")
  })

  it('fails when missing the sortKey', () => {
    expect(
      () =>
        TestEntity.build(GetItemTransaction)
          .key(
            // @ts-expect-error
            { pk: 'test-pk' }
          )
          .params()
      // eslint-disable-next-line quotes
    ).toThrow("Attribute 'email' is required")
  })

  it('fails when missing partitionKey (no alias)', () => {
    expect(
      () =>
        TestEntity2.build(GetItemTransaction)
          .key(
            // @ts-expect-error
            {}
          )
          .params()
      // eslint-disable-next-line quotes
    ).toThrow("Attribute 'pk' is required")
  })

  it('fails when missing the sortKey (no alias)', () => {
    expect(
      () =>
        TestEntity2.build(GetItemTransaction)
          .key(
            // @ts-expect-error
            { pk: 'test-pk' }
          )
          .params()
      // eslint-disable-next-line quotes
    ).toThrow("Attribute 'sk' is required")
  })

  // Options
  it('fails on extra options', () => {
    const invalidCall = () =>
      TestEntity.build(GetItemTransaction)
        .key({ email: 'x', sort: 'y' })
        .options({
          // @ts-expect-error
          extra: true
        })
        .params()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'operations.unknownOption' }))
  })

  it('sets projection', () => {
    const { ExpressionAttributeNames, ProjectionExpression } = TestEntity.build(GetItemTransaction)
      .key({ email: 'x', sort: 'y' })
      .options({ attributes: ['test', 'sort'] })
      .params()

    expect(ExpressionAttributeNames).toEqual({ '#p_1': 'test', '#p_2': 'sk' })
    expect(ProjectionExpression).toBe('#p_1, #p_2')
  })

  it('missing key', () => {
    const invalidCall = () => TestEntity.build(GetItemTransaction).params()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'operations.incompleteOperation' }))
  })
})
