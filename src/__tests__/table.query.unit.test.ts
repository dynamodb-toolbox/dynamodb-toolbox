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

describe('query',()=>{

  it('queries a table with no options', async () => {
    let result = await TestTable.query('test',{ execute: false })
    expect(result).toEqual({
      TableName: 'test-table',
      KeyConditionExpression: '#pk = :pk',
      ExpressionAttributeNames: { '#pk': 'pk' },
      ExpressionAttributeValues: { ':pk': 'test' }
    })
  })

  it('queries a table with no options using numeric pk', () => {
    let result = TestTable.queryParams(1)
    expect(result).toEqual({
      TableName: 'test-table',
      KeyConditionExpression: '#pk = :pk',
      ExpressionAttributeNames: { '#pk': 'pk' },
      ExpressionAttributeValues: { ':pk': 1 }
    })
  })

  it('queries a table with projections', () => {
    let result = TestTable.queryParams('test',{attributes:['pk']},{},true)
    expect(result).toEqual({
      payload: {
        TableName: 'test-table',
        KeyConditionExpression: '#pk = :pk',
        ExpressionAttributeNames: { '#pk': 'pk', '#proj1': 'pk', '#proj2': '_et' },
        ExpressionAttributeValues: { ':pk': 'test' },
        ProjectionExpression: '#proj1,#proj2'
      },
      EntityProjections: {},
      TableProjections: [ 'pk', '_et' ]
    })
  })

  it('queries a table and ignores bad parameters', () => {
    // @ts-expect-error
    let result = TestTable.queryParams('test',{},'test')
    expect(result).toEqual({
      TableName: 'test-table',
      KeyConditionExpression: '#pk = :pk',
      ExpressionAttributeNames: { '#pk': 'pk' },
      ExpressionAttributeValues: { ':pk': 'test' }
    })
  })

  it('queries a table with options', () => {
    let result = TestTable.queryParams('test', { 
      index: 'GSI1',
      limit: 10,
      reverse: true,
      consistent: true,
      capacity: 'TOTAL',
      select: 'ALL_ATTRIBUTES',
      eq: 'skVal',
      filters: { attr: 'test', eq: 'testFilter' },
      attributes: ['pk','sk','test'],
      startKey: { pk: 'test', sk: 'skVal2' },
      entity: 'TestEntity',
      execute: true,
      parse: true
    })
    expect(result).toEqual( {
      TableName: 'test-table',
      KeyConditionExpression: '#pk = :pk and #sk = :sk',
      ExpressionAttributeNames: {
        '#pk': 'GSI1pk',
        '#sk': 'GSIsk1',
        '#attr1': 'test',
        '#proj1': 'pk',
        '#proj2': 'sk',
        '#proj3': 'test',
        '#proj4': '_et'
      },
      ExpressionAttributeValues: { ':pk': 'test', ':sk': 'skVal', ':attr1': 'testFilter' },
      FilterExpression: '#attr1 = :attr1',
      ProjectionExpression: '#proj1,#proj2,#proj3,#proj4',
      IndexName: 'GSI1',
      Limit: '10',
      ScanIndexForward: false,
      ConsistentRead: true,
      ReturnConsumedCapacity: 'TOTAL',
      Select: 'ALL_ATTRIBUTES',
      ExclusiveStartKey: { pk: 'test', sk: 'skVal2' }
    })
    // console.log(result);
  })

  it('fails on an invalid option', () => {
    expect(() => TestTable.queryParams('test',
      // @ts-expect-error
      { invalidParam: true }
    )).toThrow('Invalid query options: invalidParam')
  })

  it('fails on an invalid partionKey', () => {
    // @ts-expect-error
    expect(() => TestTable.queryParams())
      .toThrow(`Query requires a string, number or binary 'partitionKey' as its first parameter`)
  })

  it('fails on an invalid index', () => {
    expect(() => TestTable.queryParams('test',
      { index: 'test' }
    )).toThrow(`'test' is not a valid index name`)
  })

  it('fails on an invalid limit', () => {
    expect(() => TestTable.queryParams('test',
      // @ts-expect-error
      { limit: 'test' }
    )).toThrow(`'limit' must be a positive integer`)
  })

  it('fails on invalid reverse setting', () => {
    expect(() => TestTable.queryParams('test',
      // @ts-expect-error
      { reverse: 'test' }
    )).toThrow(`'reverse' requires a boolean`)
  })

  it('fails on invalid consistent setting', () => {
    expect(() => TestTable.queryParams('test',
      // @ts-expect-error
      { consistent: 'test' }
    )).toThrow(`'consistent' requires a boolean`)
  })

  it('fails on invalid select setting', () => {
    expect(() => TestTable.queryParams('test',
      // @ts-expect-error
      { select: 'test' }
    )).toThrow(`'select' must be one of 'ALL_ATTRIBUTES', 'ALL_PROJECTED_ATTRIBUTES', 'SPECIFIC_ATTRIBUTES', OR 'COUNT'`)
  })

  it('fails on invalid capacity setting', () => {
    expect(() => TestTable.queryParams('test',
      // @ts-expect-error
      { capacity: 'test' }
    )).toThrow(`'capacity' must be one of 'NONE','TOTAL', OR 'INDEXES'`)
  })

  it('fails on invalid entity', () => {
    expect(() => TestTable.queryParams('test',
      { entity: 'test' }
    )).toThrow(`'entity' must be a string and a valid table Entity name`)
  })

  it('fails on invalid startKey', () => {
    expect(() => TestTable.queryParams('test',
      { startKey: 'test' }
    )).toThrow(`'startKey' requires a valid object`)
  })

  it('queries a table with lt', () => {
    let result = TestTable.queryParams('test', { lt: 'val' })
    // console.log(result)
    expect(result).toEqual({
      TableName: 'test-table',
      KeyConditionExpression: '#pk = :pk and #sk < :sk',
      ExpressionAttributeNames: { '#pk': 'pk', '#sk': 'sk' },
      ExpressionAttributeValues: { ':pk': 'test', ':sk': 'val' }
    })
  })

  it('queries a table with lte', () => {
    let result = TestTable.queryParams('test', { lte: 'val' })
    // console.log(result)
    expect(result).toEqual({
      TableName: 'test-table',
      KeyConditionExpression: '#pk = :pk and #sk <= :sk',
      ExpressionAttributeNames: { '#pk': 'pk', '#sk': 'sk' },
      ExpressionAttributeValues: { ':pk': 'test', ':sk': 'val' }
    })
  })

  it('queries a table with gt', () => {
    let result = TestTable.queryParams('test', { gt: 'val' })
    // console.log(result)
    expect(result).toEqual({
      TableName: 'test-table',
      KeyConditionExpression: '#pk = :pk and #sk > :sk',
      ExpressionAttributeNames: { '#pk': 'pk', '#sk': 'sk' },
      ExpressionAttributeValues: { ':pk': 'test', ':sk': 'val' }
    })
  })

  it('queries a table with gte', () => {
    let result = TestTable.queryParams('test', { gte: 'val' })
    // console.log(result)
    expect(result).toEqual({
      TableName: 'test-table',
      KeyConditionExpression: '#pk = :pk and #sk >= :sk',
      ExpressionAttributeNames: { '#pk': 'pk', '#sk': 'sk' },
      ExpressionAttributeValues: { ':pk': 'test', ':sk': 'val' }
    })
  })

  it('queries a table with beginsWith', () => {
    let result = TestTable.queryParams('test', { beginsWith: 'val' })
    // console.log(result)
    expect(result).toEqual({
      TableName: 'test-table',
      KeyConditionExpression: '#pk = :pk and begins_with(#sk,:sk)',
      ExpressionAttributeNames: { '#pk': 'pk', '#sk': 'sk' },
      ExpressionAttributeValues: { ':pk': 'test', ':sk': 'val' }
    })
  })

  it('queries a table with between', () => {
    let result = TestTable.queryParams('test', { between: ['val','val1'] })
    // console.log(result)
    expect(result).toEqual({
      TableName: 'test-table',
      KeyConditionExpression: '#pk = :pk and #sk between :sk0 and :sk1',
      ExpressionAttributeNames: { '#pk': 'pk', '#sk': 'sk' },
      ExpressionAttributeValues: { ':pk': 'test', ':sk0': 'val', ':sk1': 'val1' }
    })
  })

  it('fails on multiple conditions (lt)', () => {
    expect(() => TestTable.queryParams('test',
      { eq: 'val', lt: 'val1' }
    )).toThrow(`You can only supply one sortKey condition per query. Already using 'eq'`)
  })

  it('fails on multiple conditions (lte)', () => {
    expect(() => TestTable.queryParams('test',
      { eq: 'val', lte: 'val1' }
    )).toThrow(`You can only supply one sortKey condition per query. Already using 'eq'`)
  })

  it('fails on multiple conditions (gt)', () => {
    expect(() => TestTable.queryParams('test',
      { eq: 'val', gt: 'val1' }
    )).toThrow(`You can only supply one sortKey condition per query. Already using 'eq'`)
  })

  it('fails on multiple conditions (gte)', () => {
    expect(() => TestTable.queryParams('test',
      { eq: 'val', gte: 'val1' }
    )).toThrow(`You can only supply one sortKey condition per query. Already using 'eq'`)
  })

  it('fails on multiple conditions (beginsWith)', () => {
    expect(() => TestTable.queryParams('test',
      { eq: 'val', beginsWith: 'val1' }
    )).toThrow(`You can only supply one sortKey condition per query. Already using 'eq'`)
  })

  it('fails on multiple conditions (between)', () => {
    expect(() => TestTable.queryParams('test',
      { eq: 'val', between: ['val1','val2'] }
    )).toThrow(`You can only supply one sortKey condition per query. Already using 'eq'`)
  })

  it('fails on in valid between condition', () => {
    expect(() => TestTable.queryParams('test',
      // @ts-expect-error
      { between: ['val1'] }
    )).toThrow(`'between' conditions requires an array with two values.`)
  })

})
