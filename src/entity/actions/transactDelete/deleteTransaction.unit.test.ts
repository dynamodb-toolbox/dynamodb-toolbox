import { DeleteTransaction, DynamoDBToolboxError, Entity, Table, item, string } from '~/index.js'

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

const TestEntity2 = new Entity({
  name: 'TestEntity',
  schema: item({
    pk: string().key(),
    sk: string().key(),
    test: string()
  }),
  table: TestTable
})

describe('delete transaction', () => {
  test('deletes the key from inputs', async () => {
    const {
      Delete: { TableName, Key }
    } = TestEntity.build(DeleteTransaction).key({ email: 'test-pk', sort: 'test-sk' }).params()

    expect(TableName).toBe('test-table')
    expect(Key).toStrictEqual({ pk: 'test-pk', sk: 'test-sk' })
  })

  test('filters out extra data', async () => {
    const {
      Delete: { Key }
    } = TestEntity.build(DeleteTransaction)
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
      TestEntity.build(DeleteTransaction)
        .key(
          // @ts-expect-error
          {}
        )
        .params()
    ).toThrow(DynamoDBToolboxError)
  })

  test('fails when missing the sortKey', () => {
    expect(() =>
      TestEntity.build(DeleteTransaction)
        .key(
          // @ts-expect-error
          { pk: 'test-pk' }
        )
        .params()
    ).toThrow(DynamoDBToolboxError)
  })

  test('fails when missing partitionKey (no alias)', () => {
    expect(() =>
      TestEntity2.build(DeleteTransaction)
        .key(
          // @ts-expect-error
          {}
        )
        .params()
    ).toThrow(DynamoDBToolboxError)
  })

  test('fails when missing the sortKey (no alias)', () => {
    expect(() =>
      TestEntity2.build(DeleteTransaction)
        .key(
          // @ts-expect-error
          { pk: 'test-pk' }
        )
        .params()
    ).toThrow(DynamoDBToolboxError)
  })

  test('sets returnValuesOnConditionFalse options', () => {
    const {
      Delete: { ReturnValuesOnConditionCheckFailure }
    } = TestEntity.build(DeleteTransaction)
      .key({ email: 'x', sort: 'y' })
      .options({ returnValuesOnConditionFalse: 'ALL_OLD' })
      .params()

    expect(ReturnValuesOnConditionCheckFailure).toBe('ALL_OLD')
  })

  test('fails on invalid returnValuesOnConditionFalse option', () => {
    const invalidCall = () =>
      TestEntity.build(DeleteTransaction)
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

  // Options
  test('overrides tableName', () => {
    const {
      Delete: { TableName }
    } = TestEntity.build(DeleteTransaction)
      .key({ email: 'x', sort: 'y' })
      .options({ tableName: 'tableName' })
      .params()

    expect(TableName).toBe('tableName')
  })

  test('fails on invalid tableName option', () => {
    const invalidCall = () =>
      TestEntity.build(DeleteTransaction)
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
      TestEntity.build(DeleteTransaction)
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
    const {
      Delete: { ExpressionAttributeNames, ExpressionAttributeValues, ConditionExpression }
    } = TestEntity.build(DeleteTransaction)
      .key({ email: 'x', sort: 'y' })
      .options({ condition: { attr: 'email', gt: 'test' } })
      .params()

    expect(ExpressionAttributeNames).toEqual({ '#c_1': 'pk' })
    expect(ExpressionAttributeValues).toEqual({ ':c_1': 'test' })
    expect(ConditionExpression).toBe('#c_1 > :c_1')
  })

  test('missing key', () => {
    const invalidCall = () => TestEntity.build(DeleteTransaction).params()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'actions.incompleteAction' }))
  })
})
