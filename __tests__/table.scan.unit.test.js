const { Table, Entity } = require('../index')

const MockDocumentClient = {
  scan: jest.fn(),
  query: jest.fn(),
  get: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  update: jest.fn(),
  options: {},
}

const TestTable = new Table({
  name: 'test-table',
  partitionKey: 'pk',
  sortKey: 'sk',
  indexes: { GSI1: { partitionKey: 'GSI1pk', sortKey: 'GSIsk1' } },
  DocumentClient: MockDocumentClient
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
      capacity: 'total',
      select: 'all_attributes',
      filters: { attr: 'test', eq: 'testFilter' },
      attributes: ['pk','sk','test'],
      startKey: { pk: 'test', sk: 'skVal2' },
      segments: 5,
      segment: 0,
      entity: 'TestEntity',
      autoExecute: true,
      autoParse: true
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
      { limit: 'test' }
    )).toThrow(`'limit' must be a positive integer`)
  })

  it('fails on invalid consistent setting', () => {
    expect(() => TestTable.scanParams(
      { consistent: 'test' }
    )).toThrow(`'consistent' requires a boolean`)
  })

  it('fails on invalid select setting', () => {
    expect(() => TestTable.scanParams(
      { select: 'test' }
    )).toThrow(`'select' must be one of 'ALL_ATTRIBUTES', 'ALL_PROJECTED_ATTRIBUTES', 'SPECIFIC_ATTRIBUTES', OR 'COUNT'`)
  })

  it('fails on invalid capacity setting', () => {
    expect(() => TestTable.scanParams(
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
      { segments: 'test' }
    )).toThrow(`'segments' must be an integer greater than 1`)
  })

  it('fails on invalid segment', () => {
    expect(() => TestTable.scanParams(
      { segment: 'test' }
    )).toThrow(`segment' must be an integer greater than or equal to 0 and less than the total number of segments`)
  })

  it('fails if both segments and segment are not included', () => {
    expect(() => TestTable.scanParams(
      { segments: 10 }
    )).toThrow(`Both 'segments' and 'segment' must be provided`)
  })

  it('fails on invalid autoExecute setting', () => {
    expect(() => TestTable.scanParams(
      { autoExecute: 'test' }
    )).toThrow(`'autoExecute' requires a boolean`)
  })

  it('fails on invalid autoParse setting', () => {
    expect(() => TestTable.scanParams(
      { autoParse: 'test' }
    )).toThrow(`'autoParse' requires a boolean`)
  })

  it('doesn\'t parse result if autoParse is false', async () => {
    const mockResponse = {
      Items: [{
        email: 'test@email.com', sort: 'yes', test: 'true', _et: 'TestEntity'
      }]
    }
    jest.spyOn(TestEntity, 'parse')
    MockDocumentClient.scan.mockImplementationOnce(
      () => ({ promise: () => Promise.resolve(mockResponse) })
    )
    const res = await TestTable.scan({ autoParse: false })
    expect(res).toEqual(mockResponse)
    expect(TestEntity.parse).not.toHaveBeenCalled()
  })

})
