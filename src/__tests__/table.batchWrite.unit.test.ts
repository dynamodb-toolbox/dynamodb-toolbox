import { Table, Entity } from '../index';
import { DocumentClient } from './bootstrap-tests';

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

describe('batchWrite',()=>{

  it('fails when batchWrite is empty', () => {
    expect(() => { TestTable.batchWriteParams() })
      .toThrow(`No items supplied`)
  })

  it('fails when batchWrite items is an empty array', () => {
    expect(() => { TestTable.batchWriteParams([]) })
      .toThrow(`No items supplied`)
  })

  it('batchWrites data to a single table', () => {
    let result = TestTable.batchWriteParams(
      TestEntity.putBatch({ pk: 'test', sk: 'testsk', test: 'test'})
    )
    expect(result.RequestItems['test-table'][0].PutRequest.Item.pk).toBe('test')
    expect(result.RequestItems['test-table'][0].PutRequest.Item.sk).toBe('testsk')
    expect(result.RequestItems['test-table'][0].PutRequest.Item.test).toBe('test')
  })

  it('fails when extra options', () => {
    expect(() => { TestTable.batchWriteParams(
      TestEntity.putBatch({ pk: 'test', sk: 'testsk'}),
      { invalid: true }
    ) })
      .toThrow(`Invalid batchWrite options: invalid`)
  })

  it('fails when providing an invalid capacity setting', () => {
    expect(() => { TestTable.batchWriteParams(
      TestEntity.putBatch({ pk: 'test', sk: 'testsk'}),
      { capacity: 'test' }
    ) })
      .toThrow(`'capacity' must be one of 'NONE','TOTAL', OR 'INDEXES'`)
  })

  it('fails when providing an invalid metrics setting', () => {
    expect(() => { TestTable.batchWriteParams(
      TestEntity.putBatch({ pk: 'test', sk: 'testsk'}),
      { metrics: 'test' }
    ) })
      .toThrow(`'metrics' must be one of 'NONE' OR 'SIZE'`)
  })

  it('batchWrites data to a single table with options', () => {
    let result = TestTable.batchWriteParams(
      TestEntity.putBatch({ pk: 'test', sk: 'testsk', test: 'test'}),
      { capacity: 'total', metrics: 'size' }
    )
    expect(result.RequestItems['test-table'][0].PutRequest.Item.pk).toBe('test')
    expect(result.RequestItems['test-table'][0].PutRequest.Item.sk).toBe('testsk')
    expect(result.RequestItems['test-table'][0].PutRequest.Item.test).toBe('test')
    expect(result.ReturnConsumedCapacity).toBe('TOTAL')
    expect(result.ReturnItemCollectionMetrics).toBe('SIZE')
  })

  it('batchWrites data to a single table with invalid params', () => {
    let result = TestTable.batchWriteParams(
      TestEntity.putBatch({ pk: 'test', sk: 'testsk', test: 'test'}),
      {}, 'test'
    )
    expect(result.RequestItems['test-table'][0].PutRequest.Item.pk).toBe('test')
    expect(result.RequestItems['test-table'][0].PutRequest.Item.sk).toBe('testsk')
    expect(result.RequestItems['test-table'][0].PutRequest.Item.test).toBe('test')
  })

  xit('returns meta data', () => { // FIXME this is not used. should keep this.?
    let result = TestTable.batchWriteParams(
      TestEntity.putBatch({ pk: 'test', sk: 'testsk', test: 'test'}),
      {},null,true
    )

    expect(result.payload.RequestItems['test-table'][0].PutRequest.Item.pk).toBe('test')
    expect(result.payload.RequestItems['test-table'][0].PutRequest.Item.sk).toBe('testsk')
    expect(result.payload.RequestItems['test-table'][0].PutRequest.Item.test).toBe('test')
    expect(result).toHaveProperty('Tables')
  })

  it('batchWrites data to a single table with multiple items', () => {
    let result = TestTable.batchWriteParams([
      TestEntity.putBatch({ pk: 'test', sk: 'testsk1', test: 'test1' }),
      TestEntity.putBatch({ pk: 'test', sk: 'testsk2', test: 'test2' }),
      TestEntity.deleteBatch({ pk: 'test', sk: 'testsk3' })
    ])    
    expect(result.RequestItems['test-table'][0].PutRequest.Item.pk).toBe('test')
    expect(result.RequestItems['test-table'][0].PutRequest.Item.sk).toBe('testsk1')
    expect(result.RequestItems['test-table'][0].PutRequest.Item.test).toBe('test1')
    expect(result.RequestItems['test-table'][1].PutRequest.Item.pk).toBe('test')
    expect(result.RequestItems['test-table'][1].PutRequest.Item.sk).toBe('testsk2')
    expect(result.RequestItems['test-table'][1].PutRequest.Item.test).toBe('test2')
    expect(result.RequestItems['test-table'][2].DeleteRequest.Key.pk).toBe('test')
    expect(result.RequestItems['test-table'][2].DeleteRequest.Key.sk).toBe('testsk3')
  })

  it('batchWrites data to multiple tables', () => {

    const TestTable2 = new Table({
      name: 'test-table2',
      alias: 'testTable2',
      partitionKey: 'pk',
      sortKey: 'sk',
      indexes: { GSI1: { partitionKey: 'GSI1pk', sortKey: 'GSIsk1' } },
      DocumentClient
    })
    
    const TestEntity2 = new Entity({
      name: 'TestEntity2',
      autoExecute: false,
      attributes: {
        email: { type: 'string', partitionKey: true },
        sort: { type: 'string', sortKey: true },
        test: 'string'
      },
      table: TestTable2
    })

    let result = TestTable.batchWriteParams([
      TestEntity.putBatch({ pk: 'test', sk: 'testsk1', test: 'test1' }),
      TestEntity.putBatch({ pk: 'test', sk: 'testsk2', test: 'test2' }),
      TestEntity2.putBatch({ pk: 'test', sk: 'testsk3', test: 'test3' })
    ])
    // console.log(JSON.stringify(result,null,2));
    
    expect(result.RequestItems['test-table'][0].PutRequest.Item.pk).toBe('test')
    expect(result.RequestItems['test-table'][0].PutRequest.Item.sk).toBe('testsk1')
    expect(result.RequestItems['test-table'][0].PutRequest.Item.test).toBe('test1')
    expect(result.RequestItems['test-table'][1].PutRequest.Item.pk).toBe('test')
    expect(result.RequestItems['test-table'][1].PutRequest.Item.sk).toBe('testsk2')
    expect(result.RequestItems['test-table'][1].PutRequest.Item.test).toBe('test2')
    expect(result.RequestItems['test-table2'][0].PutRequest.Item.pk).toBe('test')
    expect(result.RequestItems['test-table2'][0].PutRequest.Item.sk).toBe('testsk3')
    expect(result.RequestItems['test-table2'][0].PutRequest.Item.test).toBe('test3')

  })

})
