import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

import {
  TableV2,
  EntityV2,
  schema,
  string,
  DynamoDBToolboxError,
  DeleteItemCommand,
  prefix
} from 'v1'

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

describe('delete', () => {
  it('deletes the key from inputs', async () => {
    const { TableName, Key } = TestEntity.build(DeleteItemCommand)
      .key({ email: 'test-pk', sort: 'test-sk' })
      .params()

    expect(TableName).toBe('test-table')
    expect(Key).toStrictEqual({ pk: 'test-pk', sk: 'test-sk' })
  })

  it('filters out extra data', async () => {
    const { Key } = TestEntity.build(DeleteItemCommand)
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
    expect(() =>
      TestEntity.build(DeleteItemCommand)
        .key(
          // @ts-expect-error
          {}
        )
        .params()
    ).toThrow('Attribute email is required')
  })

  it('fails when missing the sortKey', () => {
    expect(() =>
      TestEntity.build(DeleteItemCommand)
        .key(
          // @ts-expect-error
          { pk: 'test-pk' }
        )
        .params()
    ).toThrow('Attribute email is required')
  })

  it('fails when missing partitionKey (no alias)', () => {
    expect(() =>
      TestEntity2.build(DeleteItemCommand)
        .key(
          // @ts-expect-error
          {}
        )
        .params()
    ).toThrow('Attribute pk is required')
  })

  it('fails when missing the sortKey (no alias)', () => {
    expect(() =>
      TestEntity2.build(DeleteItemCommand)
        .key(
          // @ts-expect-error
          { pk: 'test-pk' }
        )
        .params()
    ).toThrow('Attribute sk is required')
  })

  it('sets capacity options', () => {
    const { ReturnConsumedCapacity } = TestEntity.build(DeleteItemCommand)
      .key({ email: 'x', sort: 'y' })
      .options({ capacity: 'NONE' })
      .params()

    expect(ReturnConsumedCapacity).toBe('NONE')
  })

  it('fails on invalid capacity option', () => {
    const invalidCall = () =>
      TestEntity.build(DeleteItemCommand)
        .key({ email: 'x', sort: 'y' })
        .options(
          // @ts-expect-error
          { capacity: 'test' }
        )
        .params()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'operations.invalidCapacityOption' })
    )
  })

  it('sets metrics options', () => {
    const { ReturnItemCollectionMetrics } = TestEntity.build(DeleteItemCommand)
      .key({ email: 'x', sort: 'y' })
      .options({ metrics: 'SIZE' })
      .params()

    expect(ReturnItemCollectionMetrics).toBe('SIZE')
  })

  it('fails on invalid metrics option', () => {
    const invalidCall = () =>
      TestEntity.build(DeleteItemCommand)
        .key({ email: 'x', sort: 'y' })
        .options({
          // @ts-expect-error
          metrics: 'test'
        })
        .params()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'operations.invalidMetricsOption' })
    )
  })

  it('sets returnValues options', () => {
    const { ReturnValues } = TestEntity.build(DeleteItemCommand)
      .key({ email: 'x', sort: 'y' })
      .options({ returnValues: 'ALL_OLD' })
      .params()

    expect(ReturnValues).toBe('ALL_OLD')
  })

  it('fails on invalid returnValues option', () => {
    const invalidCall = () =>
      TestEntity.build(DeleteItemCommand)
        .key({ email: 'x', sort: 'y' })
        .options({
          // @ts-expect-error
          returnValues: 'test'
        })
        .params()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'operations.invalidReturnValuesOption' })
    )
  })

  it('fails on extra options', () => {
    const invalidCall = () =>
      TestEntity.build(DeleteItemCommand)
        .key({ email: 'x', sort: 'y' })
        .options({
          // @ts-expect-error
          extra: true
        })
        .params()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'operations.unknownOption' }))
  })

  it('sets condition', () => {
    const {
      ExpressionAttributeNames,
      ExpressionAttributeValues,
      ConditionExpression
    } = TestEntity.build(DeleteItemCommand)
      .key({ email: 'x', sort: 'y' })
      .options({ condition: { attr: 'email', gt: 'test' } })
      .params()

    expect(ExpressionAttributeNames).toEqual({ '#c_1': 'pk' })
    expect(ExpressionAttributeValues).toEqual({ ':c_1': 'test' })
    expect(ConditionExpression).toBe('#c_1 > :c_1')
  })

  it('missing key', () => {
    const invalidCall = () => TestEntity.build(DeleteItemCommand).params()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'operations.incompleteCommand' }))
  })

  it('transformed key', () => {
    const TestEntity3 = new EntityV2({
      name: 'TestEntity',
      schema: schema({
        email: string().key().savedAs('pk').transform(prefix('EMAIL')),
        sort: string().key().savedAs('sk')
      }),
      table: TestTable
    })

    const { Key, ExpressionAttributeNames, ExpressionAttributeValues } = TestEntity3.build(
      DeleteItemCommand
    )
      .key({ email: 'foo@bar.mail', sort: 'y' })
      .options({ condition: { attr: 'email', gt: 'test', transform: false } })
      .params()

    expect(Key).toMatchObject({ pk: 'EMAIL#foo@bar.mail' })
    expect(ExpressionAttributeNames).toEqual({ '#c_1': 'pk' })
    expect(ExpressionAttributeValues).toEqual({ ':c_1': 'test' })

    const { ExpressionAttributeValues: ExpressionAttributeValues2 } = TestEntity3.build(
      DeleteItemCommand
    )
      .key({ email: 'foo@bar.mail', sort: 'y' })
      .options({ condition: { attr: 'email', gt: 'test' } })
      .params()

    expect(ExpressionAttributeValues2).toEqual({ ':c_1': 'EMAIL#test' })
  })

  // TODO Create deleteBatch method and move tests there
  // it('formats a batch delete response', async () => {
  //   let result = TestEntity.deleteBatch({ email: 'x', sort: 'y' })
  //   expect(result).toEqual({ 'test-table': { DeleteRequest: { Key: { pk: 'x', sk: 'y' } } } })
  // })

  // it('fails if no value is provided to the deleteBatch method', () => {
  //   // @ts-expect-error
  //   expect(() => TestEntity.deleteBatch()).toThrow(`'pk' or 'email' is required`)
  // })
})
