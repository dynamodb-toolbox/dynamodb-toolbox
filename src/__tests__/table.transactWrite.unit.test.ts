import { Table, Entity } from '../index'
import { ddbDocClient as docClient } from './bootstrap-tests'

const TestTable = new Table({
  name: 'test-table',
  alias: 'testTable',
  partitionKey: 'pk',
  sortKey: 'sk',
  indexes: { GSI1: { partitionKey: 'GSI1pk', sortKey: 'GSIsk1' } },
  DocumentClient: docClient
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

describe('transactWrite',()=>{

  it('fails when transactWrite is empty', () => {
    // @ts-expect-error
    expect(() => { TestTable.transactWriteParams() })
      .toThrow(`No items supplied`)
  })

  it('fails when transactWrite items is an empty array', () => {
    expect(() => { TestTable.transactWriteParams([]) })
      .toThrow(`No items supplied`)
  })

  it('transactWrite put, update, delete data', () => {
    let result = TestTable.transactWriteParams([
      TestEntity.putTransaction({ pk: 'test', sk: 'testsk1', test: 'test'}),
      TestEntity.updateTransaction({ pk: 'test', sk: 'testsk2', test: 'test'}),
      TestEntity.deleteTransaction({ pk: 'test', sk: 'testsk3', test: 'test'})
    ])

    expect(result.TransactItems![0].Put!.Item!.sk).toBe('testsk1')
    expect(result.TransactItems![1].Update!.UpdateExpression).toBe('SET #_ct = if_not_exists(#_ct,:_ct), #_md = :_md, #_et = if_not_exists(#_et,:_et), #test = :test')
    expect(result.TransactItems![2].Delete!.Key!.sk).toBe('testsk3')
  })

  it('fails when extra options', () => {
    expect(() => { TestTable.transactWriteParams(
      [TestEntity.putTransaction({ pk: 'test', sk: 'testsk'})],
      // @ts-expect-error
      { invalid: true }
    ) })
      .toThrow(`Invalid transactWrite options: invalid`)
  })

  it('fails when providing an invalid capacity setting', () => {
    expect(() => { TestTable.transactWriteParams(
      [TestEntity.putTransaction({ pk: 'test', sk: 'testsk'})],
      // @ts-expect-error
      { capacity: 'test' }
    ) })
      .toThrow(`'capacity' must be one of 'NONE','TOTAL', OR 'INDEXES'`)
  })

  it('fails when providing an invalid metrics setting', () => {
    expect(() => { TestTable.transactWriteParams(
      [TestEntity.putTransaction({ pk: 'test', sk: 'testsk'})],
      // @ts-expect-error
      { metrics: 'test' }
    ) })
      .toThrow(`'metrics' must be one of 'NONE' OR 'SIZE'`)
  })

})
