import { Table, Entity } from '../index.js'
import { DocumentClient } from './bootstrap.test.js'

const TestTable = new Table({
  name: 'test-table',
  partitionKey: 'pk',
  sortKey: 'sk',
  indexes: { GSI1: { partitionKey: 'GSI1pk', sortKey: 'GSIsk1' } },
  DocumentClient,
  autoExecute: false
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

describe('table.get', () => {
  test('gets an entity from the table', async () => {
    const result = await TestTable.get('TestEntity', { email: 'val1', sort: 'val2' })
    expect(result).toEqual({ TableName: 'test-table', Key: { pk: 'val1', sk: 'val2' } })
  })

  test('fails on invalid entity when performing a get', () => {
    expect(TestTable.get('TestEntityX')).rejects.toThrow(`'TestEntityX' is not a valid Entity`)
  })
})

describe('table.delete', () => {
  test('deletes an entity from the table', async () => {
    const result = await TestTable.delete('TestEntity', { email: 'val1', sort: 'val2' })
    expect(result).toEqual({ TableName: 'test-table', Key: { pk: 'val1', sk: 'val2' } })
  })

  test('fails on invalid entity when performing a delete', () => {
    expect(TestTable.delete('TestEntityX')).rejects.toThrow(`'TestEntityX' is not a valid Entity`)
  })
})

describe('table.update', () => {
  test('updates an entity from the table', async () => {
    const result = await TestTable.update('TestEntity', {
      email: 'val1',
      sort: 'val2',
      test: 'testing'
    })
    expect(result.TableName).toBe('test-table')
    expect(result.Key).toEqual({ pk: 'val1', sk: 'val2' })
    expect(result.UpdateExpression).toBe(
      'SET #_ct = if_not_exists(#_ct,:_ct), #_md = :_md, #_et = if_not_exists(#_et,:_et), #test = :test'
    )
  })

  test('fails on invalid entity when performing an update', () => {
    expect(TestTable.update('TestEntityX')).rejects.toThrow(`'TestEntityX' is not a valid Entity`)
  })
})

describe('table.put', () => {
  test('puts an entity to the table', async () => {
    const result = await TestTable.put('TestEntity', {
      email: 'val1',
      sort: 'val2',
      test: 'testing'
    })
    expect(result.TableName).toBe('test-table')
    expect(result.Item.pk).toBe('val1')
    expect(result.Item.sk).toBe('val2')
    expect(result.Item.test).toBe('testing')
  })

  test('fails on invalid entity when performing a put', () => {
    expect(TestTable.put('TestEntityX')).rejects.toThrow(`'TestEntityX' is not a valid Entity`)
  })
})

describe('table.parse', () => {
  test('parses single item', async () => {
    const item = await TestTable.parse(TestEntity.name, {
      pk: 'test@test.com',
      sk: 'email',
      test: 'testing',
      _et: TestEntity.name
    })
    expect(item).toEqual({
      email: 'test@test.com',
      sort: 'email',
      test: 'testing',
      entity: TestEntity.name
    })
  })

  test('fails on invalid entity when performing a parse', () => {
    // @ts-expect-error
    expect(TestTable.parse('TestEntityX')).rejects.toThrow(`'TestEntityX' is not a valid Entity`)
  })
})
