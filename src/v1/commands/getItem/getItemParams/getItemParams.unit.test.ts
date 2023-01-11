import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

import { TableV2, EntityV2, item, string } from 'v1'

import { getItemParams } from './getItemParams'

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
    email: string().required('always').key().savedAs('pk'),
    sort: string().required('always').key().savedAs('sk'),
    test: string()
  }),
  table: TestTable
} as const)

const TestTable2 = new TableV2({
  name: 'test-table',
  partitionKey: { type: 'string', name: 'pk' },
  sortKey: { type: 'string', name: 'sk' },
  documentClient
})

const TestEntity2 = new EntityV2({
  name: 'TestEntity',
  item: item({
    pk: string().required('always').key(),
    sk: string().required('always').key(),
    test: string()
  }),
  table: TestTable2
})

describe('get', () => {
  it('gets the key from inputs', async () => {
    const { TableName, Key } = getItemParams(TestEntity, { email: 'test-pk', sort: 'test-sk' })

    expect(TableName).toBe('test-table')
    expect(Key).toStrictEqual({ pk: 'test-pk', sk: 'test-sk' })
  })

  it('filters out extra data', async () => {
    let { Key } = getItemParams(TestEntity, {
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
        getItemParams(
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
        getItemParams(
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
        getItemParams(
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
        getItemParams(
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
  //     TestEntity.getParams(
  //       { email: 'x', sort: 'y' },
  //       // @ts-expect-error
  //       { execute: false, parse: false, extra: true }
  //     )
  //   ).toThrow('Invalid get options: extra')
  // })

  // it('fails on invalid consistent option', () => {
  //   // @ts-expect-error
  //   expect(() => TestEntity.getParams({ email: 'x', sort: 'y' }, { consistent: 'true' })).toThrow(
  //     `'consistent' requires a boolean`
  //   )
  // })

  // it('fails on invalid capacity option', () => {
  //   // 💥 TODO: Improve capacity type
  //   expect(() => TestEntity.getParams({ email: 'x', sort: 'y' }, { capacity: 'test' })).toThrow(
  //     `'capacity' must be one of 'NONE','TOTAL', OR 'INDEXES'`
  //   )
  // })

  // it('sets consistent and capacity options', () => {
  //   let { TableName, Key, ConsistentRead, ReturnConsumedCapacity } = TestEntity.getParams(
  //     { email: 'x', sort: 'y' },
  //     { consistent: true, capacity: 'none' }
  //   )
  //   expect(TableName).toBe('test-table')
  //   expect(Key).toEqual({ pk: 'x', sk: 'y' })
  //   expect(ConsistentRead).toBe(true)
  //   expect(ReturnConsumedCapacity).toBe('NONE')
  // })

  // TODO Handle ProjectionExpression
  // it('parses attribute projections', () => {
  //   let { TableName, Key, ExpressionAttributeNames, ProjectionExpression } = TestEntity.getParams(
  //     { email: 'x', sort: 'y' },
  //     { attributes: ['email'] }
  //   )
  //   expect(TableName).toBe('test-table')
  //   expect(Key).toEqual({ pk: 'x', sk: 'y' })
  //   expect(ExpressionAttributeNames).toEqual({ '#proj1': 'pk' })
  //   expect(ProjectionExpression).toBe('#proj1')
  // })

  // TODO Enable extra parameters
  // it('handles extra parameters', () => {
  //   let { TableName, Key, ConsistentRead } = TestEntity.getParams(
  //     { email: 'x', sort: 'y' },
  //     {},
  //     { ConsistentRead: true }
  //   )
  //   expect(TableName).toBe('test-table')
  //   expect(Key).toEqual({ pk: 'x', sk: 'y' })
  //   expect(ConsistentRead).toBe(true)
  // })

  // TODO Create getBatch method and move tests there
  // it('formats a batch get response', async () => {
  //   let { Table, Key } = TestEntity.getBatch({ email: 'a', sort: 'b' })
  //   expect(Table.name).toBe('test-table')
  //   expect(Key).toEqual({ pk: 'a', sk: 'b' })
  // })

  // it('fails if no value is provided to the getBatch method', () => {
  //   // @ts-expect-error
  //   expect(() => TestEntity.getBatch()).toThrow(`'pk' or 'email' is required`)
  // })
})
