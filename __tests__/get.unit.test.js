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
    const { TableName, Key } = TestEntity.generateGetParams({ pk: 'test-pk', sk: 'test-sk' })    
    expect(TableName).toBe('test-table')
    expect(Key).toEqual({ pk: 'test-pk', sk: 'test-sk' })
  })

  it('gets the key from inputs (async)', async () => {
    const { TableName, Key } = await TestEntity.get({ pk: 'test-pk', sk: 'test-sk' })    
    expect(TableName).toBe('test-table')
    expect(Key).toEqual({ pk: 'test-pk', sk: 'test-sk' })
  })

  it('gets the key from input aliases (sync)', async () => {
    let { TableName, Key } = TestEntity.generateGetParams({ email: 'test-pk', sort: 'test-sk' })
    expect(TableName).toBe('test-table')
    expect(Key).toEqual({ pk: 'test-pk', sk: 'test-sk' })
  })

  it('gets the key from input aliases (async)', async () => {
    let { TableName, Key } = await TestEntity.get({ email: 'test-pk', sort: 'test-sk' })
    expect(TableName).toBe('test-table')
    expect(Key).toEqual({ pk: 'test-pk', sk: 'test-sk' })
  })

  it('filters out extra data (sync)', async () => {
    let { TableName, Key } = TestEntity.generateGetParams({ pk: 'test-pk', sk: 'test-sk', test: 'test' })
    expect(TableName).toBe('test-table')
    expect(Key).toEqual({ pk: 'test-pk', sk: 'test-sk' })
  })

  it('filters out extra data (async)', async () => {
    let { TableName, Key } = await TestEntity.get({ pk: 'test-pk', sk: 'test-sk', test: 'test' })
    expect(TableName).toBe('test-table')
    expect(Key).toEqual({ pk: 'test-pk', sk: 'test-sk' })
  })

  it('coerces key values to correct types (sync)', async () => {
    let { TableName, Key } = TestEntity.generateGetParams({ pk: 1, sk: true })
    expect(TableName).toBe('test-table')
    expect(Key).toEqual({ pk: '1', sk: 'true' })
  })

  it('coerces key values to correct types (async)', async () => {
    let { TableName, Key } = await TestEntity.get({ pk: 1, sk: true })
    expect(TableName).toBe('test-table')
    expect(Key).toEqual({ pk: '1', sk: 'true' })
  })

  it('fails with undefined input (sync)', () => {
    expect(() => TestEntity.generateGetParams()).toThrow(`'pk' or 'email' is required`)
  })

  it('fails with undefined input (async)', async () => {
    expect(TestEntity.get()).rejects.toBe(`'pk' or 'email' is required`)
  })

  it('fails when missing the sortKey (sync)', () => {
    expect(() => TestEntity.generateGetParams({ pk: 'test-pk' })).toThrow(`'sk' or 'sort' is required`)
  })

  it('fails when missing the sortKey (async)', () => {
    expect(TestEntity.get({ pk: 'test-pk' })).rejects.toBe(`'sk' or 'sort' is required`)
  })

  it('fails when missing partitionKey (no alias) (sync)', () => {
    expect(() => TestEntity2.generateGetParams()).toThrow(`'pk' is required`)
  })

  it('fails when missing partitionKey (no alias) (async)', () => {
    expect(TestEntity2.get()).rejects.toBe(`'pk' is required`)
  })

  it('fails when missing the sortKey (no alias) (sync)', () => {
    expect(() => TestEntity2.generateGetParams({ pk: 'test-pk' })).toThrow(`'sk' is required`)
  })

  it('fails when missing the sortKey (no alias) (async)', () => {
    expect(TestEntity2.get({ pk: 'test-pk' })).rejects.toBe(`'sk' is required`)
  })

})
