// @ts-nocheck
import { Table, Entity } from '../index.js'
import { DocumentClient } from './bootstrap.test.js'

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

describe.skip('get - integration', () => {
  test('gets the key from inputs (async)', async () => {
    const { TableName, Key } = await TestEntity.get({ pk: 'test-pk', sk: 'test-sk' })
    expect(TableName).toBe('test-table')
    expect(Key).toEqual({ pk: 'test-pk', sk: 'test-sk' })
  })

  test('gets the key from input aliases (async)', async () => {
    const { TableName, Key } = await TestEntity.get({ email: 'test-pk', sort: 'test-sk' })
    expect(TableName).toBe('test-table')
    expect(Key).toEqual({ pk: 'test-pk', sk: 'test-sk' })
  })

  test('filters out extra data (async)', async () => {
    const { TableName, Key } = await TestEntity.get({ pk: 'test-pk', sk: 'test-sk', test: 'test' })
    expect(TableName).toBe('test-table')
    expect(Key).toEqual({ pk: 'test-pk', sk: 'test-sk' })
  })

  test('coerces key values to correct types (async)', async () => {
    const { TableName, Key } = await TestEntity.get({ pk: 1, sk: true })
    expect(TableName).toBe('test-table')
    expect(Key).toEqual({ pk: '1', sk: 'true' })
  })

  test('fails with undefined input (async)', async () => {
    expect(TestEntity.get()).rejects.toThrow(`'pk' or 'email' is required`)
  })

  test('fails when missing the sortKey (async)', () => {
    expect(TestEntity.get({ pk: 'test-pk' })).rejects.toThrow(`'sk' or 'sort' is required`)
  })

  test('fails when missing partitionKey (no alias) (async)', () => {
    expect(TestEntity2.get()).rejects.toThrow(`'pk' is required`)
  })

  test('fails when missing the sortKey (no alias) (async)', () => {
    expect(TestEntity2.get({ pk: 'test-pk' })).rejects.toThrow(`'sk' is required`)
  })
})
