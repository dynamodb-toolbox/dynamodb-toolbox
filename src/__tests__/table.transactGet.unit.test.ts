// @xts-nocheck
import { Table, Entity } from '../index'
import { ddbDocClient as DocumentClient } from './bootstrap-tests'

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
})

describe('transactGet',()=>{

  it('fails when transactGet is empty', () => {    
    // @ts-expect-error
    expect(() => { TestTable.transactGetParams() })
      .toThrow(`No items supplied`)
  })

  it('fails when transactGet items is an empty array', () => {
    expect(() => { TestTable.transactGetParams([]) })
      .toThrow(`No items supplied`)
  })

  it('transactGets data from a single table', () => {
    let result = TestTable.transactGetParams([
      TestEntity.getTransaction({ pk: 'test', sk: 'testsk'})
    ])
    expect(result).toHaveProperty('TransactItems')
    expect(result.TransactItems![0]).toHaveProperty('Get')
    expect(result.TransactItems![0].Get!.TableName).toBe('test-table')
    expect(result.TransactItems![0].Get!.Key).toEqual({ pk: 'test', sk: 'testsk'})
  })

  it('fails when extra options', () => {
    expect(() => { TestTable.transactGetParams([
        TestEntity.getTransaction({ pk: 'test', sk: 'testsk'})
      ],
      // @ts-expect-error
      { invalid: true }
    ) })
      .toThrow(`Invalid transactGet options: invalid`)
  })

  it('fails when providing an invalid capacity setting', () => {
    expect(() => { TestTable.transactGetParams(
      [TestEntity.getTransaction({ pk: 'test', sk: 'testsk'})],
      // @ts-expect-error
      { capacity: 'test' }
    ) })
      .toThrow(`'capacity' must be one of 'NONE','TOTAL', OR 'INDEXES'`)
  })

  it('fails when providing an invalid getTransaction item', () => {
    expect(() => { TestTable.transactGetParams(
      // @ts-expect-error
      [{}]
    ) })
      .toThrow(`Invalid transaction item. Use the 'getTransaction' method on an entity.`)
  })
    

})
