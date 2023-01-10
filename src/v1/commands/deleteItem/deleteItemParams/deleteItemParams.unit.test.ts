import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { unmarshall } from '@aws-sdk/util-dynamodb'

import { TableV2, EntityV2, item, string } from 'v1'

import { deleteItemParams } from './deleteItemParams'

const dynamoDbClient = new DynamoDBClient({})

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
  dynamoDbClient
})

const TestEntity = new EntityV2({
  name: 'TestEntity',
  item: item({
    email: string().key().required('always').savedAs('pk'),
    sort: string().key().required('always').savedAs('sk'),
    test: string()
  }),
  table: TestTable
} as const)

const TestEntity2 = new EntityV2({
  name: 'TestEntity',
  item: item({
    pk: string().key().required('always'),
    sk: string().key().required('always'),
    test: string()
  }),
  table: TestTable
})

describe('delete', () => {
  it('deletes the key from inputs', async () => {
    const { TableName, Key = {} } = deleteItemParams(TestEntity, {
      email: 'test-pk',
      sort: 'test-sk'
    })

    expect(TableName).toBe('test-table')
    expect(unmarshall(Key)).toStrictEqual({ pk: 'test-pk', sk: 'test-sk' })
  })

  it('filters out extra data', async () => {
    let { Key = {} } = deleteItemParams(TestEntity, {
      email: 'test-pk',
      sort: 'test-sk',
      // @ts-expect-error
      test: 'test'
    })

    expect(unmarshall(Key)).not.toHaveProperty('test')
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

  // TODO Add options in putItemParams
  // it('fails on extra options', () => {
  //   expect(() =>
  //     TestEntity.deleteParams(
  //       { email: 'x', sort: 'y' },
  //       // @ts-expect-error
  //       { execute: false, parse: false, extra: true }
  //     )
  //   ).toThrow('Invalid delete options: extra')
  // })

  // it('fails on invalid capacity option', () => {
  //   expect(() =>
  //     TestEntity.deleteParams(
  //       { email: 'x', sort: 'y' },
  //       // 💥 TODO: Improve capacity type
  //       { capacity: 'test' }
  //     )
  //   ).toThrow(`'capacity' must be one of 'NONE','TOTAL', OR 'INDEXES'`)
  // })

  // it('fails on invalid metrics option', () => {
  //   expect(() =>
  //     TestEntity.deleteParams(
  //       { email: 'x', sort: 'y' },
  //       // 💥 TODO: Improve capacity type
  //       { metrics: 'test' }
  //     )
  //   ).toThrow(`'metrics' must be one of 'NONE' OR 'SIZE'`)
  // })

  // it('fails on invalid returnValues option', () => {
  //   expect(() =>
  //     TestEntity.deleteParams(
  //       { email: 'x', sort: 'y' },
  //       // @ts-expect-error
  //       { returnValues: 'test' }
  //     )
  //   ).toThrow(`'returnValues' must be one of 'NONE' OR 'ALL_OLD'`)
  // })

  // it('sets capacity options', () => {
  //   let { TableName, Key, ReturnConsumedCapacity } = TestEntity.deleteParams(
  //     { email: 'x', sort: 'y' },
  //     { capacity: 'none' }
  //   )
  //   expect(TableName).toBe('test-table')
  //   expect(Key).toEqual({ pk: 'x', sk: 'y' })
  //   expect(ReturnConsumedCapacity).toBe('NONE')
  // })

  // it('sets metrics options', () => {
  //   let { TableName, Key, ReturnItemCollectionMetrics } = TestEntity.deleteParams(
  //     { email: 'x', sort: 'y' },
  //     { metrics: 'size' }
  //   )
  //   expect(TableName).toBe('test-table')
  //   expect(Key).toEqual({ pk: 'x', sk: 'y' })
  //   expect(ReturnItemCollectionMetrics).toBe('SIZE')
  // })

  // it('sets returnValues options', () => {
  //   let { TableName, Key, ReturnValues } = TestEntity.deleteParams(
  //     { email: 'x', sort: 'y' },
  //     { returnValues: 'ALL_OLD' }
  //   )
  //   expect(TableName).toBe('test-table')
  //   expect(Key).toEqual({ pk: 'x', sk: 'y' })
  //   expect(ReturnValues).toBe('ALL_OLD')
  // })

  // TODO Enable typed conditions
  // it('sets conditions', () => {
  //   let result = TestEntity.deleteParams(
  //     { email: 'x', sort: 'y' },
  //     { conditions: { attr: 'email', gt: 'test' } }
  //   )

  //   expect(result).toEqual({
  //     TableName: 'test-table',
  //     Key: { pk: 'x', sk: 'y' },
  //     ExpressionAttributeNames: { '#attr1': 'pk' },
  //     ExpressionAttributeValues: { ':attr1': 'test' },
  //     ConditionExpression: '#attr1 > :attr1'
  //   })
  // })

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
