const { Table, Entity } = require('../index')
const { DocumentClient } = require('./bootstrap-tests')

const TestTable = new Table({
  name: 'test-table',
  partitionKey: 'pk',
  sortKey: 'sk',
  DocumentClient
})

const TestEntity = new Entity({
  name: 'TestEntity',
  autoExecute: false,
  attributes: {
    email: { type: 'string', partitionKey: true },
    sort: { type: 'string', sortKey: true },
    test_string: { type: 'string', coerce: false, default: 'test string' },
    test_string_coerce: { type: 'string' },
    test_number: { type: 'number', alias: 'count', coerce: false },
    test_number_coerce: { type: 'number', default: 0 },
    test_boolean: { type: 'boolean', coerce: false },
    test_boolean_coerce: { type: 'boolean' },
    test_list: { type: 'list' },
    test_list_coerce: { type: 'list', coerce: true },
    test_map: { type: 'map', alias: 'contents' },
    test_string_set: { type: 'set' },
    test_number_set: { type: 'set' },
    test_binary_set: { type: 'set' },
    test_string_set_type: { type: 'set', setType: 'string' },
    test_number_set_type: { type: 'set', setType: 'number' },
    test_binary_set_type: { type: 'set', setType: 'binary' },
    test_string_set_type_coerce: { type: 'set', setType: 'string', coerce: true },
    test_number_set_type_coerce: { type: 'set', setType: 'number', coerce: true },
    test_binary: { type: 'binary' },
    simple_string: 'string'
  },
  table: TestTable
})

const TestTable2 = new Table({
  name: 'test-table2',
  partitionKey: 'pk',
  entityField: false,
  DocumentClient
})

const TestEntity2 = new Entity({
  name: 'TestEntity2',
  autoExecute: false,
  attributes: {
    email: { type: 'string', partitionKey: true },
    sort: { type: 'string', map: 'sk' },
    test: { type: 'string' },
    test_composite: ['sort',0, { save: true }],
    test_composite2: ['sort',1],
    test_undefined: { default: () => undefined }
  },
  timestamps: false,
  table: TestTable2
})

const TestTable3 = new Table({
  name: 'test-table3',
  partitionKey: 'pk',
  entityField: false,
  DocumentClient
})

const TestEntity3 = new Entity({
  name: 'TestEntity3',
  autoExecute: false,
  attributes: {
    email: { type: 'string', partitionKey: true },
    test: { type: 'string', required: true },
    test2: { type: 'string', required: 'always' }
  },
  timestamps: false,
  table: TestTable3
})


describe('update',()=>{

  it('creates default update', () => {
    let { TableName, Key, UpdateExpression, ExpressionAttributeNames, ExpressionAttributeValues } = TestEntity.updateParams({ pk: 'test-pk', sk: 'test-sk' })
    
    expect(UpdateExpression).toBe('SET #test_string = if_not_exists(#test_string,:test_string), #_ct = if_not_exists(#_ct,:_ct), #_md = :_md, #_tp = if_not_exists(#_tp,:_tp)')
    expect(ExpressionAttributeNames).toEqual({ '#_md': '_md', '#_ct': '_ct', '#test_string': 'test_string', '#_tp': '_tp' })
    expect(ExpressionAttributeValues).toHaveProperty(':_ct')
    expect(ExpressionAttributeValues).toHaveProperty(':_md')
    expect(ExpressionAttributeValues).toHaveProperty(':test_string')
    expect(ExpressionAttributeValues).toHaveProperty(':_tp')
    expect(ExpressionAttributeValues[':_tp']).toBe('TestEntity')
    expect(Key).toEqual({ pk: 'test-pk', sk: 'test-sk' })
    expect(TableName).toBe('test-table')
  })


  it('creates update with multiple fields (default types)', () => {
    let { TableName, Key, UpdateExpression, ExpressionAttributeNames, ExpressionAttributeValues } = TestEntity.updateParams({
      pk: 'test-pk',
      sk: 'test-sk',
      test_string: 'test string'
    })
    expect(UpdateExpression).toBe('SET #test_string = :test_string, #_ct = if_not_exists(#_ct,:_ct), #_md = :_md, #_tp = if_not_exists(#_tp,:_tp)')
    expect(ExpressionAttributeNames).toEqual({ '#_md': '_md', '#_ct': '_ct', '#test_string': 'test_string', '#_tp': '_tp' })
    expect(ExpressionAttributeValues).toHaveProperty(':_md')
    expect(ExpressionAttributeValues).toHaveProperty(':_ct')
    expect(ExpressionAttributeValues).not.toHaveProperty(':pk')
    expect(ExpressionAttributeValues).not.toHaveProperty(':sk')
    expect(ExpressionAttributeValues[':test_string']).toBe('test string')
    expect(ExpressionAttributeValues).toHaveProperty(':_tp')
    expect(ExpressionAttributeValues[':_tp']).toBe('TestEntity')
    expect(Key).toEqual({ pk: 'test-pk', sk: 'test-sk' })
    expect(TableName).toBe('test-table')
  })

  // TODO: Fix removes with default values
  it.skip('creates update that removes fields', () => {
    let { TableName, Key, UpdateExpression, ExpressionAttributeNames, ExpressionAttributeValues } = TestEntity.updateParams({
      pk: 'test-pk',
      sk: 'test-sk',
      $remove: 'test_string'
    })
    expect(UpdateExpression).toBe('SET #_ct = if_not_exists(#_ct,:_ct), #_md = :_md, #_tp = if_not_exists(#_tp,:_tp) REMOVE #test_string')
    expect(ExpressionAttributeNames).toEqual({ '#_md': '_md', '#_ct': '_ct', '#test_string': 'test_string', '#_tp': '_tp' })
    expect(ExpressionAttributeValues).toHaveProperty(':_md')
    expect(ExpressionAttributeValues).toHaveProperty(':_ct')
    expect(ExpressionAttributeValues).not.toHaveProperty(':pk')
    expect(ExpressionAttributeValues).not.toHaveProperty(':sk')
    expect(ExpressionAttributeValues).not.toHaveProperty(':test_string')
    expect(ExpressionAttributeValues).toHaveProperty(':_tp')
    expect(ExpressionAttributeValues[':_tp']).toBe('TestEntity')
    expect(Key).toEqual({ pk: 'test-pk', sk: 'test-sk' })
    expect(TableName).toBe('test-table')
  })

  it.skip('creates update that just removes a field', () => {
    let { TableName, Key, UpdateExpression, ExpressionAttributeNames, ExpressionAttributeValues } = TestEntity2.updateParams({
      pk: 'test-pk',
      test: null
    })
    expect(UpdateExpression).toBe('REMOVE #test')
    expect(ExpressionAttributeNames).toEqual({ '#test': 'test' })
    expect(Key).toEqual({ pk: 'test-pk' })
    expect(TableName).toBe('test-table2')
  })

  it.skip('creates update that just removes a composite field', () => {
    let { TableName, Key, UpdateExpression, ExpressionAttributeNames, ExpressionAttributeValues } = TestEntity2.updateParams({
      pk: 'test-pk',
      test_composite: null
    })
    expect(UpdateExpression).toBe('REMOVE #test_composite')
    expect(ExpressionAttributeNames).toEqual({ '#test_composite': 'test_composite' })
    expect(Key).toEqual({ pk: 'test-pk' })
    expect(TableName).toBe('test-table2')
  })

  it('fails removing an invalid attribute', () => {
    expect(() => TestEntity.updateParams(
      { pk: 'x', sk: 'y', $remove: 'missing'  }
    )).toThrow(`'missing' is not a valid attribute and cannot be removed`)
  })

  it('fails when trying to remove the paritionKey', () => {
    expect(() => TestEntity.updateParams(
      { pk: 'x', sk: 'y', $remove: 'pk'  }
    )).toThrow(`'pk' is the partitionKey and cannot be removed`)
  })

  it('fails when trying to remove the sortKey', () => {
    expect(() => TestEntity.updateParams(
      { pk: 'x', sk: 'y', $remove: ['sk']  }
    )).toThrow(`'sk' is the sortKey and cannot be removed`)
  })

  it('creates update that just saves a composite field', () => {
    let { TableName, Key, UpdateExpression, ExpressionAttributeNames, ExpressionAttributeValues } = TestEntity2.updateParams({
      pk: 'test-pk',
      test_composite: 'test'
    })
    expect(UpdateExpression).toBe('SET #test_composite = :test_composite')
    expect(ExpressionAttributeNames).toEqual({ '#test_composite': 'test_composite' })
    expect(ExpressionAttributeValues).toEqual({ ':test_composite': 'test' })
    expect(Key).toEqual({ pk: 'test-pk' })
    expect(TableName).toBe('test-table2')
  })


  it('validates field types', () => {
    let { TableName, Key, UpdateExpression, ExpressionAttributeNames, ExpressionAttributeValues } = TestEntity.updateParams({
      pk: 'test-pk',
      sk: 'test-sk',
      test_string: 'test',
      test_number: 1,
      test_boolean: false,
      test_list: ['a','b','c'],
      test_map: { a: 1, b: 2 },
      test_binary: Buffer.from('test')
    })
    expect(ExpressionAttributeValues[':test_string']).toBe('test')
    expect(ExpressionAttributeValues[':test_number']).toBe(1)
    expect(ExpressionAttributeValues[':test_boolean']).toBe(false)
    expect(ExpressionAttributeValues[':test_list']).toEqual(['a','b','c'])
    expect(ExpressionAttributeValues[':test_map']).toEqual({ a: 1, b: 2 })
    expect(ExpressionAttributeValues[':test_binary']).toEqual(Buffer.from('test'))
    expect(Key).toEqual({ pk: 'test-pk', sk: 'test-sk' })
    expect(TableName).toBe('test-table')
  })

  it('coerces values to proper type', () => {
    let { TableName, Key, UpdateExpression, ExpressionAttributeNames, ExpressionAttributeValues } = TestEntity.updateParams({
      pk: 'test-pk',
      sk: 'test-sk',
      test_string_coerce: 1,
      test_number_coerce: '1',
      test_boolean_coerce: 'true',
      test_list_coerce: 'a, b, c'
    })
    expect(ExpressionAttributeValues[':test_string_coerce']).toBe('1')
    expect(ExpressionAttributeValues[':test_number_coerce']).toBe(1)
    expect(ExpressionAttributeValues[':test_boolean_coerce']).toBe(true)
    expect(ExpressionAttributeValues[':test_list_coerce']).toEqual(['a','b','c'])
    expect(Key).toEqual({ pk: 'test-pk', sk: 'test-sk' })
    expect(TableName).toBe('test-table')
  })

  it('coerces falsy string values to boolean', () => {
    let { TableName, Key, UpdateExpression, ExpressionAttributeNames, ExpressionAttributeValues } = TestEntity.updateParams({
      pk: 'test-pk',
      sk: 'test-sk',
      test_boolean_coerce: 'false'
    })
    expect(ExpressionAttributeValues[':test_boolean_coerce']).toBe(false)
  })


  it('creates a set', () => {
    let { TableName, Key, UpdateExpression, ExpressionAttributeNames, ExpressionAttributeValues } = TestEntity.updateParams({
      pk: 'test-pk',
      sk: 'test-sk',
      test_string_set: ['1','2','3'],
      test_number_set: [1,2,3],
      test_binary_set: [Buffer.from('1'),Buffer.from('2'),Buffer.from('3')],
      test_string_set_type: ['1','2','3'],
      test_number_set_type: [1,2,3],
      test_binary_set_type: [Buffer.from('1'),Buffer.from('2'),Buffer.from('3')]
    })
    expect(ExpressionAttributeValues[':test_string_set'].type).toBe('String')
    expect(ExpressionAttributeValues[':test_number_set'].type).toBe('Number')
    expect(ExpressionAttributeValues[':test_binary_set'].type).toBe('Binary')
    expect(ExpressionAttributeValues[':test_string_set_type'].type).toBe('String')
    expect(ExpressionAttributeValues[':test_number_set_type'].type).toBe('Number')
    expect(ExpressionAttributeValues[':test_binary_set_type'].type).toBe('Binary')
    expect(Key).toEqual({ pk: 'test-pk', sk: 'test-sk' })
    expect(TableName).toBe('test-table')
  })


  it('performs an add operation', () => {
    let { TableName, Key, UpdateExpression, ExpressionAttributeNames, ExpressionAttributeValues } = TestEntity.updateParams({
      pk: 'test-pk',
      sk: 'test-sk',
      test_number: { $add: 10 },
      test_number_set_type: { $add: [1,2,3] }
    })
    expect(UpdateExpression).toBe('SET #test_string = if_not_exists(#test_string,:test_string), #_ct = if_not_exists(#_ct,:_ct), #_md = :_md, #_tp = if_not_exists(#_tp,:_tp) ADD #test_number :test_number, #test_number_set_type :test_number_set_type')
    expect(ExpressionAttributeNames).toEqual({ '#_md': '_md', '#_ct': '_ct', '#test_string': 'test_string', '#_tp': '_tp', '#test_number': 'test_number', '#test_number_set_type': 'test_number_set_type' })
    expect(ExpressionAttributeValues).toHaveProperty(':_md')
    expect(ExpressionAttributeValues).toHaveProperty(':_ct')
    expect(ExpressionAttributeValues).not.toHaveProperty(':pk')
    expect(ExpressionAttributeValues).not.toHaveProperty(':sk')
    expect(ExpressionAttributeValues).toHaveProperty(':_tp')
    expect(ExpressionAttributeValues[':_tp']).toBe('TestEntity')
    expect(ExpressionAttributeValues[':test_number']).toBe(10)
    expect(ExpressionAttributeValues[':test_number_set_type'].values).toEqual([1,2,3])
    expect(Key).toEqual({ pk: 'test-pk', sk: 'test-sk' })
    expect(TableName).toBe('test-table')
  })


  it('performs a delete operation', () => {
    let { TableName, Key, UpdateExpression, ExpressionAttributeNames, ExpressionAttributeValues } = TestEntity.updateParams({
      pk: 'test-pk',
      sk: 'test-sk',
      test_string_set_type: { $delete: ['1','2','3'] },
      test_number_set_type: { $delete: [1,2,3] }
    })
    expect(UpdateExpression).toBe('SET #test_string = if_not_exists(#test_string,:test_string), #_ct = if_not_exists(#_ct,:_ct), #_md = :_md, #_tp = if_not_exists(#_tp,:_tp) DELETE #test_string_set_type :test_string_set_type, #test_number_set_type :test_number_set_type')
    expect(ExpressionAttributeNames).toEqual({
      '#test_string': 'test_string',
      '#_tp': '_tp',
      '#_ct': '_ct',
      '#_md': '_md',
      '#test_string_set_type': 'test_string_set_type',
      '#test_number_set_type': 'test_number_set_type'
    })
    expect(ExpressionAttributeValues).toHaveProperty(':_md')
    expect(ExpressionAttributeValues).toHaveProperty(':_ct')
    expect(ExpressionAttributeValues).not.toHaveProperty(':pk')
    expect(ExpressionAttributeValues).not.toHaveProperty(':sk')
    expect(ExpressionAttributeValues).toHaveProperty(':_tp')
    expect(ExpressionAttributeValues[':_tp']).toBe('TestEntity')
    expect(ExpressionAttributeValues[':test_string_set_type'].values).toEqual(['1','2','3'])
    expect(ExpressionAttributeValues[':test_number_set_type'].values).toEqual([1,2,3])
    expect(Key).toEqual({ pk: 'test-pk', sk: 'test-sk' })
    expect(TableName).toBe('test-table')

  })

  it('removes items from a list', () => {
    let { TableName, Key, UpdateExpression, ExpressionAttributeNames, ExpressionAttributeValues } = TestEntity.updateParams({
      pk: 'test-pk',
      sk: 'test-sk',
      test_list: { $remove: [2,3,8] }
    })
    expect(UpdateExpression).toBe('SET #test_string = if_not_exists(#test_string,:test_string), #_ct = if_not_exists(#_ct,:_ct), #_md = :_md, #_tp = if_not_exists(#_tp,:_tp) REMOVE #test_list[2], #test_list[3], #test_list[8]')
    expect(ExpressionAttributeNames).toEqual({
      '#test_string': 'test_string',
      '#_tp': '_tp',
      '#_ct': '_ct',
      '#_md': '_md',
      '#test_list': 'test_list'
    })
    expect(ExpressionAttributeValues).toHaveProperty(':_md')
    expect(ExpressionAttributeValues).toHaveProperty(':_ct')
    expect(ExpressionAttributeValues).not.toHaveProperty(':pk')
    expect(ExpressionAttributeValues).not.toHaveProperty(':sk')
    expect(ExpressionAttributeValues).toHaveProperty(':_tp')
    expect(ExpressionAttributeValues[':_tp']).toBe('TestEntity')
    expect(Key).toEqual({ pk: 'test-pk', sk: 'test-sk' })
    expect(TableName).toBe('test-table')
  })

  it('updates specific items in a list', () => {
    let { TableName, Key, UpdateExpression, ExpressionAttributeNames, ExpressionAttributeValues } = TestEntity.updateParams({
      pk: 'test-pk',
      sk: 'test-sk',
      test_list: { 2: 'Test2', 5: 'Test5' }
    })
    expect(UpdateExpression).toBe('SET #test_string = if_not_exists(#test_string,:test_string), #_ct = if_not_exists(#_ct,:_ct), #_md = :_md, #_tp = if_not_exists(#_tp,:_tp), #test_list[2] = :test_list_2, #test_list[5] = :test_list_5')
    expect(ExpressionAttributeNames).toEqual({
      '#test_string': 'test_string',
      '#_tp': '_tp',
      '#_ct': '_ct',
      '#_md': '_md',
      '#test_list': 'test_list'
    })
    expect(ExpressionAttributeValues).toHaveProperty(':_md')
    expect(ExpressionAttributeValues).toHaveProperty(':_ct')
    expect(ExpressionAttributeValues).not.toHaveProperty(':pk')
    expect(ExpressionAttributeValues).not.toHaveProperty(':sk')
    expect(ExpressionAttributeValues).toHaveProperty(':_tp')
    expect(ExpressionAttributeValues[':_tp']).toBe('TestEntity')
    expect(ExpressionAttributeValues[':test_list_2']).toBe('Test2')
    expect(ExpressionAttributeValues[':test_list_5']).toBe('Test5')
    expect(Key).toEqual({ pk: 'test-pk', sk: 'test-sk' })
    expect(TableName).toBe('test-table')
  })


  it('appends and prepends data to a list', () => {
    let { TableName, Key, UpdateExpression, ExpressionAttributeNames, ExpressionAttributeValues } = TestEntity.updateParams({
      pk: 'test-pk',
      sk: 'test-sk',
      test_list: { $append: [1,2,3] },
      test_list_coerce: { $prepend: [1,2,3] }
    })
    expect(UpdateExpression).toBe('SET #test_string = if_not_exists(#test_string,:test_string), #_ct = if_not_exists(#_ct,:_ct), #_md = :_md, #_tp = if_not_exists(#_tp,:_tp), #test_list = list_append(#test_list,:test_list), #test_list_coerce = list_append(:test_list_coerce,#test_list_coerce)')
    expect(ExpressionAttributeNames).toEqual({
      '#test_string': 'test_string',
      '#_tp': '_tp',
      '#_ct': '_ct',
      '#_md': '_md',
      '#test_list': 'test_list',
      '#test_list_coerce': 'test_list_coerce'
    })
    expect(ExpressionAttributeValues).toHaveProperty(':_md')
    expect(ExpressionAttributeValues).toHaveProperty(':_ct')
    expect(ExpressionAttributeValues).not.toHaveProperty(':pk')
    expect(ExpressionAttributeValues).not.toHaveProperty(':sk')
    expect(ExpressionAttributeValues).toHaveProperty(':_tp')
    expect(ExpressionAttributeValues[':_tp']).toBe('TestEntity')
    expect(ExpressionAttributeValues[':test_list']).toEqual([1,2,3])
    expect(ExpressionAttributeValues[':test_list_coerce']).toEqual([1,2,3])
    expect(Key).toEqual({ pk: 'test-pk', sk: 'test-sk' })
    expect(TableName).toBe('test-table')
  })


  it('updates nested data in a map', () => {
    let { TableName, Key, UpdateExpression, ExpressionAttributeNames, ExpressionAttributeValues } = TestEntity.updateParams({
      pk: 'test-pk',
      sk: 'test-sk',
      test_map: { $set: {
        'prop1': 'some value',
        'prop2[1]': 'list value',
        'prop2[4]': 'list value4',
        'prop3.prop4': 'nested',
        'prop5': [1,2,3]
      }}
    })
    expect(UpdateExpression).toBe('SET #test_string = if_not_exists(#test_string,:test_string), #_ct = if_not_exists(#_ct,:_ct), #_md = :_md, #_tp = if_not_exists(#_tp,:_tp), #test_map.#test_map_prop1 = :test_map_prop1, #test_map.#test_map_prop2[1] = :test_map_prop2_1, #test_map.#test_map_prop2[4] = :test_map_prop2_4, #test_map.#test_map_prop3.#test_map_prop3_prop4 = :test_map_prop3_prop4, #test_map.#test_map_prop5 = :test_map_prop5')
    expect(ExpressionAttributeNames).toEqual({
      '#_tp': '_tp',
      '#_ct': '_ct',
      '#_md': '_md',
      '#test_string': 'test_string',
      '#test_map_prop1': 'prop1',
      '#test_map_prop2': 'prop2',
      '#test_map_prop3': 'prop3',
      '#test_map_prop3_prop4': 'prop4',
      '#test_map_prop5': 'prop5',
      '#test_map': 'test_map'
    })
    expect(ExpressionAttributeValues).toHaveProperty(':_tp')
    expect(ExpressionAttributeValues[':_tp']).toBe('TestEntity')
    expect(ExpressionAttributeValues[':test_string']).toBe('test string')
    expect(ExpressionAttributeValues[':test_map_prop1']).toBe('some value')
    expect(ExpressionAttributeValues[':test_map_prop2_1']).toBe('list value')
    expect(ExpressionAttributeValues[':test_map_prop2_4']).toBe('list value4')
    expect(ExpressionAttributeValues[':test_map_prop3_prop4']).toBe('nested')
    expect(ExpressionAttributeValues[':test_map_prop5']).toEqual([1,2,3])
    expect(Key).toEqual({ pk: 'test-pk', sk: 'test-sk' })
    expect(TableName).toBe('test-table')
  })


  it('uses an alias', async () => {
    let { TableName, Key, UpdateExpression, ExpressionAttributeNames, ExpressionAttributeValues } = TestEntity.updateParams({
      email: 'test@test.com',
      sort: 'test-sk',
      count: { $add: 10 },
      contents: { a: 1, b: 2 }
    })
    expect(UpdateExpression).toBe('SET #test_string = if_not_exists(#test_string,:test_string), #_ct = if_not_exists(#_ct,:_ct), #_md = :_md, #_tp = if_not_exists(#_tp,:_tp), #test_map = :test_map ADD #test_number :test_number')
    expect(ExpressionAttributeNames).toEqual({
      '#_tp': '_tp',
      '#_ct': '_ct',
      '#_md': '_md',
      '#test_string': 'test_string',
      '#test_number': 'test_number',
      '#test_map': 'test_map'
    })
    expect(ExpressionAttributeValues).toHaveProperty(':_tp')
    expect(ExpressionAttributeValues[':_tp']).toBe('TestEntity')
    expect(ExpressionAttributeValues[':test_string']).toBe('test string')
    expect(ExpressionAttributeValues[':test_number']).toBe(10)
    expect(ExpressionAttributeValues[':test_map']).toEqual({ a: 1, b: 2 })
    expect(Key).toEqual({ pk: 'test@test.com', sk: 'test-sk' })
    expect(TableName).toBe('test-table')
  })

  it('fails with undefined input', () => {
    expect(() => TestEntity.updateParams()).toThrow(`'pk' or 'email' is required`)
  })

  it('fails when using an undefined schema field', () => {
    expect(() => TestEntity.updateParams({
      'pk': 'test-pk',
      'sk': 'test-sk',
      'unknown': '?'
    })).toThrow(`Field 'unknown' does not have a mapping or alias`)
  })

  it('fails when missing an \'always\' required field', () => {
    expect(() => TestEntity3.updateParams({
      'pk': 'test-pk'
    })).toThrow(`'test2' is a required field`)
  })

  it('fails when using non-numeric fields for indexed list updates', () => {
    expect(() => TestEntity.updateParams({
      'pk': 'test-pk',
      'sk': 'test-sk',
      'test_list': { 'test': 'some value' }
    })).toThrow(`Properties must be numeric to update specific list items in 'test_list'`)
  })

  it('fails when using non-numeric values for indexed list removals', () => {
    expect(() => TestEntity.updateParams({
      'pk': 'test-pk',
      'sk': 'test-sk',
      'test_list': { $remove: [ 1,2,'test' ] }
    })).toThrow(`Remove array for 'test_list' must only contain numeric indexes`)
  })

  it('fails when supplying non-array value for SET', () => {
    expect(() => TestEntity2.updateParams({
      'pk': 'test-pk'
    }, {}, { SET: 'test' })).toThrow(`SET must be an array`)
  })

  it('fails when supplying non-array value for REMOVE', () => {
    expect(() => TestEntity2.updateParams({
      'pk': 'test-pk'
    }, {}, { REMOVE: 'test' })).toThrow(`REMOVE must be an array`)
  })

  it('fails when supplying non-array value for ADD', () => {
    expect(() => TestEntity2.updateParams({
      'pk': 'test-pk'
    }, {}, { ADD: 'test' })).toThrow(`ADD must be an array`)
  })

  it('fails when supplying non-array value for DELETE', () => {
    expect(() => TestEntity2.updateParams({
      'pk': 'test-pk'
    }, {}, { DELETE: 'test' })).toThrow(`DELETE must be an array`)
  })

  it('fails when supplying non-object value for ExpressionAttributeNames', () => {
    expect(() => TestEntity2.updateParams({
      'pk': 'test-pk'
    }, {}, { ExpressionAttributeNames: 'test' })).toThrow(`ExpressionAttributeNames must be an object`)
  })

  it('fails when supplying non-object value for ExpressionAttributeValues', () => {
    expect(() => TestEntity2.updateParams({
      'pk': 'test-pk'
    }, {}, { ExpressionAttributeValues: 'test' })).toThrow(`ExpressionAttributeValues must be an object`)
  })

  it.skip('fails when supplying a non-string for ConditionExpression', () => {
    expect(() => TestEntity2.updateParams({
      'pk': 'test-pk'
    }, {}, { ConditionExpression: 1 })).toThrow(`ConditionExpression must be a string`)
  })

  it('adds statements to SET, REMOVE, ADD and DELETE (with names and values) and a ConditionExpression', ()=> {
    let { TableName, Key, UpdateExpression, ExpressionAttributeNames, ExpressionAttributeValues, ConditionExpression } = TestEntity2.updateParams({
      'pk': 'test-pk',
      'test': 'test'
    }, {}, {
      SET: ['#field = :field'],
      REMOVE: ['#field_remove = :field_remove'],
      ADD: ['#field_add :field_add'],
      DELETE: ['#field_delete'],
      ExpressionAttributeNames: { '#field': 'field' },
      ExpressionAttributeValues: { ':field': 'my value'},
      ConditionExpression: '#field > 0'
    })

    expect(UpdateExpression).toBe('SET #field = :field, #test = :test REMOVE #field_remove = :field_remove ADD #field_add :field_add DELETE #field_delete')
    expect(ExpressionAttributeNames).toEqual({ '#test': 'test', '#field': 'field' })
    expect(ExpressionAttributeValues).toEqual({ ':test': 'test', ':field': 'my value' })
    expect(ConditionExpression).toBe('#field > 0')
  })

  it('conditionally contains returned fields (e.g. when no values)', ()=> {
    let params = TestEntity2.updateParams({
      'pk': 'test-pk',
      '$remove': 'test'
    })

    expect(params.UpdateExpression).toBe('REMOVE #test')
    expect(params.ExpressionAttributeNames).toEqual({ '#test': 'test' })
    expect(params).not.toHaveProperty('ExpressionAttributeValues')
    expect(params).not.toHaveProperty('ConditionExpression')
  })


  it('fails on extra options', () => {
    expect(() => TestEntity.updateParams(
      { pk: 'x', sk: 'y' },
      { extra: true }
    )).toThrow('Invalid update options: extra')
  })

  it('sets capacity options', () => {
    let { TableName, ReturnConsumedCapacity } = TestEntity.updateParams(
      { pk: 'x', sk: 'y' },
      { capacity: 'none' }
    )
    expect(TableName).toBe('test-table')
    expect(ReturnConsumedCapacity).toBe('NONE')
  })

  it('sets metrics options', () => {
    let { TableName, ReturnItemCollectionMetrics } = TestEntity.updateParams(
      { pk: 'x', sk: 'y' },
      { metrics: 'size' }
    )
    expect(TableName).toBe('test-table')
    expect(ReturnItemCollectionMetrics).toBe('SIZE')
  })

  it('sets returnValues options', () => {
    let { TableName, ReturnValues } = TestEntity.updateParams(
      { pk: 'x', sk: 'y' },
      { returnValues: 'ALL_OLD' }
    )
    expect(TableName).toBe('test-table')
    expect(ReturnValues).toBe('ALL_OLD')
  })

  it('fails on invalid capacity option', () => {
    expect(() => TestEntity.updateParams({ pk: 'x', sk: 'y' }, { capacity: 'test' }))
      .toThrow(`'capacity' must be one of 'NONE','TOTAL', OR 'INDEXES'`)
  })

  it('fails on invalid metrics option', () => {
    expect(() => TestEntity.updateParams({ pk: 'x', sk: 'y' }, { metrics: 'test' }))
      .toThrow(`'metrics' must be one of 'NONE' OR 'SIZE'`)
  })

  it('fails on invalid returnValues option', () => {
    expect(() => TestEntity.updateParams({ pk: 'x', sk: 'y' }, { returnValues: 'test' }))
      .toThrow(`'returnValues' must be one of 'NONE', 'ALL_OLD', 'UPDATED_OLD', 'ALL_NEW', OR 'UPDATED_NEW'`)
  })


  it('sets conditions', () => {
    let { TableName, ExpressionAttributeNames, ExpressionAttributeValues, ConditionExpression } = TestEntity.updateParams(
      { pk: 'x', sk: 'y' },
      { conditions: { attr: 'pk', gt: 'test' } }
    )
    expect(TableName).toBe('test-table')
    expect(ExpressionAttributeNames).toEqual({
      '#test_string': 'test_string',
      '#_ct': '_ct',
      '#_md': '_md',
      '#_tp': '_tp',
      '#attr1': 'pk'
    })
    expect(ExpressionAttributeValues).toHaveProperty(':attr1')
    expect(ConditionExpression).toBe('#attr1 > :attr1')
  })

  it('handles extra parameters', () => {
    let { TableName, Key, ReturnConsumedCapacity } = TestEntity.updateParams(
      { pk: 'x', sk: 'y' },
      { },
      { ReturnConsumedCapacity: 'NONE' }
    )
    expect(TableName).toBe('test-table')
    expect(ReturnConsumedCapacity).toBe('NONE')
  })

  it('handles invalid parameter input', () => {
    let { TableName, Key } = TestEntity.updateParams(
      { pk: 'x', sk: 'y' },
      { },
      'string'
    )
    expect(TableName).toBe('test-table')
  })


}) // end describe
