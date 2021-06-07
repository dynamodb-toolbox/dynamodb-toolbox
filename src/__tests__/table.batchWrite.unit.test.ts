import { BatchWriteCommandInput } from '@aws-sdk/lib-dynamodb'
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

describe('batchWrite',()=>{

  it('fails when batchWrite is empty', () => {
    // @ts-expect-error
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
    ) as BatchWriteCommandInput
    const item = result.RequestItems!['test-table'][0].PutRequest!.Item!
    expect(item.pk).toBe('test')
    expect(item.sk).toBe('testsk')
    expect(item.test).toBe('test')
  })

  it('fails when extra options', () => {
    expect(() => { TestTable.batchWriteParams(
      TestEntity.putBatch({ pk: 'test', sk: 'testsk'}),
      // @ts-expect-error
      { invalid: true }
    ) })
      .toThrow(`Invalid batchWrite options: invalid`)
  })

  it('fails when providing an invalid capacity setting', () => {
    expect(() => { TestTable.batchWriteParams(
      TestEntity.putBatch({ pk: 'test', sk: 'testsk'}),
      // @ts-expect-error
      { capacity: 'test' }
    ) })
      .toThrow(`'capacity' must be one of 'NONE','TOTAL', OR 'INDEXES'`)
  })

  it('fails when providing an invalid metrics setting', () => {
    expect(() => { TestTable.batchWriteParams(
      TestEntity.putBatch({ pk: 'test', sk: 'testsk'}),
      // @ts-expect-error
      { metrics: 'test' }
    ) })
      .toThrow(`'metrics' must be one of 'NONE' OR 'SIZE'`)
  })

  it('batchWrites data to a single table with options', () => {
    let result = TestTable.batchWriteParams(
      TestEntity.putBatch({ pk: 'test', sk: 'testsk', test: 'test'}),
      // @ts-expect-error
      { capacity: 'total', metrics: 'size' }
    ) as BatchWriteCommandInput
    const item = result.RequestItems!['test-table'][0].PutRequest!.Item!
    expect(item.pk).toBe('test')
    expect(item.sk).toBe('testsk')
    expect(item.test).toBe('test')
    expect(result.ReturnConsumedCapacity).toBe('TOTAL')
    expect(result.ReturnItemCollectionMetrics).toBe('SIZE')
  })

  it('batchWrites data to a single table with invalid params', () => {
    let result = TestTable.batchWriteParams(
      TestEntity.putBatch({ pk: 'test', sk: 'testsk', test: 'test'}),
      // @ts-expect-error
      {}, 'test'
    ) as BatchWriteCommandInput
    const item = result.RequestItems!['test-table'][0].PutRequest!.Item!
    expect(item.pk).toBe('test')
    expect(item.sk).toBe('testsk')
    expect(item.test).toBe('test')
  })

  it('returns meta data', () => {
    let result = TestTable.batchWriteParams(
      TestEntity.putBatch({ pk: 'test', sk: 'testsk', test: 'test'}),
      {},{},true
    ) as { payload: BatchWriteCommandInput, Tables: any }

    const item = result.payload.RequestItems!['test-table'][0].PutRequest!.Item!
    expect(item.pk).toBe('test')
    expect(item.sk).toBe('testsk')
    expect(item.test).toBe('test')
    expect(result).toHaveProperty('Tables')
  })

  it('batchWrites data to a single table with multiple items', () => {
    let result = TestTable.batchWriteParams([
      TestEntity.putBatch({ pk: 'test', sk: 'testsk1', test: 'test1' }),
      TestEntity.putBatch({ pk: 'test', sk: 'testsk2', test: 'test2' }),
      TestEntity.deleteBatch({ pk: 'test', sk: 'testsk3' })
    ]) as BatchWriteCommandInput
    const item1 = result.RequestItems!['test-table'][0].PutRequest!.Item!
    const item2 = result.RequestItems!['test-table'][1].PutRequest!.Item!
    const key = result.RequestItems!['test-table'][2].DeleteRequest!.Key!
    expect(item1.pk).toBe('test')
    expect(item1.sk).toBe('testsk1')
    expect(item1.test).toBe('test1')
    expect(item2.pk).toBe('test')
    expect(item2.sk).toBe('testsk2')
    expect(item2.test).toBe('test2')
    expect(key.pk).toBe('test')
    expect(key.sk).toBe('testsk3')
  })

  it('batchWrites data to multiple tables', () => {

    const TestTable2 = new Table({
      name: 'test-table2',
      alias: 'testTable2',
      partitionKey: 'pk',
      sortKey: 'sk',
      indexes: { GSI1: { partitionKey: 'GSI1pk', sortKey: 'GSIsk1' } },
      DocumentClient: docClient
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
    ]) as BatchWriteCommandInput
    // console.log(JSON.stringify(result,null,2));
    
    const item1 = result.RequestItems!['test-table'][0].PutRequest!.Item!
    const item2 = result.RequestItems!['test-table'][1].PutRequest!.Item!
    const item3 = result.RequestItems!['test-table2'][0].PutRequest!.Item!
    expect(item1.pk).toBe('test')
    expect(item1.sk).toBe('testsk1')
    expect(item1.test).toBe('test1')
    expect(item2.pk).toBe('test')
    expect(item2.sk).toBe('testsk2')
    expect(item2.test).toBe('test2')
    expect(item3.pk).toBe('test')
    expect(item3.sk).toBe('testsk3')
    expect(item3.test).toBe('test3')
  })

})
