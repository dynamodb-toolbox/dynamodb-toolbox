import { Table, Entity } from '..'
import { DocumentClient } from './bootstrap-tests'

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

describe('delete', () => {
  it('deletes the key from inputs (sync)', async () => {
    const { TableName, Key } = TestEntity.deleteParams({ email: 'test-pk', sort: 'test-sk' })
    expect(TableName).toBe('test-table')
    expect(Key).toEqual({ pk: 'test-pk', sk: 'test-sk' })
  })

  it('deletes the key from inputs (async)', async () => {
    // @ts-expect-error 💥 TODO: Fix return type
    const { TableName, Key } = await TestEntity.delete({ email: 'test-pk', sort: 'test-sk' })
    expect(TableName).toBe('test-table')
    expect(Key).toEqual({ pk: 'test-pk', sk: 'test-sk' })
  })

  it('filters out extra data (sync)', async () => {
    let { TableName, Key } = TestEntity.deleteParams({
      email: 'test-pk',
      sort: 'test-sk',
      // @ts-expect-error 💥 TODO: This should not error as test can be used in default function
      test: 'test'
    })
    expect(TableName).toBe('test-table')
    expect(Key).toEqual({ pk: 'test-pk', sk: 'test-sk' })
  })

  it('filters out extra data (async)', async () => {
    // @ts-expect-error 💥 TODO: Fix return type
    let { TableName, Key } = await TestEntity.delete({
      email: 'test-pk',
      sort: 'test-sk',
      // @ts-expect-error 💥 TODO: This should not error as test can be used in default function
      test: 'test'
    })
    expect(TableName).toBe('test-table')
    expect(Key).toEqual({ pk: 'test-pk', sk: 'test-sk' })
  })

  it('coerces key values to correct types (sync)', async () => {
    // @ts-expect-error 💥 TODO: Support coerce keyword
    let { TableName, Key } = TestEntity.deleteParams({ email: 1, sort: true })
    expect(TableName).toBe('test-table')
    expect(Key).toEqual({ pk: '1', sk: 'true' })
  })

  it('coerces key values to correct types (async)', async () => {
    // @ts-expect-error 💥 TODO: Fix return type + Support coerce keyword
    let { TableName, Key } = await TestEntity.delete({ email: 1, sort: true })
    expect(TableName).toBe('test-table')
    expect(Key).toEqual({ pk: '1', sk: 'true' })
  })

  it('fails with undefined input (sync)', () => {
    // @ts-expect-error
    expect(() => TestEntity.deleteParams()).toThrow(`'pk' or 'email' is required`)
  })

  it('fails with undefined input (async)', async () => {
    // @ts-expect-error
    expect(TestEntity.delete()).rejects.toThrow(`'pk' or 'email' is required`)
  })

  it('fails when missing the sortKey (sync)', () => {
    // @ts-expect-error
    expect(() => TestEntity.deleteParams({ email: 'test-pk' })).toThrow(
      `'sk' or 'sort' is required`
    )
  })

  it('fails when missing the sortKey (async)', () => {
    // @ts-expect-error
    expect(TestEntity.delete({ email: 'test-pk' })).rejects.toThrow(`'sk' or 'sort' is required`)
  })

  it('fails when missing partitionKey (no alias) (sync)', () => {
    // @ts-expect-error
    expect(() => TestEntity2.deleteParams()).toThrow(`'pk' is required`)
  })

  it('fails when missing partitionKey (no alias) (async)', () => {
    // @ts-expect-error
    expect(TestEntity2.delete()).rejects.toThrow(`'pk' is required`)
  })

  it('fails when missing the sortKey (no alias) (sync)', () => {
    // @ts-expect-error
    expect(() => TestEntity2.deleteParams({ pk: 'test-pk' })).toThrow(`'sk' is required`)
  })

  it('fails when missing the sortKey (no alias) (async)', () => {
    // @ts-expect-error
    expect(TestEntity2.delete({ pk: 'test-pk' })).rejects.toThrow(`'sk' is required`)
  })

  it('allows execute and parse options', () => {
    let { TableName, Key } = TestEntity.deleteParams(
      { email: 'x', sort: 'y' },
      { execute: false, parse: false }
    )
    expect(TableName).toBe('test-table')
    expect(Key).toEqual({ pk: 'x', sk: 'y' })
  })

  it('fails on extra options', () => {
    expect(() =>
      TestEntity.deleteParams(
        { email: 'x', sort: 'y' },
        // @ts-expect-error
        { execute: false, parse: false, extra: true }
      )
    ).toThrow('Invalid delete options: extra')
  })

  it('fails on invalid capacity option', () => {
    expect(() =>
      TestEntity.deleteParams(
        { email: 'x', sort: 'y' },
        // 💥 TODO: Improve capacity type
        { capacity: 'test' }
      )
    ).toThrow(`'capacity' must be one of 'NONE','TOTAL', OR 'INDEXES'`)
  })

  it('fails on invalid metrics option', () => {
    expect(() =>
      TestEntity.deleteParams(
        { email: 'x', sort: 'y' },
        // 💥 TODO: Improve capacity type
        { metrics: 'test' }
      )
    ).toThrow(`'metrics' must be one of 'NONE' OR 'SIZE'`)
  })

  it('fails on invalid returnValues option', () => {
    expect(() =>
      TestEntity.deleteParams(
        { email: 'x', sort: 'y' },
        // @ts-expect-error
        { returnValues: 'test' }
      )
    ).toThrow(`'returnValues' must be one of 'NONE' OR 'ALL_OLD'`)
  })

  it('sets capacity options', () => {
    let { TableName, Key, ReturnConsumedCapacity } = TestEntity.deleteParams(
      { email: 'x', sort: 'y' },
      { capacity: 'none' }
    )
    expect(TableName).toBe('test-table')
    expect(Key).toEqual({ pk: 'x', sk: 'y' })
    expect(ReturnConsumedCapacity).toBe('NONE')
  })

  it('sets metrics options', () => {
    let { TableName, Key, ReturnItemCollectionMetrics } = TestEntity.deleteParams(
      { email: 'x', sort: 'y' },
      { metrics: 'size' }
    )
    expect(TableName).toBe('test-table')
    expect(Key).toEqual({ pk: 'x', sk: 'y' })
    expect(ReturnItemCollectionMetrics).toBe('SIZE')
  })

  it('sets returnValues options', () => {
    let { TableName, Key, ReturnValues } = TestEntity.deleteParams(
      { email: 'x', sort: 'y' },
      { returnValues: 'ALL_OLD' }
    )
    expect(TableName).toBe('test-table')
    expect(Key).toEqual({ pk: 'x', sk: 'y' })
    expect(ReturnValues).toBe('ALL_OLD')
  })

  it('sets conditions', () => {
    let result = TestEntity.deleteParams(
      { email: 'x', sort: 'y' },
      { conditions: { attr: 'email', gt: 'test' } }
    )

    expect(result).toEqual({
      TableName: 'test-table',
      Key: { pk: 'x', sk: 'y' },
      ExpressionAttributeNames: { '#attr1': 'pk' },
      ExpressionAttributeValues: { ':attr1': 'test' },
      ConditionExpression: '#attr1 > :attr1'
    })
  })

  it('handles extra parameters', () => {
    let { TableName, Key, ReturnConsumedCapacity } = TestEntity.deleteParams(
      { email: 'x', sort: 'y' },
      {},
      { ReturnConsumedCapacity: 'NONE' }
    )
    expect(TableName).toBe('test-table')
    expect(Key).toEqual({ pk: 'x', sk: 'y' })
    expect(ReturnConsumedCapacity).toBe('NONE')
  })

  it('handles invalid parameter input', () => {
    let { TableName, Key } = TestEntity.deleteParams(
      { email: 'x', sort: 'y' },
      {},
      // @ts-expect-error
      'string'
    )
    expect(TableName).toBe('test-table')
    expect(Key).toEqual({ pk: 'x', sk: 'y' })
  })

  it('formats a batch delete response', async () => {
    let result = TestEntity.deleteBatch({ email: 'x', sort: 'y' })
    expect(result).toEqual({ 'test-table': { DeleteRequest: { Key: { pk: 'x', sk: 'y' } } } })
  })

  it('fails if no value is provided to the deleteBatch method', () => {
    // @ts-expect-error
    expect(() => TestEntity.deleteBatch()).toThrow(`'pk' or 'email' is required`)
  })

  // Adding this for regression testing
  it('Non-Key Index Generated on Delete #74', async () => {
    const FoosTable = new Table({
      name: 'test-table',
      partitionKey: 'pk',
      sortKey: 'sk',
      indexes: {
        'GSI-1': { partitionKey: 'gsi1pk', sortKey: 'gsi1sk' }
      },
      DocumentClient
    })
    const Foos = new Entity({
      name: 'Foo',
      table: FoosTable,
      timestamps: true,
      attributes: {
        pk: { hidden: true, partitionKey: true, default: (data: any) => `FOO#${data.id}` },
        sk: { hidden: true, sortKey: true, default: (data: any) => `FOO#${data.id}` },

        // This next `default` gets executed on delete() and fails with "Cannot read property 'tenant' of undefined"
        gsi1pk: { hidden: true, default: (data: any) => `TENANT#${data.meta.tenant}` },

        gsi1sk: { hidden: true, default: (data: any) => `FOO#${data.id}` },
        id: { required: 'always' },
        meta: { type: 'map', required: 'always' },
        __context__: { hidden: true }
      }
    } as const)

    const key = { id: 'xyz' }
    // @ts-expect-error 💥 TODO: Because default can be a func, composite keys in deletes and gets should accept extra data
    let result = Foos.deleteParams(key) // Fails with v0.2.0-beta. Fine with v0.2.0-alpha
    expect(result).toEqual({ TableName: 'test-table', Key: { pk: 'FOO#xyz', sk: 'FOO#xyz' } })
  })
})
