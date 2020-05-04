const { Table, Entity } = require('../index')
const { DocumentClient } = require('./bootstrap-tests')

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
})

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
})

describe('get',()=>{

  it('gets the key from inputs (sync)', async () => {
    const { TableName, Key } = TestEntity.getParams({ pk: 'test-pk', sk: 'test-sk' })    
    expect(TableName).toBe('test-table')
    expect(Key).toEqual({ pk: 'test-pk', sk: 'test-sk' })
  })

  it('gets the key from inputs (async)', async () => {
    const { TableName, Key } = await TestEntity.get({ pk: 'test-pk', sk: 'test-sk' })    
    expect(TableName).toBe('test-table')
    expect(Key).toEqual({ pk: 'test-pk', sk: 'test-sk' })
  })

  it('gets the key from input aliases (sync)', async () => {
    let { TableName, Key } = TestEntity.getParams({ email: 'test-pk', sort: 'test-sk' })
    expect(TableName).toBe('test-table')
    expect(Key).toEqual({ pk: 'test-pk', sk: 'test-sk' })
  })

  it('gets the key from input aliases (async)', async () => {
    let { TableName, Key } = await TestEntity.get({ email: 'test-pk', sort: 'test-sk' })
    expect(TableName).toBe('test-table')
    expect(Key).toEqual({ pk: 'test-pk', sk: 'test-sk' })
  })

  it('filters out extra data (sync)', async () => {
    let { TableName, Key } = TestEntity.getParams({ pk: 'test-pk', sk: 'test-sk', test: 'test' })
    expect(TableName).toBe('test-table')
    expect(Key).toEqual({ pk: 'test-pk', sk: 'test-sk' })
  })

  it('filters out extra data (async)', async () => {
    let { TableName, Key } = await TestEntity.get({ pk: 'test-pk', sk: 'test-sk', test: 'test' })
    expect(TableName).toBe('test-table')
    expect(Key).toEqual({ pk: 'test-pk', sk: 'test-sk' })
  })

  it('coerces key values to correct types (sync)', async () => {
    let { TableName, Key } = TestEntity.getParams({ pk: 1, sk: true })
    expect(TableName).toBe('test-table')
    expect(Key).toEqual({ pk: '1', sk: 'true' })
  })

  it('coerces key values to correct types (async)', async () => {
    let { TableName, Key } = await TestEntity.get({ pk: 1, sk: true })
    expect(TableName).toBe('test-table')
    expect(Key).toEqual({ pk: '1', sk: 'true' })
  })

  it('fails with undefined input (sync)', () => {
    expect(() => TestEntity.getParams()).toThrow(`'pk' or 'email' is required`)
  })

  it('fails with undefined input (async)', async () => {
    expect(TestEntity.get()).rejects.toThrow(`'pk' or 'email' is required`)
  })

  it('fails when missing the sortKey (sync)', () => {
    expect(() => TestEntity.getParams({ pk: 'test-pk' })).toThrow(`'sk' or 'sort' is required`)
  })

  it('fails when missing the sortKey (async)', () => {
    expect(TestEntity.get({ pk: 'test-pk' })).rejects.toThrow(`'sk' or 'sort' is required`)
  })

  it('fails when missing partitionKey (no alias) (sync)', () => {
    expect(() => TestEntity2.getParams()).toThrow(`'pk' is required`)
  })

  it('fails when missing partitionKey (no alias) (async)', () => {
    expect(TestEntity2.get()).rejects.toThrow(`'pk' is required`)
  })

  it('fails when missing the sortKey (no alias) (sync)', () => {
    expect(() => TestEntity2.getParams({ pk: 'test-pk' })).toThrow(`'sk' is required`)
  })

  it('fails when missing the sortKey (no alias) (async)', () => {
    expect(TestEntity2.get({ pk: 'test-pk' })).rejects.toThrow(`'sk' is required`)
  })

  it('allows execute and parse options', () => {
    let { TableName, Key } = TestEntity.getParams(
      { pk: 'x', sk: 'y' },
      { execute: false, parse: false }
    )
    expect(TableName).toBe('test-table')
    expect(Key).toEqual({ pk: 'x', sk: 'y' })
  })

  it('fails on extra options', () => {
    expect(() => TestEntity.getParams(
      { pk: 'x', sk: 'y' },
      { execute: false, parse: false, extra: true }
    )).toThrow('Invalid get options: extra')
  })

  it('fails on invalid consistent option', () => {
    expect(() => TestEntity.getParams({ pk: 'x', sk: 'y' }, { consistent: 'true' }))
      .toThrow(`'consistent' requires a boolean`)
  })

  it('fails on invalid capacity option', () => {
    expect(() => TestEntity.getParams({ pk: 'x', sk: 'y' }, { capacity: 'test' }))
      .toThrow(`'capacity' must be one of 'NONE','TOTAL', OR 'INDEXES'`)
  })

  it('parses attribute projections', () => {
    let { TableName, Key, ExpressionAttributeNames, ProjectionExpression } = TestEntity.getParams(
      { pk: 'x', sk: 'y' },
      { attributes: ['pk'] }
    )
    expect(TableName).toBe('test-table')
    expect(Key).toEqual({ pk: 'x', sk: 'y' })
    expect(ExpressionAttributeNames).toEqual({ '#proj1': 'pk' })
    expect(ProjectionExpression).toBe('#proj1')
  })

  it('sets consistent and capacity options', () => {
    let { TableName, Key, ConsistentRead, ReturnConsumedCapacity } = TestEntity.getParams(
      { pk: 'x', sk: 'y' },
      { consistent: true, capacity: 'none' }
    )
    expect(TableName).toBe('test-table')
    expect(Key).toEqual({ pk: 'x', sk: 'y' })
    expect(ConsistentRead).toBe(true)
    expect(ReturnConsumedCapacity).toBe('NONE')
  })

  it('handles extra parameters', () => {
    let { TableName, Key, ConsistentRead } = TestEntity.getParams(
      { pk: 'x', sk: 'y' },
      { },
      { ConsistentRead: true }
    )
    expect(TableName).toBe('test-table')
    expect(Key).toEqual({ pk: 'x', sk: 'y' })
    expect(ConsistentRead).toBe(true)
  })

  it('handles invalid parameter input', () => {
    let { TableName, Key } = TestEntity.getParams(
      { pk: 'x', sk: 'y' },
      { },
      'string'
    )
    expect(TableName).toBe('test-table')
    expect(Key).toEqual({ pk: 'x', sk: 'y' })
  })

  it('formats a batch get response', async () => {
    let { Table, Key } = TestEntity.getBatch({ pk: 'a', sk: 'b' })
    expect(Table.name).toBe('test-table')
    expect(Key).toEqual({ pk: 'a', sk: 'b' })
  })

  it('fails if no value is provided to the getBatch method', () => {
    expect(() => TestEntity.getBatch()).toThrow(`'pk' or 'email' is required`)
  })

})
