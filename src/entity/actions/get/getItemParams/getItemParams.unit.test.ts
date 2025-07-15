import type { A } from 'ts-toolbelt'

import {
  DynamoDBToolboxError,
  Entity,
  GetItemCommand,
  Table,
  item,
  prefix,
  string
} from '~/index.js'

const TestTable = new Table({
  name: 'test-table',
  partitionKey: {
    type: 'string',
    name: 'pk'
  },
  sortKey: {
    type: 'string',
    name: 'sk'
  }
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

const TestTable2 = new Table({
  name: 'test-table',
  partitionKey: { type: 'string', name: 'pk' },
  sortKey: { type: 'string', name: 'sk' }
})

const TestEntity2 = new Entity({
  name: 'TestEntity',
  schema: item({
    pk: string().key(),
    sk: string().key(),
    test: string()
  }),
  table: TestTable2
})

describe('get', () => {
  test('gets the key from inputs', async () => {
    const { TableName, Key } = TestEntity.build(GetItemCommand)
      .key({
        email: 'test-pk',
        sort: 'test-sk'
      })
      .params()

    expect(TableName).toBe('test-table')
    expect(Key).toStrictEqual({ pk: 'test-pk', sk: 'test-sk' })
  })

  test('filters out extra data', async () => {
    const { Key } = TestEntity.build(GetItemCommand)
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
    expect(() =>
      TestEntity.build(GetItemCommand)
        .key(
          // @ts-expect-error
          {}
        )
        .params()
    ).toThrow(DynamoDBToolboxError)
  })

  test('fails when missing the sortKey', () => {
    expect(() =>
      TestEntity.build(GetItemCommand)
        .key(
          // @ts-expect-error
          { pk: 'test-pk' }
        )
        .params()
    ).toThrow(DynamoDBToolboxError)
  })

  test('fails when missing partitionKey (no alias)', () => {
    expect(() =>
      TestEntity2.build(GetItemCommand)
        .key(
          // @ts-expect-error
          {}
        )
        .params()
    ).toThrow(DynamoDBToolboxError)
  })

  test('fails when missing the sortKey (no alias)', () => {
    expect(() =>
      TestEntity2.build(GetItemCommand)
        .key(
          // @ts-expect-error
          { pk: 'test-pk' }
        )
        .params()
    ).toThrow(DynamoDBToolboxError)
  })

  // --- OPTIONS ---
  test('sets capacity options', () => {
    const { ReturnConsumedCapacity } = TestEntity.build(GetItemCommand)
      .key({ email: 'x', sort: 'y' })
      .options({ capacity: 'NONE' })
      .params()

    expect(ReturnConsumedCapacity).toBe('NONE')
  })

  test('fails on invalid capacity option', () => {
    const invalidCall = () =>
      TestEntity.build(GetItemCommand)
        .key({ email: 'x', sort: 'y' })
        .options({
          // @ts-expect-error
          capacity: 'test'
        })
        .params()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'options.invalidCapacityOption' }))
  })

  test('sets consistent option', () => {
    const { ConsistentRead } = TestEntity.build(GetItemCommand)
      .key({ email: 'x', sort: 'y' })
      .options({ consistent: true })
      .params()

    expect(ConsistentRead).toBe(true)
  })

  test('fails on invalid consistent option', () => {
    const invalidCall = () =>
      TestEntity.build(GetItemCommand)
        .key({ email: 'x', sort: 'y' })
        .options({
          // @ts-expect-error
          consistent: 'true'
        })
        .params()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'options.invalidConsistentOption' })
    )
  })

  test('builds command w. options callback', () => {
    const { ReturnConsumedCapacity, ConsistentRead } = TestEntity.build(GetItemCommand)
      .key({ email: 'x', sort: 'y' })
      .options({ capacity: 'NONE' })
      .options(prevOptions => {
        const assertOptions: A.Equals<typeof prevOptions, { capacity: 'NONE' }> = 1
        assertOptions

        return { ...prevOptions, consistent: true }
      })
      .params()

    expect(ReturnConsumedCapacity).toBe('NONE')
    expect(ConsistentRead).toBe(true)
  })

  test('overrides tableName', () => {
    const { TableName } = TestEntity.build(GetItemCommand)
      .key({ email: 'x', sort: 'y' })
      .options({ tableName: 'tableName' })
      .params()

    expect(TableName).toBe('tableName')
  })

  test('fails on invalid tableName option', () => {
    const invalidCall = () =>
      TestEntity.build(GetItemCommand)
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
      TestEntity.build(GetItemCommand)
        .key({ email: 'x', sort: 'y' })
        .options({
          // @ts-expect-error
          extra: true
        })
        .params()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'options.unknownOption' }))
  })

  test('parses attribute projections', () => {
    const { ExpressionAttributeNames, ProjectionExpression } = TestEntity.build(GetItemCommand)
      .key({ email: 'x', sort: 'y' })
      .options({ attributes: ['email'] })
      .params()

    expect(ExpressionAttributeNames).toEqual({ '#p_1': 'pk' })
    expect(ProjectionExpression).toBe('#p_1')
  })

  test('missing key', () => {
    const invalidCall = () => TestEntity.build(GetItemCommand).params()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'actions.incompleteAction' }))
  })

  test('transformed key', () => {
    const TestEntity3 = new Entity({
      name: 'TestEntity',
      schema: item({
        email: string().key().savedAs('pk').transform(prefix('EMAIL')),
        sort: string().key().savedAs('sk')
      }),
      table: TestTable
    })

    const { Key } = TestEntity3.build(GetItemCommand)
      .key({ email: 'foo@bar.mail', sort: 'y' })
      .params()

    expect(Key).toMatchObject({ pk: 'EMAIL#foo@bar.mail' })
  })
})
