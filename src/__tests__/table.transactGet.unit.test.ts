import { Table, Entity } from '../index.js'
import { DocumentClient } from './bootstrap.test.js'

const TestTable = new Table({
  name: 'test-table',
  alias: 'testTable',
  partitionKey: 'pk',
  sortKey: 'sk',
  indexes: { GSI1: { partitionKey: 'GSI1pk', sortKey: 'GSIsk1' } },
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

describe('transactGet', () => {
  test('fails when transactGet is empty', () => {
    expect(() => {
      // @ts-expect-error
      TestTable.transactGetParams()
    }).toThrow(`No items supplied`)
  })

  test('fails when transactGet items is an empty array', () => {
    expect(() => {
      TestTable.transactGetParams([])
    }).toThrow(`No items supplied`)
  })

  test('transactGets data from a single table', () => {
    const result = TestTable.transactGetParams([
      TestEntity.getTransaction({ email: 'test', sort: 'testsk' })
    ])
    expect(result).toHaveProperty('TransactItems')
    expect(result.TransactItems?.[0]).toEqual({
      Get: {
        TableName: 'test-table',
        Key: { pk: 'test', sk: 'testsk' }
      }
    })
  })

  test('fails when extra options', () => {
    expect(() => {
      TestTable.transactGetParams(
        [TestEntity.getTransaction({ email: 'test', sort: 'testsk' })],
        // @ts-expect-error
        { invalid: true }
      )
    }).toThrow(`Invalid transactGet options: invalid`)
  })

  test('fails when providing an invalid capacity setting', () => {
    expect(() => {
      TestTable.transactGetParams([TestEntity.getTransaction({ email: 'test', sort: 'testsk' })], {
        // @ts-expect-error
        capacity: 'test'
      })
    }).toThrow(`'capacity' must be one of 'NONE','TOTAL', OR 'INDEXES'`)
  })

  test('fails when providing an invalid getTransaction item', () => {
    expect(() => {
      TestTable.transactGetParams(
        // @ts-expect-error
        [{}]
      )
    }).toThrow(`Invalid transaction item. Use the 'getTransaction' method on an entity.`)
  })
})
