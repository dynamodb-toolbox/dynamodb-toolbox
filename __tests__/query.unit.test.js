const { Model } = require('../index')

// Define main model for testing
const TestModel = new Model('TestModel',require('./models/test-model'))

describe('query',()=>{
  it('handles a basic partionKey query', () => {
    const params = TestModel.query('testPK')
    expect(params).toMatchObject({ 
      TableName: 'test-table',
      ConsistentRead: false,
      KeyConditionExpression: '#pk = :pk',
      ExpressionAttributeNames: { '#pk': 'pk' },
      ExpressionAttributeValues: { ':pk': 'testPK' }
    })
  })

  it('handles a basic partionKey query with limit', () => {
    const params = TestModel.query('testPK', { limit: 10  })
    expect(params).toMatchObject({ 
      TableName: 'test-table',
      ConsistentRead: false,
      KeyConditionExpression: '#pk = :pk',
      ExpressionAttributeNames: { '#pk': 'pk' },
      ExpressionAttributeValues: { ':pk': 'testPK' },
      Limit: '10'
    })
  })

  it('handles a basic partionKey query of an index', () => {
    const params = TestModel.query('testSimpleString', { index: 'bySimple' })
    expect(params).toMatchObject({ 
      TableName: 'test-table',
      IndexName: 'bySimple',
      ConsistentRead: false,
      KeyConditionExpression: '#pk = :pk',
      ExpressionAttributeNames: { '#pk': 'simple_string' },
      ExpressionAttributeValues: { ':pk': 'testSimpleString' }
    })
  })

  it('handles a basic partionKey query with consistent reads', () => {
    const params = TestModel.query('testPK', { consistentRead: true })
    expect(params).toMatchObject({ 
      TableName: 'test-table',
      ConsistentRead: true,
      KeyConditionExpression: '#pk = :pk',
      ExpressionAttributeNames: { '#pk': 'pk' },
      ExpressionAttributeValues: { ':pk': 'testPK' }
    })
  })

  it('handles a query with exact sort key', () => {
    const params = TestModel.query('testPK', { sortKey: { value: 'testSK', operator: '=' } })
    expect(params).toMatchObject({ 
      TableName: 'test-table',
      ConsistentRead: false,
      KeyConditionExpression: '#pk = :pk and #sk = :value1',
      ExpressionAttributeNames: { 
        '#pk': 'pk',
        '#sk': 'sk' 
      },
      ExpressionAttributeValues: { 
        ':pk': 'testPK',
        ':value1': 'testSK' 
      }
    })
  })

  it('handles a query with > sort key', () => {
    const params = TestModel.query('testPK', { sortKey: { value: '2019', operator: '>' } })
    expect(params).toMatchObject({ 
      TableName: 'test-table',
      ConsistentRead: false,
      KeyConditionExpression: '#pk = :pk and #sk > :value1',
      ExpressionAttributeNames: { 
        '#pk': 'pk',
        '#sk': 'sk' 
      },
      ExpressionAttributeValues: { 
        ':pk': 'testPK',
        ':value1': '2019' 
      }
    })
  })

  it('handles a query with < sort key', () => {
    const params = TestModel.query('testPK', { sortKey: { value: '2019', operator: '<' } })
    expect(params).toMatchObject({ 
      TableName: 'test-table',
      ConsistentRead: false,
      KeyConditionExpression: '#pk = :pk and #sk < :value1',
      ExpressionAttributeNames: { 
        '#pk': 'pk',
        '#sk': 'sk' 
      },
      ExpressionAttributeValues: { 
        ':pk': 'testPK',
        ':value1': '2019' 
      }
    })
  })

  it('handles a query with <= sort key', () => {
    const params = TestModel.query('testPK', { sortKey: { value: '2019', operator: '<=' } })
    expect(params).toMatchObject({ 
      TableName: 'test-table',
      ConsistentRead: false,
      KeyConditionExpression: '#pk = :pk and #sk <= :value1',
      ExpressionAttributeNames: { 
        '#pk': 'pk',
        '#sk': 'sk' 
      },
      ExpressionAttributeValues: { 
        ':pk': 'testPK',
        ':value1': '2019' 
      }
    })
  })

  it('handles a query with >= sort key', () => {
    const params = TestModel.query('testPK', { sortKey: { value: '2019', operator: '>=' } })
    expect(params).toMatchObject({ 
      TableName: 'test-table',
      ConsistentRead: false,
      KeyConditionExpression: '#pk = :pk and #sk >= :value1',
      ExpressionAttributeNames: { 
        '#pk': 'pk',
        '#sk': 'sk' 
      },
      ExpressionAttributeValues: { 
        ':pk': 'testPK',
        ':value1': '2019' 
      }
    })
  })

  it('handles a query with begins_with sort key', () => {
    const params = TestModel.query('testPK', { sortKey: { value: '2019', operator: 'begins_with' } })
    expect(params).toMatchObject({ 
      TableName: 'test-table',
      ConsistentRead: false,
      KeyConditionExpression: '#pk = :pk and #sk begins_with :value1',
      ExpressionAttributeNames: { 
        '#pk': 'pk',
        '#sk': 'sk' 
      },
      ExpressionAttributeValues: { 
        ':pk': 'testPK',
        ':value1': '2019' 
      }
    })
  })

  it('handles a query with between sort key values', () => {
    const params = TestModel.query('testPK', { sortKey: { value: '2011', secondaryValue: '2020', operator: 'between' } })
    expect(params).toMatchObject({ 
      TableName: 'test-table',
      ConsistentRead: false,
      KeyConditionExpression: '#pk = :pk and #sk between :value1 and :value2',
      ExpressionAttributeNames: { 
        '#pk': 'pk',
        '#sk': 'sk' 
      },
      ExpressionAttributeValues: { 
        ':pk': 'testPK',
        ':value1': '2011',
        ':value2': '2020' 
      }
    })
  })

  it('throws error for invalid operator', () => {
    expect(() => TestModel.query('testPK', { sortKey: { value: '2019', operator: '?' } })).toThrow()
  })

  it('throws error if pk is ommited', () => {
    expect(() => TestModel.query()).toThrow()
  })

  it('throws error on between operator if secondaryValue is ommited', () => {
    expect(() => TestModel.query('testPK', { sortKey: { value: '2019', operator: 'between' } })).toThrow()
  })

  it('throws error if requested index is not defined', () => {
    expect(() => TestModel.query('testPK', { index: 'notDefined' })).toThrow()
  })

  it('throws error if using and index and sort key but the sort key is not defined', () => {
    expect(() => TestModel.query('testPK', { sortKey: { value: '2019', operator: '?' }, index: 'bySimple' })).toThrow()
  })
})