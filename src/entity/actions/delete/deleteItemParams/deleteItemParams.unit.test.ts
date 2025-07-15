import type { A } from 'ts-toolbelt'

import {
  DeleteItemCommand,
  DynamoDBToolboxError,
  Entity,
  Table,
  item,
  prefix,
  string
} from '~/index.js'

const TestTable = new Table({
  name: 'test-table',
  partitionKey: { type: 'string', name: 'pk' },
  sortKey: { type: 'string', name: 'sk' }
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

describe('delete', () => {
  test('deletes the key from inputs', async () => {
    const { TableName, Key } = TestEntity.build(DeleteItemCommand)
      .key({ email: 'test-pk', sort: 'test-sk' })
      .params()

    expect(TableName).toBe('test-table')
    expect(Key).toStrictEqual({ pk: 'test-pk', sk: 'test-sk' })
  })

  test('filters out extra data', async () => {
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

  test('fails with undefined input', () => {
    expect(() =>
      TestEntity.build(DeleteItemCommand)
        .key(
          // @ts-expect-error
          {}
        )
        .params()
    ).toThrow(DynamoDBToolboxError)
  })

  test('fails when missing the sortKey', () => {
    expect(() =>
      TestEntity.build(DeleteItemCommand)
        .key(
          // @ts-expect-error
          { pk: 'test-pk' }
        )
        .params()
    ).toThrow(DynamoDBToolboxError)
  })

  test('fails when missing partitionKey (no alias)', () => {
    expect(() =>
      TestEntity2.build(DeleteItemCommand)
        .key(
          // @ts-expect-error
          {}
        )
        .params()
    ).toThrow(DynamoDBToolboxError)
  })

  test('fails when missing the sortKey (no alias)', () => {
    expect(() =>
      TestEntity2.build(DeleteItemCommand)
        .key(
          // @ts-expect-error
          { pk: 'test-pk' }
        )
        .params()
    ).toThrow(DynamoDBToolboxError)
  })

  test('sets capacity options', () => {
    const { ReturnConsumedCapacity } = TestEntity.build(DeleteItemCommand)
      .key({ email: 'x', sort: 'y' })
      .options({ capacity: 'NONE' })
      .params()

    expect(ReturnConsumedCapacity).toBe('NONE')
  })

  test('fails on invalid capacity option', () => {
    const invalidCall = () =>
      TestEntity.build(DeleteItemCommand)
        .key({ email: 'x', sort: 'y' })
        .options(
          // @ts-expect-error
          { capacity: 'test' }
        )
        .params()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'options.invalidCapacityOption' }))
  })

  test('sets metrics options', () => {
    const { ReturnItemCollectionMetrics } = TestEntity.build(DeleteItemCommand)
      .key({ email: 'x', sort: 'y' })
      .options({ metrics: 'SIZE' })
      .params()

    expect(ReturnItemCollectionMetrics).toBe('SIZE')
  })

  test('fails on invalid metrics option', () => {
    const invalidCall = () =>
      TestEntity.build(DeleteItemCommand)
        .key({ email: 'x', sort: 'y' })
        .options({
          // @ts-expect-error
          metrics: 'test'
        })
        .params()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'options.invalidMetricsOption' }))
  })

  test('builds command w. options callback', () => {
    const { ReturnConsumedCapacity, ReturnItemCollectionMetrics } = TestEntity.build(
      DeleteItemCommand
    )
      .key({ email: 'x', sort: 'y' })
      .options({ capacity: 'NONE' })
      .options(prevOptions => {
        const assertOptions: A.Equals<typeof prevOptions, { capacity: 'NONE' }> = 1
        assertOptions

        return { ...prevOptions, metrics: 'SIZE' }
      })
      .params()

    expect(ReturnConsumedCapacity).toBe('NONE')
    expect(ReturnItemCollectionMetrics).toBe('SIZE')
  })

  test('sets returnValues options', () => {
    const { ReturnValues } = TestEntity.build(DeleteItemCommand)
      .key({ email: 'x', sort: 'y' })
      .options({ returnValues: 'ALL_OLD' })
      .params()

    expect(ReturnValues).toBe('ALL_OLD')
  })

  test('fails on invalid returnValues option', () => {
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
      expect.objectContaining({ code: 'options.invalidReturnValuesOption' })
    )
  })

  test('sets returnValuesOnConditionFalse options', () => {
    const { ReturnValuesOnConditionCheckFailure } = TestEntity.build(DeleteItemCommand)
      .key({ email: 'x', sort: 'y' })
      .options({ returnValuesOnConditionFalse: 'ALL_OLD' })
      .params()

    expect(ReturnValuesOnConditionCheckFailure).toBe('ALL_OLD')
  })

  test('fails on invalid returnValuesOnConditionFalse option', () => {
    const invalidCall = () =>
      TestEntity.build(DeleteItemCommand)
        .key({ email: 'x', sort: 'y' })
        .options({
          // @ts-expect-error
          returnValuesOnConditionFalse: 'ALL_NEW'
        })
        .params()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'options.invalidReturnValuesOnConditionFalseOption' })
    )
  })

  test('overrides tableName', () => {
    const { TableName } = TestEntity.build(DeleteItemCommand)
      .key({ email: 'x', sort: 'y' })
      .options({ tableName: 'tableName' })
      .params()

    expect(TableName).toBe('tableName')
  })

  test('fails on invalid tableName option', () => {
    const invalidCall = () =>
      TestEntity.build(DeleteItemCommand)
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
      TestEntity.build(DeleteItemCommand)
        .key({ email: 'x', sort: 'y' })
        .options({
          // @ts-expect-error
          extra: true
        })
        .params()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'options.unknownOption' }))
  })

  test('sets condition', () => {
    const { ExpressionAttributeNames, ExpressionAttributeValues, ConditionExpression } =
      TestEntity.build(DeleteItemCommand)
        .key({ email: 'x', sort: 'y' })
        .options({ condition: { attr: 'email', gt: 'test' } })
        .params()

    expect(ExpressionAttributeNames).toEqual({ '#c_1': 'pk' })
    expect(ExpressionAttributeValues).toEqual({ ':c_1': 'test' })
    expect(ConditionExpression).toBe('#c_1 > :c_1')
  })

  test('missing key', () => {
    const invalidCall = () => TestEntity.build(DeleteItemCommand).params()

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
})
