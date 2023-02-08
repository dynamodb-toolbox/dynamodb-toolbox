import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

import { TableV2, EntityV2, item, string, DynamoDBToolboxError } from 'v1'

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
    const { Key } = getItemParams(TestEntity, {
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

  // Options
  it('sets capacity options', () => {
    const { ReturnConsumedCapacity } = getItemParams(
      TestEntity,
      { email: 'x', sort: 'y' },
      { capacity: 'NONE' }
    )

    expect(ReturnConsumedCapacity).toBe('NONE')
  })

  it('fails on invalid capacity option', () => {
    const invalidCall = () =>
      getItemParams(
        TestEntity,
        { email: 'x', sort: 'y' },
        {
          // @ts-expect-error
          capacity: 'test'
        }
      )

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'invalidCapacityCommandOption' }))
  })

  it('sets consistent and capacity options', () => {
    const { ConsistentRead } = getItemParams(
      TestEntity,
      { email: 'x', sort: 'y' },
      { consistent: true }
    )

    expect(ConsistentRead).toBe(true)
  })

  it('fails on invalid consistent option', () => {
    const invalidCall = () =>
      getItemParams(
        TestEntity,
        { email: 'x', sort: 'y' },
        {
          // @ts-expect-error
          consistent: 'true'
        }
      )

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'invalidGetItemCommandConsistentOption' })
    )
  })

  it('fails on extra options', () => {
    const invalidCall = () =>
      getItemParams(
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
