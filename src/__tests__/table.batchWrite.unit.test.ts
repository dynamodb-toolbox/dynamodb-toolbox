import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { Table, Entity } from '../index'
import { DocumentClient as docClient } from './bootstrap.test'

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
} as const)

describe('batchWrite', () => {
  it('fails when batchWrite is empty', () => {
    expect(() => {
      // @ts-expect-error
      TestTable.batchWriteParams()
    }).toThrow(`No items supplied`)
  })

  it('fails when batchWrite items is an empty array', () => {
    expect(() => {
      TestTable.batchWriteParams([])
    }).toThrow(`No items supplied`)
  })

  it('batchWrites data to a single table', () => {
    const result = TestTable.batchWriteParams(
      TestEntity.putBatch({ email: 'test', sort: 'testsk', test: 'test' })
    ) as DocumentClient.BatchWriteItemInput
    expect(result.RequestItems['test-table'][0].PutRequest!.Item.pk).toBe('test')
    expect(result.RequestItems['test-table'][0].PutRequest!.Item.sk).toBe('testsk')
    expect(result.RequestItems['test-table'][0].PutRequest!.Item.test).toBe('test')
  })

  it('fails when extra options', () => {
    expect(() => {
      TestTable.batchWriteParams(
        TestEntity.putBatch({ email: 'test', sort: 'testsk' }),
        // @ts-expect-error
        { invalid: true }
      )
    }).toThrow(`Invalid batchWrite options: invalid`)
  })

  it('fails when providing an invalid capacity setting', () => {
    expect(() => {
      TestTable.batchWriteParams(TestEntity.putBatch({ email: 'test', sort: 'testsk' }), {
        capacity: 'test'
      })
    }).toThrow(`'capacity' must be one of 'NONE','TOTAL', OR 'INDEXES'`)
  })

  it('fails when providing an invalid metrics setting', () => {
    expect(() => {
      TestTable.batchWriteParams(TestEntity.putBatch({ email: 'test', sort: 'testsk' }), {
        metrics: 'test'
      })
    }).toThrow(`'metrics' must be one of 'NONE' OR 'SIZE'`)
  })

  it('batchWrites data to a single table with options', () => {
    const result = TestTable.batchWriteParams(
      TestEntity.putBatch({ email: 'test', sort: 'testsk', test: 'test' }),
      { capacity: 'total', metrics: 'size' }
    ) as DocumentClient.BatchWriteItemInput
    expect(result.RequestItems['test-table'][0].PutRequest!.Item.pk).toBe('test')
    expect(result.RequestItems['test-table'][0].PutRequest!.Item.sk).toBe('testsk')
    expect(result.RequestItems['test-table'][0].PutRequest!.Item.test).toBe('test')
    expect(result.ReturnConsumedCapacity).toBe('TOTAL')
    expect(result.ReturnItemCollectionMetrics).toBe('SIZE')
  })

  it('batchWrites data to a single table with invalid params', () => {
    const result = TestTable.batchWriteParams(
      TestEntity.putBatch({ email: 'test', sort: 'testsk', test: 'test' }),
      {},
      // @ts-expect-error
      'test'
    ) as DocumentClient.BatchWriteItemInput
    expect(result.RequestItems['test-table'][0].PutRequest!.Item.pk).toBe('test')
    expect(result.RequestItems['test-table'][0].PutRequest!.Item.sk).toBe('testsk')
    expect(result.RequestItems['test-table'][0].PutRequest!.Item.test).toBe('test')
  })

  it('returns meta data', () => {
    const result = TestTable.batchWriteParams(
      TestEntity.putBatch({ email: 'test', sort: 'testsk', test: 'test' }),
      {},
      {},
      true
    ) as { payload: DocumentClient.BatchWriteItemInput; Tables: any }

    expect(result.payload.RequestItems['test-table'][0].PutRequest!.Item.pk).toBe('test')
    expect(result.payload.RequestItems['test-table'][0].PutRequest!.Item.sk).toBe('testsk')
    expect(result.payload.RequestItems['test-table'][0].PutRequest!.Item.test).toBe('test')
    expect(result).toHaveProperty('Tables')
  })

  it('batchWrites data to a single table with multiple items', () => {
    const result = TestTable.batchWriteParams([
      TestEntity.putBatch({ email: 'test', sort: 'testsk1', test: 'test1' }),
      TestEntity.putBatch({ email: 'test', sort: 'testsk2', test: 'test2' }),
      TestEntity.deleteBatch({ email: 'test', sort: 'testsk3' })
    ]) as DocumentClient.BatchWriteItemInput
    expect(result.RequestItems['test-table'][0].PutRequest!.Item.pk).toBe('test')
    expect(result.RequestItems['test-table'][0].PutRequest!.Item.sk).toBe('testsk1')
    expect(result.RequestItems['test-table'][0].PutRequest!.Item.test).toBe('test1')
    expect(result.RequestItems['test-table'][1].PutRequest!.Item.pk).toBe('test')
    expect(result.RequestItems['test-table'][1].PutRequest!.Item.sk).toBe('testsk2')
    expect(result.RequestItems['test-table'][1].PutRequest!.Item.test).toBe('test2')
    expect(result.RequestItems['test-table'][2].DeleteRequest!.Key.pk).toBe('test')
    expect(result.RequestItems['test-table'][2].DeleteRequest!.Key.sk).toBe('testsk3')
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
    } as const)

    const result = TestTable.batchWriteParams([
      TestEntity.putBatch({ email: 'test', sort: 'testsk1', test: 'test1' }),
      TestEntity.putBatch({ email: 'test', sort: 'testsk2', test: 'test2' }),
      TestEntity2.putBatch({ email: 'test', sort: 'testsk3', test: 'test3' })
    ]) as DocumentClient.BatchWriteItemInput
    // console.log(JSON.stringify(result,null,2));

    expect(result.RequestItems['test-table'][0].PutRequest!.Item.pk).toBe('test')
    expect(result.RequestItems['test-table'][0].PutRequest!.Item.sk).toBe('testsk1')
    expect(result.RequestItems['test-table'][0].PutRequest!.Item.test).toBe('test1')
    expect(result.RequestItems['test-table'][1].PutRequest!.Item.pk).toBe('test')
    expect(result.RequestItems['test-table'][1].PutRequest!.Item.sk).toBe('testsk2')
    expect(result.RequestItems['test-table'][1].PutRequest!.Item.test).toBe('test2')
    expect(result.RequestItems['test-table2'][0].PutRequest!.Item.pk).toBe('test')
    expect(result.RequestItems['test-table2'][0].PutRequest!.Item.sk).toBe('testsk3')
    expect(result.RequestItems['test-table2'][0].PutRequest!.Item.test).toBe('test3')
  })
})
