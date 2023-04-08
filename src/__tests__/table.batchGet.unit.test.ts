import { Table, Entity } from '../index'
import { DocumentClient } from './bootstrap.test'

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

describe('batchGet', () => {
  it('fails when batchGet is empty', () => {
    expect(() => {
      // @ts-expect-error
      TestTable.batchGetParams()
    }).toThrow(`Item references must contain a valid Table object and Key`)
  })

  it('fails when batchGet items is an empty array', () => {
    expect(() => {
      TestTable.batchGetParams([])
    }).toThrow(`No items supplied`)
  })

  it('batchGets data from a single table', () => {
    const result = TestTable.batchGetParams(TestEntity.getBatch({ email: 'test', sort: 'testsk' }))
    expect(result).toEqual({
      RequestItems: { 'test-table': { Keys: [{ pk: 'test', sk: 'testsk' }] } }
    })
  })

  it('fails when extra options', () => {
    expect(() => {
      TestTable.batchGetParams(
        TestEntity.getBatch({ email: 'test', sort: 'testsk' }),
        // @ts-expect-error
        { invalid: true }
      )
    }).toThrow(`Invalid batchGet options: invalid`)
  })

  it('fails when providing an invalid capactiy setting', () => {
    expect(() => {
      TestTable.batchGetParams(TestEntity.getBatch({ email: 'test', sort: 'testsk' }), {
        // @ts-expect-error
        capacity: 'test'
      })
    }).toThrow(`'capacity' must be one of 'NONE','TOTAL', OR 'INDEXES'`)
  })

  it('add consistent flag', () => {
    const result = TestTable.batchGetParams(
      TestEntity.getBatch({ email: 'test', sort: 'testsk' }),
      {
        consistent: true
      }
    )
    expect(result).toEqual({
      RequestItems: { 'test-table': { ConsistentRead: true, Keys: [{ pk: 'test', sk: 'testsk' }] } }
    })
  })

  it('add consistent flag across multiple tables', () => {
    const TestTable2 = new Table({
      name: 'test-table2',
      partitionKey: 'pk',
      sortKey: 'sk',
      indexes: { GSI1: { partitionKey: 'GSI1pk', sortKey: 'GSIsk1' } },
      DocumentClient
    })

    const TestEntity2 = new Entity({
      name: 'TestEntity',
      autoExecute: false,
      attributes: {
        email: { type: 'string', partitionKey: true },
        sort: { type: 'string', sortKey: true },
        test: 'string'
      },
      table: TestTable2
    } as const)

    const result = TestTable.batchGetParams(
      [
        TestEntity.getBatch({ email: 'test', sort: 'testsk' }),
        TestEntity2.getBatch({ email: 'test', sort: 'testsk' })
      ],
      { consistent: { testTable: true, 'test-table2': false } }
    )

    expect(result).toEqual({
      RequestItems: {
        'test-table': { Keys: [{ pk: 'test', sk: 'testsk' }], ConsistentRead: true },
        'test-table2': { Keys: [{ pk: 'test', sk: 'testsk' }], ConsistentRead: false }
      }
    })
  })

  it('fails on invalid consistent setting in object', () => {
    const TestTable2 = new Table({
      name: 'test-table2',
      partitionKey: 'pk',
      sortKey: 'sk',
      indexes: { GSI1: { partitionKey: 'GSI1pk', sortKey: 'GSIsk1' } },
      DocumentClient
    })

    const TestEntity2 = new Entity({
      name: 'TestEntity',
      autoExecute: false,
      attributes: {
        email: { type: 'string', partitionKey: true },
        sort: { type: 'string', sortKey: true },
        test: 'string'
      },
      table: TestTable2
    } as const)

    expect(() => {
      TestTable.batchGetParams(
        [
          TestEntity.getBatch({ email: 'test', sort: 'testsk' }),
          TestEntity2.getBatch({ email: 'test', sort: 'testsk' })
        ],
        // @ts-expect-error
        { consistent: { testTable: true, 'test-table2': 'test' } }
      )
    }).toThrow(`'consistent' values must be booleans (test-table2)`)
  })

  it('fails on consistent setting for unreferenced table', () => {
    expect(() => {
      TestTable.batchGetParams(
        [TestEntity.getBatch({ email: 'test', sort: 'testsk' })],
        // @ts-expect-error
        { consistent: { testTable: true, 'test-table2': 'test' } }
      )
    }).toThrow(`There are no items for the table or table alias: test-table2`)
  })

  // it('add consistent flag', () => {
  //   let result = TestTable.batchGet(
  //     TestEntity.getBatch({ pk: 'test', sk: 'testsk'}),
  //     { consistent: true, execute: false,  attributes: [{ 'TestEntity': ['pk','sk'] }] }
  //   )
  //   // expect(result).toEqual({ RequestItems: { 'test-table': { ConsistentRead: true, Keys: [ { pk: 'test', sk: 'testsk' } ] } } })
  // })
})
