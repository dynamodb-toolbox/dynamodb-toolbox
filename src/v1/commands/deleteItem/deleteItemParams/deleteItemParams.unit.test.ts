import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

import { TableV2, EntityV2, item, string, DynamoDBToolboxError } from 'v1'

import { deleteItemParams } from './deleteItemParams'

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
  item: item({
    email: string().key().savedAs('pk'),
    sort: string().key().savedAs('sk'),
    test: string()
  }),
  table: TestTable
} as const)

const TestEntity2 = new EntityV2({
  name: 'TestEntity',
  item: item({
    pk: string().key(),
    sk: string().key(),
    test: string()
  }),
  table: TestTable
})

describe('delete', () => {
  it('deletes the key from inputs', async () => {
    const { TableName, Key } = deleteItemParams(TestEntity, {
      email: 'test-pk',
      sort: 'test-sk'
    })

    expect(TableName).toBe('test-table')
    expect(Key).toStrictEqual({ pk: 'test-pk', sk: 'test-sk' })
  })

  it('filters out extra data', async () => {
    const { Key } = deleteItemParams(TestEntity, {
      email: 'test-pk',
      sort: 'test-sk',
      // @ts-expect-error
      test: 'test'
    })

    expect(Key).not.toHaveProperty('test')
  })

  it('fails with undefined input', () => {
    expect(
      () =>
        deleteItemParams(
          TestEntity,
          // @ts-expect-error
          {}
        )
      // TODO: Nice error message
    ).toThrow('')
  })

  it('fails when missing the sortKey', () => {
    expect(
      () =>
        deleteItemParams(
          TestEntity,
          // @ts-expect-error
          { pk: 'test-pk' }
        )
      // TODO: Nice error message
    ).toThrow('')
  })

  it('fails when missing partitionKey (no alias)', () => {
    expect(
      () =>
        deleteItemParams(
          TestEntity2,
          // @ts-expect-error
          {}
        )
      // TODO: Nice error message
    ).toThrow('')
  })

  it('fails when missing the sortKey (no alias)', () => {
    expect(
      () =>
        deleteItemParams(
          TestEntity2,
          // @ts-expect-error
          { pk: 'test-pk' }
        )
      // TODO: Nice error message
    ).toThrow('')
  })

  it('sets capacity options', () => {
    const { ReturnConsumedCapacity } = deleteItemParams(
      TestEntity,
      { email: 'x', sort: 'y' },
      { capacity: 'NONE' }
    )

    expect(ReturnConsumedCapacity).toBe('NONE')
  })

  it('fails on invalid capacity option', () => {
    const invalidCall = () =>
      deleteItemParams(
        TestEntity,
        { email: 'x', sort: 'y' },
        // @ts-expect-error
        { capacity: 'test' }
      )

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'invalidCommandCapacityOption' }))
  })

  it('sets metrics options', () => {
    const { ReturnItemCollectionMetrics } = deleteItemParams(
      TestEntity,
      { email: 'x', sort: 'y' },
      { metrics: 'SIZE' }
    )

    expect(ReturnItemCollectionMetrics).toBe('SIZE')
  })

  it('fails on invalid metrics option', () => {
    const invalidCall = () =>
      deleteItemParams(
        TestEntity,
        { email: 'x', sort: 'y' },
        {
          // @ts-expect-error
          metrics: 'test'
        }
      )

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'invalidCommandMetricsOption' }))
  })

  it('sets returnValues options', () => {
    const { ReturnValues } = deleteItemParams(
      TestEntity,
      { email: 'x', sort: 'y' },
      { returnValues: 'ALL_OLD' }
    )

    expect(ReturnValues).toBe('ALL_OLD')
  })

  it('fails on invalid returnValues option', () => {
    const invalidCall = () =>
      deleteItemParams(
        TestEntity,
        { email: 'x', sort: 'y' },
        {
          // @ts-expect-error
          returnValues: 'test'
        }
      )

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'invalidCommandReturnValuesOption' })
    )
  })

  it('fails on extra options', () => {
    const invalidCall = () =>
      deleteItemParams(
        TestEntity,
        { email: 'x', sort: 'y' },
        {
          // @ts-expect-error
          extra: true
        }
      )

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'unknownCommandOption' }))
  })

  it('sets condition', () => {
    const {
      ExpressionAttributeNames,
      ExpressionAttributeValues,
      ConditionExpression
    } = deleteItemParams(
      TestEntity,
      { email: 'x', sort: 'y' },
      { condition: { attr: 'email', gt: 'test' } }
    )

    // TODO: Implement
    expect(ExpressionAttributeNames).not.toEqual({ '#attr1': 'pk' })
    expect(ExpressionAttributeValues).not.toEqual({ ':attr1': 'test' })
    expect(ConditionExpression).not.toBe('#attr1 > :attr1')
  })

  // TODO Enable extra parameters
  // it('handles extra parameters', () => {
  //   let { TableName, Key, ReturnConsumedCapacity } = TestEntity.deleteParams(
  //     { email: 'x', sort: 'y' },
  //     {},
  //     { ReturnConsumedCapacity: 'NONE' }
  //   )
  //   expect(TableName).toBe('test-table')
  //   expect(Key).toEqual({ pk: 'x', sk: 'y' })
  //   expect(ReturnConsumedCapacity).toBe('NONE')
  // })

  // it('handles invalid parameter input', () => {
  //   let { TableName, Key } = TestEntity.deleteParams(
  //     { email: 'x', sort: 'y' },
  //     {},
  //     // @ts-expect-error
  //     'string'
  //   )
  //   expect(TableName).toBe('test-table')
  //   expect(Key).toEqual({ pk: 'x', sk: 'y' })
  // })

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