import { Entity, Table } from '../index.js'
import { DocumentClient } from './bootstrap.test.js'

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
    email: { type: 'string', partitionKey: true, hidden: true },
    sort: { type: 'string', sortKey: true, hidden: true },
    test: 'string',
    testSet: { type: 'set' }
  },
  table: TestTable
} as const)

describe('scan', () => {
  beforeEach(() => {
    vi.spyOn<any, any>(DocumentClient, 'send').mockResolvedValue({
      Items: [
        {
          pk: 'test-pk',
          sk: 'test-sk',
          test: 'some-string',
          testSet: new Set(['test1', 'test2']),
          _et: 'TestEntity'
        }
      ],
      LastEvaluatedKey: null
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  test('scans a table with no options', () => {
    const result = TestTable.scanParams()
    expect(result).toEqual({
      TableName: 'test-table'
    })
  })

  test('scans a table with meta data', () => {
    const result = TestTable.scanParams({ attributes: ['pk'] }, {}, true)
    expect(result).toEqual({
      payload: {
        TableName: 'test-table',
        ExpressionAttributeNames: { '#proj1': 'pk', '#proj2': '_et' },
        ProjectionExpression: '#proj1,#proj2'
      },
      EntityProjections: {},
      TableProjections: ['pk', '_et']
    })
  })

  test('scans a table and ignores bad parameters', () => {
    // @ts-expect-error
    const result = TestTable.scanParams({}, 'test')
    expect(result).toEqual({
      TableName: 'test-table'
    })
  })

  test('scans a table with options', () => {
    const result = TestTable.scanParams({
      index: 'GSI1',
      limit: 10,
      consistent: true,
      capacity: 'total',
      select: 'all_attributes',
      filters: { attr: 'test', eq: 'testFilter' },
      attributes: ['pk', 'sk', 'test'],
      startKey: { pk: 'test', sk: 'skVal2' },
      segments: 5,
      segment: 0,
      entity: TestEntity.name,
      execute: true,
      parse: true,
      parseAsEntity: TestEntity.name
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
      Limit: 10,
      ConsistentRead: true,
      ReturnConsumedCapacity: 'TOTAL',
      Select: 'ALL_ATTRIBUTES',
      ExclusiveStartKey: { pk: 'test', sk: 'skVal2' }
    })
    // console.log(result);
  })

  test('fails on an invalid option', () => {
    expect(() =>
      TestTable.scanParams(
        // @ts-expect-error
        { invalidParam: true }
      )
    ).toThrow('Invalid scan options: invalidParam')
  })

  test('fails on an invalid index', () => {
    expect(() => TestTable.scanParams({ index: 'test' })).toThrow(
      `'test' is not a valid index name`
    )
  })

  test('fails on an invalid limit', () => {
    expect(() =>
      TestTable.scanParams(
        // @ts-expect-error
        { limit: 'test' }
      )
    ).toThrow(`'limit' must be a positive integer`)
  })

  test('fails on invalid consistent setting', () => {
    expect(() =>
      TestTable.scanParams(
        // @ts-expect-error
        { consistent: 'test' }
      )
    ).toThrow(`'consistent' requires a boolean`)
  })

  test('fails on invalid select setting', () => {
    // @ts-expect-error
    expect(() => TestTable.scanParams({ select: 'test' })).toThrow(
      `'select' must be one of 'ALL_ATTRIBUTES', 'ALL_PROJECTED_ATTRIBUTES', 'SPECIFIC_ATTRIBUTES', OR 'COUNT'`
    )
  })

  test('fails on invalid capacity setting', () => {
    // @ts-expect-error
    expect(() => TestTable.scanParams({ capacity: 'test' })).toThrow(
      `'capacity' must be one of 'NONE','TOTAL', OR 'INDEXES'`
    )
  })

  test('fails on invalid entity', () => {
    expect(() => TestTable.scanParams({ entity: 'test' })).toThrow(
      `'entity' must be a string and a valid table Entity name`
    )
  })

  test('fails on invalid startKey', () => {
    expect(() => TestTable.scanParams({ startKey: 'test' })).toThrow(
      `'startKey' requires a valid object`
    )
  })

  test('fails on invalid segments', () => {
    expect(() =>
      TestTable.scanParams(
        // @ts-expect-error
        { segments: 'test' }
      )
    ).toThrow(`'segments' must be an integer greater than 1`)
  })

  test('fails on invalid segment', () => {
    expect(() =>
      TestTable.scanParams(
        // @ts-expect-error
        { segment: 'test' }
      )
    ).toThrow(
      `segment' must be an integer greater than or equal to 0 and less than the total number of segments`
    )
  })

  test('fails if both segments and segment are not included', () => {
    expect(() => TestTable.scanParams({ segments: 10 })).toThrow(
      `Both 'segments' and 'segment' must be provided`
    )
  })

  test('transforms a set into an array when parse is true', async () => {
    const result = await TestEntity.scan({
      parse: true
    })

    expect(result).toEqual({
      Items: [
        expect.objectContaining({
          testSet: ['test1', 'test2'],
          entity: 'TestEntity'
        })
      ],
      LastEvaluatedKey: null
    })
  })

  test('returns a set as is when parse is false', async () => {
    const result = await TestEntity.scan({
      parse: false
    })

    expect(result).toEqual({
      Items: [
        expect.objectContaining({
          testSet: new Set(['test1', 'test2']),
          _et: 'TestEntity'
        })
      ],
      LastEvaluatedKey: null
    })
  })

  test('should not return hidden properties', async () => {
    const result = await TestEntity.scan()

    expect(result).toEqual({
      Items: [
        {
          test: 'some-string',
          entity: 'TestEntity',
          testSet: ['test1', 'test2']
        }
      ],
      LastEvaluatedKey: null
    })
  })
})
