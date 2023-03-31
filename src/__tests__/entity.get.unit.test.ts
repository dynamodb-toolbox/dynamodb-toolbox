import { Table, Entity } from '..'
import { DocumentClient } from './bootstrap.test'

const TestTable = new Table({
  name: 'test-table',
  partitionKey: 'pk',
  sortKey: 'sk',
  DocumentClient
})

const TestEntity = new Entity({
  name: 'TestEntity',
  autoExecute: false,
  attributes: {
    email: { type: 'string', partitionKey: true },
    sort: { type: 'string', sortKey: true },
    test: 'string'
  },
  table: TestTable
} as const)

const TestTable2 = new Table({
  name: 'test-table',
  partitionKey: 'pk',
  sortKey: 'sk',
  DocumentClient
})

const TestEntity2 = new Entity({
  name: 'TestEntity',
  autoExecute: false,
  attributes: {
    pk: { type: 'string', partitionKey: true },
    sk: { type: 'string', sortKey: true },
    test: 'string'
  },
  table: TestTable2
} as const)

describe('get', () => {
  it('gets the key from inputs (sync)', async () => {
    const { TableName, Key } = TestEntity.getParams({ email: 'test-pk', sort: 'test-sk' })
    expect(TableName).toBe('test-table')
    expect(Key).toEqual({ pk: 'test-pk', sk: 'test-sk' })
  })

  it('gets the key from inputs (async)', async () => {
    const { TableName, Key } = await TestEntity.get({ email: 'test-pk', sort: 'test-sk' })
    expect(TableName).toBe('test-table')
    expect(Key).toEqual({ pk: 'test-pk', sk: 'test-sk' })
  })

  it('filters out extra data (sync)', async () => {
    const { TableName, Key } = TestEntity.getParams({
      email: 'test-pk',
      sort: 'test-sk',
      // @ts-expect-error
      test: 'test'
    })
    expect(TableName).toBe('test-table')
    expect(Key).toEqual({ pk: 'test-pk', sk: 'test-sk' })
  })

  it('filters out extra data (async)', async () => {
    const { TableName, Key } = await TestEntity.get({
      email: 'test-pk',
      sort: 'test-sk',
      // @ts-expect-error
      test: 'test'
    })
    expect(TableName).toBe('test-table')
    expect(Key).toEqual({ pk: 'test-pk', sk: 'test-sk' })
  })

  it('coerces key values to correct types (sync)', async () => {
    // @ts-expect-error 💥 TODO: Support coerce keyword
    const { TableName, Key } = TestEntity.getParams({ email: 1, sort: true })
    expect(TableName).toBe('test-table')
    expect(Key).toEqual({ pk: '1', sk: 'true' })
  })

  it('coerces key values to correct types (async)', async () => {
    // @ts-expect-error 💥 TODO: Support coerce keyword
    const { TableName, Key } = await TestEntity.get({ email: 1, sort: true })
    expect(TableName).toBe('test-table')
    expect(Key).toEqual({ pk: '1', sk: 'true' })
  })

  it('fails with undefined input (sync)', () => {
    // @ts-expect-error
    expect(() => TestEntity.getParams()).toThrow(`'pk' or 'email' is required`)
  })

  it('fails with undefined input (async)', async () => {
    // @ts-expect-error
    expect(TestEntity.get()).rejects.toThrow(`'pk' or 'email' is required`)
  })

  it('fails when missing the sortKey (sync)', () => {
    // @ts-expect-error
    expect(() => TestEntity.getParams({ pk: 'test-pk' })).toThrow(`'sk' or 'sort' is required`)
  })

  it('fails when missing the sortKey (async)', () => {
    // @ts-expect-error
    expect(TestEntity.get({ pk: 'test-pk' })).rejects.toThrow(`'sk' or 'sort' is required`)
  })

  it('fails when missing partitionKey (no alias) (sync)', () => {
    // @ts-expect-error
    expect(() => TestEntity2.getParams()).toThrow(`'pk' is required`)
  })

  it('fails when missing partitionKey (no alias) (async)', () => {
    // @ts-expect-error
    expect(TestEntity2.get()).rejects.toThrow(`'pk' is required`)
  })

  it('fails when missing the sortKey (no alias) (sync)', () => {
    // @ts-expect-error
    expect(() => TestEntity2.getParams({ pk: 'test-pk' })).toThrow(`'sk' is required`)
  })

  it('fails when missing the sortKey (no alias) (async)', () => {
    // @ts-expect-error
    expect(TestEntity2.get({ pk: 'test-pk' })).rejects.toThrow(`'sk' is required`)
  })

  it('allows execute and parse options', () => {
    const { TableName, Key } = TestEntity.getParams(
      { email: 'x', sort: 'y' },
      { execute: false, parse: false }
    )
    expect(TableName).toBe('test-table')
    expect(Key).toEqual({ pk: 'x', sk: 'y' })
  })

  it('fails on extra options', () => {
    expect(() =>
      TestEntity.getParams(
        { email: 'x', sort: 'y' },
        // @ts-expect-error
        { execute: false, parse: false, extra: true }
      )
    ).toThrow('Invalid get options: extra')
  })

  it('fails on invalid consistent option', () => {
    // @ts-expect-error
    expect(() => TestEntity.getParams({ email: 'x', sort: 'y' }, { consistent: 'true' })).toThrow(
      `'consistent' requires a boolean`
    )
  })

  it('fails on invalid capacity option', () => {
    // @ts-expect-error
    expect(() => TestEntity.getParams({ email: 'x', sort: 'y' }, { capacity: 'test' })).toThrow(
      `'capacity' must be one of 'NONE','TOTAL', OR 'INDEXES'`
    )
  })

  it('parses attribute projections', () => {
    const { TableName, Key, ExpressionAttributeNames, ProjectionExpression } = TestEntity.getParams(
      { email: 'x', sort: 'y' },
      { attributes: ['email'] }
    )
    expect(TableName).toBe('test-table')
    expect(Key).toEqual({ pk: 'x', sk: 'y' })
    expect(ExpressionAttributeNames).toEqual({ '#proj1': 'pk' })
    expect(ProjectionExpression).toBe('#proj1')
  })

  it('sets consistent and capacity options', () => {
    const { TableName, Key, ConsistentRead, ReturnConsumedCapacity } = TestEntity.getParams(
      { email: 'x', sort: 'y' },
      { consistent: true, capacity: 'none' }
    )
    expect(TableName).toBe('test-table')
    expect(Key).toEqual({ pk: 'x', sk: 'y' })
    expect(ConsistentRead).toBe(true)
    expect(ReturnConsumedCapacity).toBe('NONE')
  })

  it('handles extra parameters', () => {
    const { TableName, Key, ConsistentRead } = TestEntity.getParams(
      { email: 'x', sort: 'y' },
      {},
      { ConsistentRead: true }
    )
    expect(TableName).toBe('test-table')
    expect(Key).toEqual({ pk: 'x', sk: 'y' })
    expect(ConsistentRead).toBe(true)
  })

  it('handles invalid parameter input', () => {
    const { TableName, Key } = TestEntity.getParams(
      { email: 'x', sort: 'y' },
      {},
      // @ts-expect-error
      'string'
    )
    expect(TableName).toBe('test-table')
    expect(Key).toEqual({ pk: 'x', sk: 'y' })
  })

  it('formats a batch get response', async () => {
    const { Table, Key } = TestEntity.getBatch({ email: 'a', sort: 'b' })
    expect(Table?.name).toBe('test-table')
    expect(Key).toEqual({ pk: 'a', sk: 'b' })
  })

  it('fails if no value is provided to the getBatch method', () => {
    // @ts-expect-error
    expect(() => TestEntity.getBatch()).toThrow(`'pk' or 'email' is required`)
  })
})
