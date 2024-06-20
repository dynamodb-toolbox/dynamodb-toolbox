import { BatchWriteCommandInput } from '@aws-sdk/lib-dynamodb'
import { Entity, Table } from '../index.js'
import { DocumentClient as docClient } from './bootstrap.test.js'
import assert from 'assert'

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
  test('fails when batchWrite is empty', () => {
    expect(() => {
      // @ts-expect-error
      TestTable.batchWriteParams()
    }).toThrow(`No items supplied`)
  })

  test('fails when batchWrite items is an empty array', () => {
    expect(() => {
      TestTable.batchWriteParams([])
    }).toThrow(`No items supplied`)
  })

  test('batchWrites data to a single table', () => {
    const result = TestTable.batchWriteParams(
      TestEntity.putBatch({ email: 'test', sort: 'testsk', test: 'test' })
    ) as BatchWriteCommandInput

    assert.ok(
      result?.RequestItems?.['test-table']?.[0]?.PutRequest?.Item !== undefined,
      'PutRequest.Item is undefined'
    )
    expect(result.RequestItems['test-table'][0].PutRequest.Item.pk).toBe('test')
    expect(result.RequestItems['test-table'][0].PutRequest.Item.sk).toBe('testsk')
    expect(result.RequestItems['test-table'][0].PutRequest.Item.test).toBe('test')
  })

  test('fails when extra options', () => {
    expect(() => {
      TestTable.batchWriteParams(
        TestEntity.putBatch({ email: 'test', sort: 'testsk' }),
        // @ts-expect-error
        { invalid: true }
      )
    }).toThrow(`Invalid batchWrite options: invalid`)
  })

  test('fails when providing an invalid capacity setting', () => {
    expect(() => {
      TestTable.batchWriteParams(TestEntity.putBatch({ email: 'test', sort: 'testsk' }), {
        // @ts-expect-error
        capacity: 'test'
      })
    }).toThrow(`'capacity' must be one of 'NONE','TOTAL', OR 'INDEXES'`)
  })

  test('fails when providing an invalid metrics setting', () => {
    expect(() => {
      TestTable.batchWriteParams(TestEntity.putBatch({ email: 'test', sort: 'testsk' }), {
        // @ts-expect-error
        metrics: 'test'
      })
    }).toThrow(`'metrics' must be one of 'NONE' OR 'SIZE'`)
  })

  test('batchWrites data to a single table with options', () => {
    const result = TestTable.batchWriteParams(
      TestEntity.putBatch({ email: 'test', sort: 'testsk', test: 'test' }),
      { capacity: 'total', metrics: 'size' }
    ) as BatchWriteCommandInput

    expect(result.ReturnConsumedCapacity).toBe('TOTAL')
    expect(result.ReturnItemCollectionMetrics).toBe('SIZE')

    expect(result.RequestItems?.['test-table']?.[0]?.PutRequest?.Item).toEqual(
      expect.objectContaining({
        pk: 'test',
        sk: 'testsk',
        test: 'test'
      })
    )
  })

  test('batchWrites data to a single table with invalid params', () => {
    const result = TestTable.batchWriteParams(
      TestEntity.putBatch({ email: 'test', sort: 'testsk', test: 'test' }),
      {},
      // @ts-expect-error
      'test'
    ) as BatchWriteCommandInput

    expect(result.RequestItems?.['test-table']?.[0]?.PutRequest?.Item).toEqual(
      expect.objectContaining({
        pk: 'test',
        sk: 'testsk',
        test: 'test'
      })
    )
  })

  test('returns meta data', () => {
    const result = TestTable.batchWriteParams(
      TestEntity.putBatch({ email: 'test', sort: 'testsk', test: 'test' }),
      {},
      {},
      true
    ) as { payload: BatchWriteCommandInput; Tables: any }

    expect(result).toHaveProperty('Tables')
    expect(result.payload.RequestItems?.['test-table']?.[0]?.PutRequest?.Item).toEqual(
      expect.objectContaining({
        pk: 'test',
        sk: 'testsk',
        test: 'test'
      })
    )
  })

  test('batchWrites data to a single table with multiple items', () => {
    const result = TestTable.batchWriteParams([
      TestEntity.putBatch({ email: 'test', sort: 'testsk1', test: 'test1' }),
      TestEntity.putBatch({ email: 'test', sort: 'testsk2', test: 'test2' }),
      TestEntity.deleteBatch({ email: 'test', sort: 'testsk3' })
    ]) as BatchWriteCommandInput

    expect(result.RequestItems?.['test-table']?.[0]?.PutRequest?.Item).toEqual(
      expect.objectContaining({
        pk: 'test',
        sk: 'testsk1',
        test: 'test1'
      })
    )
    expect(result.RequestItems?.['test-table']?.[1]?.PutRequest?.Item).toEqual(
      expect.objectContaining({
        pk: 'test',
        sk: 'testsk2',
        test: 'test2'
      })
    )
    expect(result.RequestItems?.['test-table']?.[2]?.DeleteRequest?.Key).toEqual(
      expect.objectContaining({
        pk: 'test',
        sk: 'testsk3'
      })
    )
  })

  test('batchWrites data to multiple tables', () => {
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
    ]) as BatchWriteCommandInput

    expect(result.RequestItems?.['test-table']?.[0]?.PutRequest?.Item).toEqual(
      expect.objectContaining({
        pk: 'test',
        sk: 'testsk1',
        test: 'test1'
      })
    )
    expect(result.RequestItems?.['test-table']?.[1]?.PutRequest?.Item).toEqual(
      expect.objectContaining({
        pk: 'test',
        sk: 'testsk2',
        test: 'test2'
      })
    )
    expect(result.RequestItems?.['test-table2']?.[0]?.PutRequest?.Item).toEqual(
      expect.objectContaining({
        pk: 'test',
        sk: 'testsk3',
        test: 'test3'
      })
    )
  })
})
