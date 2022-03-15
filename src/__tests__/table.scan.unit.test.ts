import { Table, Entity } from '../index'
import { ddbDocClient as DocumentClient } from './bootstrap-tests'

const TestTable = new Table({
  name: 'test-table',
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

describe('scan',()=>{

  it('scans a table with no options', () => {
    let result = TestTable.scanParams()    
    expect(result).toEqual({
      TableName: 'test-table'
    })
  })

  it('scans a table with meta data', () => {
    let result = TestTable.scanParams({attributes:['pk']},{},true)
    expect(result).toEqual({
      payload: {
        TableName: 'test-table',
        ExpressionAttributeNames: { '#proj1': 'pk', '#proj2': '_et' },
        ProjectionExpression: '#proj1,#proj2'
      },
      EntityProjections: {},
      TableProjections: [ 'pk', '_et' ]
    })
  })

  it('scans a table and ignores bad parameters', () => {
    // @ts-expect-error
    let result = TestTable.scanParams({},'test')
    expect(result).toEqual({
      TableName: 'test-table'
    })
  })

  it('scans a table with options', () => {
    let result = TestTable.scanParams({ 
      index: 'GSI1',
      limit: 10,
      consistent: true,
      capacity: 'TOTAL',
      select: 'ALL_ATTRIBUTES',
      filters: { attr: 'test', eq: 'testFilter' },
      attributes: ['pk','sk','test'],
      startKey: { pk: 'test', sk: 'skVal2' },
      segments: 5,
      segment: 0,
      entity: 'TestEntity',
      execute: true,
      parse: true
    })    
    
    expect(result).toEqual({
      TableName: 'test-table',
      ExpressionAttributeNames: {
        '#attr1': 'test',
        '#proj1': 'pk',
        '#proj2': 'sk',
        '#proj3': 'test',
        '#proj4': '_et'
      },
      ExpressionAttributeValues: { ':attr1': 'testFilter' },
      FilterExpression: '#attr1 = :attr1',
      ProjectionExpression: '#proj1,#proj2,#proj3,#proj4',
      IndexName: 'GSI1',
      TotalSegments: 5,
      Segment: 0,
      Limit: '10',
      ConsistentRead: true,
      ReturnConsumedCapacity: 'TOTAL',
      Select: 'ALL_ATTRIBUTES',
      ExclusiveStartKey: { pk: 'test', sk: 'skVal2' }
    })
    // console.log(result);
  })

  it('fails on an invalid option', () => {
    expect(() => TestTable.scanParams(
      // @ts-expect-error
      { invalidParam: true }
    )).toThrow('Invalid scan options: invalidParam')
  })

  it('fails on an invalid index', () => {
    expect(() => TestTable.scanParams(
      { index: 'test' }
    )).toThrow(`'test' is not a valid index name`)
  })

  it('fails on an invalid limit', () => {
    expect(() => TestTable.scanParams(
      // @ts-expect-error
      { limit: 'test' }
    )).toThrow(`'limit' must be a positive integer`)
  })

  it('fails on invalid consistent setting', () => {
    expect(() => TestTable.scanParams(
      // @ts-expect-error
      { consistent: 'test' }
    )).toThrow(`'consistent' requires a boolean`)
  })

  it('fails on invalid select setting', () => {
    expect(() => TestTable.scanParams(
      // @ts-expect-error
      { select: 'test' }
    )).toThrow(`'select' must be one of 'ALL_ATTRIBUTES', 'ALL_PROJECTED_ATTRIBUTES', 'SPECIFIC_ATTRIBUTES', OR 'COUNT'`)
  })

  it('fails on invalid capacity setting', () => {
    expect(() => TestTable.scanParams(
      // @ts-expect-error
      { capacity: 'test' }
    )).toThrow(`'capacity' must be one of 'NONE','TOTAL', OR 'INDEXES'`)
  })

  it('fails on invalid entity', () => {
    expect(() => TestTable.scanParams(
      { entity: 'test' }
    )).toThrow(`'entity' must be a string and a valid table Entity name`)
  })

  it('fails on invalid startKey', () => {
    expect(() => TestTable.scanParams(
      { startKey: 'test' }
    )).toThrow(`'startKey' requires a valid object`)
  })

  it('fails on invalid segments', () => {
    expect(() => TestTable.scanParams(
      // @ts-expect-error
      { segments: 'test' }
    )).toThrow(`'segments' must be an integer greater than 1`)
  })

  it('fails on invalid segment', () => {
    expect(() => TestTable.scanParams(
      // @ts-expect-error
      { segment: 'test' }
    )).toThrow(`segment' must be an integer greater than or equal to 0 and less than the total number of segments`)
  })

  it('fails if both segments and segment are not included', () => {
    expect(() => TestTable.scanParams(
      { segments: 10 }
    )).toThrow(`Both 'segments' and 'segment' must be provided`)
  })

  

})
