const { Model } = require('../index')

// Define main model for testing
const TestModel = new Model('TestModel',{
  // Include table name
  table: 'test-table',

  // Include model field
  model: true,

  // Include timestamps
  timestamps: true,

  // Define partition and sort keys
  partitionKey: 'pk',
  sortKey: 'sk',

  // Define schema
  schema: {
    pk: { type: 'string', alias: 'email' },
    sk: { type: 'string', alias: 'type' },
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
  }
})

// Define simple model for testing
const SimpleModel = new Model('SimpleModel',{
  // Include table name
  table: 'simple-table',

  // Include model field
  model: false,

  // Include timestamps
  timestamps: false,

  // Define partition and sort keys
  partitionKey: 'pk',

  // Define schema
  schema: {
    pk: { type: 'string' },
    sk: { type: 'string', hidden: true },
    test: { type: 'string' },
    test_composite: ['sk',0, { save: true }],
    test_composite2: ['sk',1],
    test_undefined: { default: () => undefined }
  }
})

// Define simple model wity sortKey for testing
const SimpleModelSk = new Model('SimpleModel',{
  // Include table name
  table: 'simple-table',

  // Include model field
  model: false,

  // Include timestamps
  timestamps: false,

  // Define partition and sort keys
  partitionKey: 'pk',
  sortKey: 'sk',

  // Define schema
  schema: {
    pk: { type: 'string' },
    sk: { type: 'string' },
    test: { type: 'string' }
  }
})

// Define simple model for testing
const SimpleModelReq = new Model('SimpleModelReq',{
  // Include table name
  table: 'simple-table',

  // Include model field
  model: false,

  // Include timestamps
  timestamps: false,

  // Define partition and sort keys
  partitionKey: 'pk',

  // Define schema
  schema: {
    pk: { type: 'string' },
    test: { type: 'string', required: true },
    test2: { type: 'string', required: 'always' }
  }
})


describe('model creation', ()=> {

  it('creates basic model w/ defaults', () => {
    let Default = new Model('Default',{
      table: 'test-table',
      partitionKey: 'pk',
      schema: {
        pk: 'string'
      }
    })

    expect(Default.model()).toEqual({
      table: 'test-table',
      partitionKey: 'pk',
      sortKey: null,
      schema: {
        pk: { type: 'string', coerce: true },
        __model: { type: 'string', default: 'Default', coerce: true, hidden: true }
      },
      defaults: {
        __model: 'Default'
      },
      required: {},
      linked: {}
    })
  })

  it('creates basic model w/ no model field', () => {
    let Default = new Model('Default',{
      table: 'test-table',
      partitionKey: 'pk',
      model: false,
      schema: {
        pk: 'string'
      }
    })
    // console.log(Default.model());
    expect(Default.model()).toEqual({
      table: 'test-table',
      partitionKey: 'pk',
      sortKey: null,
      schema: {
        pk: { type: 'string', coerce: true }
      },
      defaults: {},
      required: {},
      linked: {}
    })
  })


  it('creates basic model w/ timestamps', () => {
    let Default = new Model('Default',{
      table: 'test-table',
      partitionKey: 'pk',
      timestamps: true,
      schema: {
        pk: 'string'
      }
    })

    let model = Default.model()

    // String compare because of the anonymous functions
    expect(JSON.stringify(model)).toBe(JSON.stringify({
      table: 'test-table',
      partitionKey: 'pk',
      sortKey: null,
      schema: {
        pk: { type: 'string', coerce: true },
        __model: { type: 'string', default: 'Default', hidden: true, coerce: true },
        created: { type: 'string', default: ()=> new Date().toISOString(), coerce: true },
        modified: { type: 'string', default: ()=> new Date().toISOString(), onUpdate: true, coerce: true }
      },
      defaults: {
        __model: 'Default',
        created: ()=> new Date().toISOString(),
        modified: ()=> new Date().toISOString(),
      },
      required: {},
      linked: {}
    }))
    expect(model.schema.created).toHaveProperty('default')
    expect(model.schema.modified).toHaveProperty('default')
    expect(model.defaults).toHaveProperty('created')
    expect(model.defaults).toHaveProperty('modified')
  })

  it('creates model that overrides model field name', () => {
    let Default = new Model('Default',{
      table: 'test-table',
      partitionKey: 'pk',
      model: 'my_model_field',
      schema: {
        pk: 'string'
      }
    })
    // console.log(Default.model());
    expect(Default.model()).toEqual({
      table: 'test-table',
      partitionKey: 'pk',
      sortKey: null,
      schema: {
        pk: { type: 'string', coerce: true },
        my_model_field: { type: 'string', default: 'Default', hidden: true, coerce: true }
      },
      defaults: {
        my_model_field: 'Default'
      },
      required: {},
      linked: {}
    })
  })


  it('creates model that overrides timestamp names', () => {
    let Default = new Model('Default',{
      table: 'test-table',
      partitionKey: 'pk',
      timestamps: true,
      created: 'createdAt',
      modified: 'modifiedAt',
      schema: {
        pk: 'string'
      }
    })

    let model = Default.model()

    // String compare because of the anonymous functions
    expect(JSON.stringify(model)).toBe(JSON.stringify({
      table: 'test-table',
      partitionKey: 'pk',
      sortKey: null,
      schema: {
        pk: { type: 'string', coerce: true },
        __model: { type: 'string', default: 'Default', hidden: true, coerce: true },
        createdAt: { type: 'string', default: ()=> new Date().toISOString(), coerce: true },
        modifiedAt: { type: 'string', default: ()=> new Date().toISOString(), onUpdate: true, coerce: true }
      },
      defaults: {
        __model: 'Default',
        createdAt: ()=> new Date().toISOString(),
        modifiedAt: ()=> new Date().toISOString(),
      },
      required: {},
      linked: {}
    }))
    expect(model.schema.createdAt).toHaveProperty('default')
    expect(model.schema.modifiedAt).toHaveProperty('default')
    expect(model.defaults).toHaveProperty('createdAt')
    expect(model.defaults).toHaveProperty('modifiedAt')
  })

  it('creates basic model w/ required fields', () => {
    let Default = new Model('Default',{
      table: 'test-table',
      partitionKey: 'pk',
      schema: {
        pk: 'string',
        test: { type: 'string', required: true },
        test2: { type: 'string', required: 'always' }
      }
    })

    expect(Default.model()).toEqual({
      table: 'test-table',
      partitionKey: 'pk',
      sortKey: null,
      schema: {
        pk: { type: 'string', coerce: true },
        __model: { type: 'string', default: 'Default', coerce: true, hidden: true },
        test: { type: 'string', coerce: true, required: true },
        test2: { type: 'string', coerce: true, required: 'always' }
      },
      defaults: {
        __model: 'Default'
      },
      required: {
        test: false,
        test2: true
      },
      linked: {}
    })
  })

  it('creates model w/ composite field type defaults and string assignment', () => {
    let Default = new Model('Default',{
      table: 'test-table',
      partitionKey: 'pk',
      schema: {
        pk: 'string',
        test: ['pk',0],
        test2: ['pk',1,'number']
      }
    })
    expect(Default.model().schema.test.type).toBe('string')
    expect(Default.model().schema.test2.type).toBe('number')
    expect(Default.model().linked).toEqual({ pk: [ 'test', 'test2' ] })
  })

  it('creates model w/ composite field alias', () => {
    let Default = new Model('Default',{
      table: 'test-table',
      partitionKey: 'pk',
      schema: {
        pk: 'string',
        test: ['pk',0, {alias: 'test2' }]
      }
    })
    expect(Default.model().schema.test2.mapped).toBe('test')
  })

  it('fails when creating a model without a name', () => {
    let result = () => new Model('',{
      table: 'test-table',
      partitionKey: 'pk',
      schema: {
        pk: 'string'
      }
    })
    expect(result).toThrow('Please provide a string value for the model name')
  })

  it('fails when creating a model without a partitionKey', () => {
    let result = () => new Model('TestModel',{
      table: 'test-table',
      schema: {
        pk: 'string'
      }
    })
    expect(result).toThrow(`'partitionKey' must be defined`)
  })

  it('fails when creating a model with a non-numeric sortKey', () => {
    let result = () => new Model('TestModel',{
      table: 'test-table',
      partitionKey: 'pk',
      sortKey: 123,
      schema: {
        pk: 'string'
      }
    })
    expect(result).toThrow(`'sortKey' must be string value`)
  })

  it('fails when creating a model without a table', () => {
    let result = () => new Model('TestModel',{
      partitionKey: 'pk',
      schema: {
        pk: 'string'
      }
    })
    expect(result).toThrow(`'table' must be defined`)
  })

  it('fails when creating a model with an invalid schema (array)', () => {
    let result = () => new Model('TestModel',{
      table: 'test-table',
      partitionKey: 'pk',
      schema: [1,2,3]
    })
    expect(result).toThrow(`Please provide a valid 'schema'`)
  })

  it('fails when creating a model with an invalid schema (string)', () => {
    let result = () => new Model('TestModel',{
      table: 'test-table',
      partitionKey: 'pk',
      schema: 'schema'
    })
    expect(result).toThrow(`Please provide a valid 'schema'`)
  })

  it('fails when schema has an invalid type (string style)', () => {
    let result = () => new Model('TestModel',{
      table: 'test-table',
      partitionKey: 'pk',
      schema: {
        pk: 'x'
      }
    })
    expect(result).toThrow(`Invalid or missing type for 'pk'. Valid types are 'string', 'boolean', 'number', 'list', 'map', 'binary', and 'set'.`)
  })

  it('fails when schema has an invalid type (object style)', () => {
    let result = () => new Model('TestModel',{
      table: 'test-table',
      partitionKey: 'pk',
      schema: {
        pk: { type: 'x' }
      }
    })
    expect(result).toThrow(`Invalid or missing type for 'pk'. Valid types are 'string', 'boolean', 'number', 'list', 'map', 'binary', and 'set'.`)
  })

  it(`fails when schema item has invalid 'onUpdate' setting`, () => {
    let result = () => new Model('TestModel',{
      table: 'test-table',
      partitionKey: 'pk',
      schema: {
        pk: { type: 'string' },
        test: { type: 'string', onUpdate: 'x' }
      }
    })
    expect(result).toThrow(`'onUpdate' must be a boolean`)
  })

  it(`fails when schema item alias duplicates existing property`, () => {
    let result = () => new Model('TestModel',{
      table: 'test-table',
      partitionKey: 'pk',
      schema: {
        pk: { type: 'string' },
        test: { type: 'string', alias: 'pk' }
      }
    })
    expect(result).toThrow(`'alias' must be a unique string`)
  })

  it(`fails when schema item use 'setType' when not a 'set'`, () => {
    let result = () => new Model('TestModel',{
      table: 'test-table',
      partitionKey: 'pk',
      schema: {
        pk: { type: 'string' },
        test: { type: 'string', setType: 'string' }
      }
    })
    expect(result).toThrow(`'setType' is only valid for type 'set'`)
  })

  it(`fails when schema item use invalid 'setType'`, () => {
    let result = () => new Model('TestModel',{
      table: 'test-table',
      partitionKey: 'pk',
      schema: {
        pk: { type: 'string' },
        test: { type: 'set', setType: 'test' }
      }
    })
    expect(result).toThrow(`Invalid 'setType', must be 'string', 'number', or 'binary'`)
  })

  it(`fails when setting an invalid schema property type`, () => {
    let result = () => new Model('TestModel',{
      table: 'test-table',
      partitionKey: 'pk',
      schema: {
        pk: { type: 'string' },
        test: { type: 'string', unknown: true }
      }
    })
    expect(result).toThrow(`'unknown' is not a valid property type`)
  })

  it(`fails when setting an invalid required property`, () => {
    let result = () => new Model('TestModel',{
      table: 'test-table',
      partitionKey: 'pk',
      schema: {
        pk: { type: 'string' },
        test: { type: 'string', required: 'x' }
      }
    })
    expect(result).toThrow(`'require' must be a boolean or set to 'always'`)
  })

  it(`fails when composite references missing field`, () => {
    let result = () => new Model('TestModel',{
      table: 'test-table',
      partitionKey: 'pk',
      schema: {
        pk: { type: 'string' },
        test: ['x',0]
      }
    })
    expect(result).toThrow(`'test' must reference another field`)
  })

  it(`fails when composite uses non-numeric index`, () => {
    let result = () => new Model('TestModel',{
      table: 'test-table',
      partitionKey: 'pk',
      schema: {
        pk: { type: 'string' },
        test: ['pk','x']
      }
    })
    expect(result).toThrow(`'test' position value must be numeric`)
  })

  it(`fails when composite uses invalid type`, () => {
    let result = () => new Model('TestModel',{
      table: 'test-table',
      partitionKey: 'pk',
      schema: {
        pk: { type: 'string' },
        test: ['pk',1,'x']
      }
    })
    expect(result).toThrow(`'test' type must be 'string','number', 'boolean' or a configuration object`)
  })

  it(`fails when composite array length is incorrect`, () => {
    let result = () => new Model('TestModel',{
      table: 'test-table',
      partitionKey: 'pk',
      schema: {
        pk: { type: 'string' },
        test: ['pk']
      }
    })
    expect(result).toThrow(`Composite key configurations must have 2 or 3 items`)
  })


  it(`fails when missing model definition`, () => {
    let result = () => new Model('TestModel')
    expect(result).toThrow(`Please provide a valid model definition`)
  })

  it(`fails when providing an invalid model definition`, () => {
    let result = () => new Model('TestModel','test')
    expect(result).toThrow(`Please provide a valid model definition`)
  })

  it(`fails when providing an array as the model definition`, () => {
    let result = () => new Model('TestModel',[])
    expect(result).toThrow(`Please provide a valid model definition`)
  })


})

describe('update',()=>{

  it('creates default update', () => {
    let { TableName, Key, UpdateExpression, ExpressionAttributeNames, ExpressionAttributeValues } = TestModel.update({ pk: 'test-pk', sk: 'test-sk' })
    expect(UpdateExpression).toBe('SET #test_string = if_not_exists(#test_string,:test_string), #__model = if_not_exists(#__model,:__model), #created = if_not_exists(#created,:created), #modified = :modified')
    expect(ExpressionAttributeNames).toEqual({ '#modified': 'modified', '#created': 'created', '#test_string': 'test_string', '#__model': '__model' })
    expect(ExpressionAttributeValues).toHaveProperty(':modified')
    expect(ExpressionAttributeValues).toHaveProperty(':created')
    expect(ExpressionAttributeValues).toHaveProperty(':test_string')
    expect(ExpressionAttributeValues).toHaveProperty(':__model')
    expect(ExpressionAttributeValues[':__model']).toBe('TestModel')
    expect(Key).toEqual({ pk: 'test-pk', sk: 'test-sk' })
    expect(TableName).toBe('test-table')
  })


  it('creates update with multiple fields (default types)', () => {
    let { TableName, Key, UpdateExpression, ExpressionAttributeNames, ExpressionAttributeValues } = TestModel.update({
      pk: 'test-pk',
      sk: 'test-sk',
      test_string: 'test string'
    })
    expect(UpdateExpression).toBe('SET #test_string = :test_string, #__model = if_not_exists(#__model,:__model), #created = if_not_exists(#created,:created), #modified = :modified')
    expect(ExpressionAttributeNames).toEqual({ '#modified': 'modified', '#created': 'created', '#test_string': 'test_string', '#__model': '__model' })
    expect(ExpressionAttributeValues).toHaveProperty(':modified')
    expect(ExpressionAttributeValues).toHaveProperty(':created')
    expect(ExpressionAttributeValues).not.toHaveProperty(':pk')
    expect(ExpressionAttributeValues).not.toHaveProperty(':sk')
    expect(ExpressionAttributeValues[':test_string']).toBe('test string')
    expect(ExpressionAttributeValues).toHaveProperty(':__model')
    expect(ExpressionAttributeValues[':__model']).toBe('TestModel')
    expect(Key).toEqual({ pk: 'test-pk', sk: 'test-sk' })
    expect(TableName).toBe('test-table')
  })


  it('creates update that removes fields', () => {
    let { TableName, Key, UpdateExpression, ExpressionAttributeNames, ExpressionAttributeValues } = TestModel.update({
      pk: 'test-pk',
      sk: 'test-sk',
      test_string: null
    })
    expect(UpdateExpression).toBe('SET #__model = if_not_exists(#__model,:__model), #created = if_not_exists(#created,:created), #modified = :modified REMOVE #test_string')
    expect(ExpressionAttributeNames).toEqual({ '#modified': 'modified', '#created': 'created', '#test_string': 'test_string', '#__model': '__model' })
    expect(ExpressionAttributeValues).toHaveProperty(':modified')
    expect(ExpressionAttributeValues).toHaveProperty(':created')
    expect(ExpressionAttributeValues).not.toHaveProperty(':pk')
    expect(ExpressionAttributeValues).not.toHaveProperty(':sk')
    expect(ExpressionAttributeValues).not.toHaveProperty(':test_string')
    expect(ExpressionAttributeValues).toHaveProperty(':__model')
    expect(ExpressionAttributeValues[':__model']).toBe('TestModel')
    expect(Key).toEqual({ pk: 'test-pk', sk: 'test-sk' })
    expect(TableName).toBe('test-table')
  })

  it('creates update that just removes a field', () => {
    let { TableName, Key, UpdateExpression, ExpressionAttributeNames, ExpressionAttributeValues } = SimpleModel.update({
      pk: 'test-pk',
      test: null
    })
    expect(UpdateExpression).toBe('REMOVE #test')
    expect(ExpressionAttributeNames).toEqual({ '#test': 'test' })
    expect(Key).toEqual({ pk: 'test-pk' })
    expect(TableName).toBe('simple-table')
  })

  it('creates update that just removes a composite field', () => {
    let { TableName, Key, UpdateExpression, ExpressionAttributeNames, ExpressionAttributeValues } = SimpleModel.update({
      pk: 'test-pk',
      test_composite: null
    })
    expect(UpdateExpression).toBe('REMOVE #test_composite')
    expect(ExpressionAttributeNames).toEqual({ '#test_composite': 'test_composite' })
    expect(Key).toEqual({ pk: 'test-pk' })
    expect(TableName).toBe('simple-table')
  })

  it('creates update that just saves a composite field', () => {
    let { TableName, Key, UpdateExpression, ExpressionAttributeNames, ExpressionAttributeValues } = SimpleModel.update({
      pk: 'test-pk',
      test_composite: 'test'
    })
    expect(UpdateExpression).toBe('SET #test_composite = :test_composite')
    expect(ExpressionAttributeNames).toEqual({ '#test_composite': 'test_composite' })
    expect(ExpressionAttributeValues).toEqual({ ':test_composite': 'test' })
    expect(Key).toEqual({ pk: 'test-pk' })
    expect(TableName).toBe('simple-table')
  })


  it('validates field types', () => {
    let { TableName, Key, UpdateExpression, ExpressionAttributeNames, ExpressionAttributeValues } = TestModel.update({
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
    let { TableName, Key, UpdateExpression, ExpressionAttributeNames, ExpressionAttributeValues } = TestModel.update({
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
    let { TableName, Key, UpdateExpression, ExpressionAttributeNames, ExpressionAttributeValues } = TestModel.update({
      pk: 'test-pk',
      sk: 'test-sk',
      test_boolean_coerce: 'false'
    })
    expect(ExpressionAttributeValues[':test_boolean_coerce']).toBe(false)
  })


  it('creates a set', () => {
    let { TableName, Key, UpdateExpression, ExpressionAttributeNames, ExpressionAttributeValues } = TestModel.update({
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
    let { TableName, Key, UpdateExpression, ExpressionAttributeNames, ExpressionAttributeValues } = TestModel.update({
      pk: 'test-pk',
      sk: 'test-sk',
      test_number: { $add: 10 },
      test_number_set_type: { $add: [1,2,3] }
    })
    expect(UpdateExpression).toBe('SET #test_string = if_not_exists(#test_string,:test_string), #__model = if_not_exists(#__model,:__model), #created = if_not_exists(#created,:created), #modified = :modified ADD #test_number :test_number, #test_number_set_type :test_number_set_type')
    expect(ExpressionAttributeNames).toEqual({ '#modified': 'modified', '#created': 'created', '#test_string': 'test_string', '#__model': '__model', '#test_number': 'test_number', '#test_number_set_type': 'test_number_set_type' })
    expect(ExpressionAttributeValues).toHaveProperty(':modified')
    expect(ExpressionAttributeValues).toHaveProperty(':created')
    expect(ExpressionAttributeValues).not.toHaveProperty(':pk')
    expect(ExpressionAttributeValues).not.toHaveProperty(':sk')
    expect(ExpressionAttributeValues).toHaveProperty(':__model')
    expect(ExpressionAttributeValues[':__model']).toBe('TestModel')
    expect(ExpressionAttributeValues[':test_number']).toBe(10)
    expect(ExpressionAttributeValues[':test_number_set_type'].values).toEqual([1,2,3])
    expect(Key).toEqual({ pk: 'test-pk', sk: 'test-sk' })
    expect(TableName).toBe('test-table')
  })


  it('performs a delete operation', () => {
    let { TableName, Key, UpdateExpression, ExpressionAttributeNames, ExpressionAttributeValues } = TestModel.update({
      pk: 'test-pk',
      sk: 'test-sk',
      test_string_set_type: { $delete: ['1','2','3'] },
      test_number_set_type: { $delete: [1,2,3] }
    })
    expect(UpdateExpression).toBe('SET #test_string = if_not_exists(#test_string,:test_string), #__model = if_not_exists(#__model,:__model), #created = if_not_exists(#created,:created), #modified = :modified DELETE #test_string_set_type :test_string_set_type, #test_number_set_type :test_number_set_type')
    expect(ExpressionAttributeNames).toEqual({
      '#test_string': 'test_string',
      '#__model': '__model',
      '#created': 'created',
      '#modified': 'modified',
      '#test_string_set_type': 'test_string_set_type',
      '#test_number_set_type': 'test_number_set_type'
    })
    expect(ExpressionAttributeValues).toHaveProperty(':modified')
    expect(ExpressionAttributeValues).toHaveProperty(':created')
    expect(ExpressionAttributeValues).not.toHaveProperty(':pk')
    expect(ExpressionAttributeValues).not.toHaveProperty(':sk')
    expect(ExpressionAttributeValues).toHaveProperty(':__model')
    expect(ExpressionAttributeValues[':__model']).toBe('TestModel')
    expect(ExpressionAttributeValues[':test_string_set_type'].values).toEqual(['1','2','3'])
    expect(ExpressionAttributeValues[':test_number_set_type'].values).toEqual([1,2,3])
    expect(Key).toEqual({ pk: 'test-pk', sk: 'test-sk' })
    expect(TableName).toBe('test-table')

  })

  it('removes items from a list', () => {
    let { TableName, Key, UpdateExpression, ExpressionAttributeNames, ExpressionAttributeValues } = TestModel.update({
      pk: 'test-pk',
      sk: 'test-sk',
      test_list: { $remove: [2,3,8] }
    })
    expect(UpdateExpression).toBe('SET #test_string = if_not_exists(#test_string,:test_string), #__model = if_not_exists(#__model,:__model), #created = if_not_exists(#created,:created), #modified = :modified REMOVE #test_list[2], #test_list[3], #test_list[8]')
    expect(ExpressionAttributeNames).toEqual({
      '#test_string': 'test_string',
      '#__model': '__model',
      '#created': 'created',
      '#modified': 'modified',
      '#test_list': 'test_list'
    })
    expect(ExpressionAttributeValues).toHaveProperty(':modified')
    expect(ExpressionAttributeValues).toHaveProperty(':created')
    expect(ExpressionAttributeValues).not.toHaveProperty(':pk')
    expect(ExpressionAttributeValues).not.toHaveProperty(':sk')
    expect(ExpressionAttributeValues).toHaveProperty(':__model')
    expect(ExpressionAttributeValues[':__model']).toBe('TestModel')
    expect(Key).toEqual({ pk: 'test-pk', sk: 'test-sk' })
    expect(TableName).toBe('test-table')
  })

  it('updates specific items in a list', () => {
    let { TableName, Key, UpdateExpression, ExpressionAttributeNames, ExpressionAttributeValues } = TestModel.update({
      pk: 'test-pk',
      sk: 'test-sk',
      test_list: { 2: 'Test2', 5: 'Test5' }
    })
    expect(UpdateExpression).toBe('SET #test_string = if_not_exists(#test_string,:test_string), #__model = if_not_exists(#__model,:__model), #created = if_not_exists(#created,:created), #modified = :modified, #test_list[2] = :test_list_2, #test_list[5] = :test_list_5')
    expect(ExpressionAttributeNames).toEqual({
      '#test_string': 'test_string',
      '#__model': '__model',
      '#created': 'created',
      '#modified': 'modified',
      '#test_list': 'test_list'
    })
    expect(ExpressionAttributeValues).toHaveProperty(':modified')
    expect(ExpressionAttributeValues).toHaveProperty(':created')
    expect(ExpressionAttributeValues).not.toHaveProperty(':pk')
    expect(ExpressionAttributeValues).not.toHaveProperty(':sk')
    expect(ExpressionAttributeValues).toHaveProperty(':__model')
    expect(ExpressionAttributeValues[':__model']).toBe('TestModel')
    expect(ExpressionAttributeValues[':test_list_2']).toBe('Test2')
    expect(ExpressionAttributeValues[':test_list_5']).toBe('Test5')
    expect(Key).toEqual({ pk: 'test-pk', sk: 'test-sk' })
    expect(TableName).toBe('test-table')
  })


  it('appends and prepends data to a list', () => {
    let { TableName, Key, UpdateExpression, ExpressionAttributeNames, ExpressionAttributeValues } = TestModel.update({
      pk: 'test-pk',
      sk: 'test-sk',
      test_list: { $append: [1,2,3] },
      test_list_coerce: { $prepend: [1,2,3] }
    })
    expect(UpdateExpression).toBe('SET #test_string = if_not_exists(#test_string,:test_string), #__model = if_not_exists(#__model,:__model), #created = if_not_exists(#created,:created), #modified = :modified, #test_list = list_append(#test_list,:test_list), #test_list_coerce = list_append(:test_list_coerce,#test_list_coerce)')
    expect(ExpressionAttributeNames).toEqual({
      '#test_string': 'test_string',
      '#__model': '__model',
      '#created': 'created',
      '#modified': 'modified',
      '#test_list': 'test_list',
      '#test_list_coerce': 'test_list_coerce'
    })
    expect(ExpressionAttributeValues).toHaveProperty(':modified')
    expect(ExpressionAttributeValues).toHaveProperty(':created')
    expect(ExpressionAttributeValues).not.toHaveProperty(':pk')
    expect(ExpressionAttributeValues).not.toHaveProperty(':sk')
    expect(ExpressionAttributeValues).toHaveProperty(':__model')
    expect(ExpressionAttributeValues[':__model']).toBe('TestModel')
    expect(ExpressionAttributeValues[':test_list']).toEqual([1,2,3])
    expect(ExpressionAttributeValues[':test_list_coerce']).toEqual([1,2,3])
    expect(Key).toEqual({ pk: 'test-pk', sk: 'test-sk' })
    expect(TableName).toBe('test-table')
  })


  it('updates nested data in a map', () => {
    let { TableName, Key, UpdateExpression, ExpressionAttributeNames, ExpressionAttributeValues } = TestModel.update({
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
    expect(UpdateExpression).toBe('SET #test_string = if_not_exists(#test_string,:test_string), #__model = if_not_exists(#__model,:__model), #created = if_not_exists(#created,:created), #modified = :modified, #test_map.#test_map_prop1 = :test_map_prop1, #test_map.#test_map_prop2[1] = :test_map_prop2_1, #test_map.#test_map_prop2[4] = :test_map_prop2_4, #test_map.#test_map_prop3.#test_map_prop3_prop4 = :test_map_prop3_prop4, #test_map.#test_map_prop5 = :test_map_prop5')
    expect(ExpressionAttributeNames).toEqual({
      '#__model': '__model',
      '#created': 'created',
      '#modified': 'modified',
      '#test_string': 'test_string',
      '#test_map_prop1': 'prop1',
      '#test_map_prop2': 'prop2',
      '#test_map_prop3': 'prop3',
      '#test_map_prop3_prop4': 'prop4',
      '#test_map_prop5': 'prop5',
      '#test_map': 'test_map'
    })
    expect(ExpressionAttributeValues).toHaveProperty(':__model')
    expect(ExpressionAttributeValues[':__model']).toBe('TestModel')
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
    let { TableName, Key, UpdateExpression, ExpressionAttributeNames, ExpressionAttributeValues } = TestModel.update({
      email: 'test@test.com',
      type: 'test-sk',
      count: { $add: 10 },
      contents: { a: 1, b: 2 }
    })
    expect(UpdateExpression).toBe('SET #test_string = if_not_exists(#test_string,:test_string), #__model = if_not_exists(#__model,:__model), #created = if_not_exists(#created,:created), #modified = :modified, #test_map = :test_map ADD #test_number :test_number')
    expect(ExpressionAttributeNames).toEqual({
      '#__model': '__model',
      '#created': 'created',
      '#modified': 'modified',
      '#test_string': 'test_string',
      '#test_number': 'test_number',
      '#test_map': 'test_map'
    })
    expect(ExpressionAttributeValues).toHaveProperty(':__model')
    expect(ExpressionAttributeValues[':__model']).toBe('TestModel')
    expect(ExpressionAttributeValues[':test_string']).toBe('test string')
    expect(ExpressionAttributeValues[':test_number']).toBe(10)
    expect(ExpressionAttributeValues[':test_map']).toEqual({ a: 1, b: 2 })
    expect(Key).toEqual({ pk: 'test@test.com', sk: 'test-sk' })
    expect(TableName).toBe('test-table')
  })

  it('fails with undefined input', () => {
    expect(() => TestModel.update()).toThrow(`'pk' or 'email' is required`)
  })

  it('fails when using an undefined schema field', () => {
    expect(() => TestModel.update({
      'pk': 'test-pk',
      'sk': 'test-sk',
      'unknown': '?'
    })).toThrow(`Field 'unknown' does not have a mapping or alias`)
  })

  it('fails when missing an \'always\' required field', () => {
    expect(() => SimpleModelReq.update({
      'pk': 'test-pk'
    })).toThrow(`'test2' is a required field`)
  })

  it('fails when using non-numeric fields for indexed list updates', () => {
    expect(() => TestModel.update({
      'pk': 'test-pk',
      'sk': 'test-sk',
      'test_list': { 'test': 'some value' }
    })).toThrow(`Properties must be numeric to update specific list items in 'test_list'`)
  })

  it('fails when using non-numeric values for indexed list removals', () => {
    expect(() => TestModel.update({
      'pk': 'test-pk',
      'sk': 'test-sk',
      'test_list': { $remove: [ 1,2,'test' ] }
    })).toThrow(`Remove array for 'test_list' must only contain numeric indexes`)
  })

  it('fails when supplying non-array value for SET', () => {
    expect(() => SimpleModel.update({
      'pk': 'test-pk'
    }, { SET: 'test' })).toThrow(`SET must be an array`)
  })

  it('fails when supplying non-array value for REMOVE', () => {
    expect(() => SimpleModel.update({
      'pk': 'test-pk'
    }, { REMOVE: 'test' })).toThrow(`REMOVE must be an array`)
  })

  it('fails when supplying non-array value for ADD', () => {
    expect(() => SimpleModel.update({
      'pk': 'test-pk'
    }, { ADD: 'test' })).toThrow(`ADD must be an array`)
  })

  it('fails when supplying non-array value for DELETE', () => {
    expect(() => SimpleModel.update({
      'pk': 'test-pk'
    }, { DELETE: 'test' })).toThrow(`DELETE must be an array`)
  })

  it('fails when supplying non-object value for ExpressionAttributeNames', () => {
    expect(() => SimpleModel.update({
      'pk': 'test-pk'
    }, { ExpressionAttributeNames: 'test' })).toThrow(`ExpressionAttributeNames must be an object`)
  })

  it('fails when supplying non-object value for ExpressionAttributeValues', () => {
    expect(() => SimpleModel.update({
      'pk': 'test-pk'
    }, { ExpressionAttributeValues: 'test' })).toThrow(`ExpressionAttributeValues must be an object`)
  })

  it('adds statements to SET, REMOVE, ADD and DELETE (with names and values)', ()=> {
    let { TableName, Key, UpdateExpression, ExpressionAttributeNames, ExpressionAttributeValues } = SimpleModel.update({
      'pk': 'test-pk',
      'test': 'test'
    }, {
      SET: ['#field = :field'],
      REMOVE: ['#field_remove = :field_remove'],
      ADD: ['#field_add :field_add'],
      DELETE: ['#field_delete'],
      ExpressionAttributeNames: { '#field': 'field' },
      ExpressionAttributeValues: { ':field': 'my value'}
    })

    expect(UpdateExpression).toBe('SET #field = :field, #test = :test REMOVE #field_remove = :field_remove ADD #field_add :field_add DELETE #field_delete')
    expect(ExpressionAttributeNames).toEqual({ '#test': 'test', '#field': 'field' })
    expect(ExpressionAttributeValues).toEqual({ ':test': 'test', ':field': 'my value' })
  })

}) // end describe



describe('put',()=>{

  it('creates basic item',() => {
    let { TableName, Item } = TestModel.put({ pk: 'test-pk', sk: 'test-sk' })
    expect(Item.pk).toBe('test-pk')
    expect(Item.sk).toBe('test-sk')
    expect(Item.__model).toBe('TestModel')
    expect(Item.test_string).toBe('test string')
    expect(Item).toHaveProperty('created')
    expect(Item).toHaveProperty('modified')
  })

  it('creates item with aliases',() => {
    let { Item } = TestModel.put({ email: 'test-pk', type: 'test-sk', count: 5 })
    expect(Item.pk).toBe('test-pk')
    expect(Item.sk).toBe('test-sk')
    expect(Item.test_number).toBe(5)
    expect(Item.__model).toBe('TestModel')
    expect(Item.test_string).toBe('test string')
    expect(Item).toHaveProperty('created')
    expect(Item).toHaveProperty('modified')
  })

  it('creates item with default override',() => {
    let { Item } = TestModel.put({ pk: 'test-pk', sk: 'test-sk', test_string: 'different value' })
    expect(Item.pk).toBe('test-pk')
    expect(Item.sk).toBe('test-sk')
    expect(Item.__model).toBe('TestModel')
    expect(Item.test_string).toBe('different value')
    expect(Item).toHaveProperty('created')
    expect(Item).toHaveProperty('modified')
  })

  it('creates item with saved composite field',() => {
    let { Item } = SimpleModel.put({
      pk: 'test-pk',
      test_composite: 'test'
    })
    expect(Item.pk).toBe('test-pk')
    expect(Item.test_composite).toBe('test')
  })

  it('creates item that ignores field with no value',() => {
    let { Item } = SimpleModel.put({
      pk: 'test-pk',
      test_composite: undefined
    })
    expect(Item.pk).toBe('test-pk')
    expect(Item).not.toHaveProperty('sk')
    expect(Item).not.toHaveProperty('test_composite')
  })

  it('creates item that overrides composite key',() => {
    let { Item } = SimpleModel.put({
      pk: 'test-pk',
      sk: 'override',
      test_composite: 'test',
      test_composite2: 'test2'
    })
    expect(Item.pk).toBe('test-pk')
    expect(Item.sk).toBe('override')
    expect(Item.test_composite).toBe('test')
    expect(Item).not.toHaveProperty('test_composite2')
  })

  it('creates item that generates composite key',() => {
    let { Item } = SimpleModel.put({
      pk: 'test-pk',
      test_composite: 'test',
      test_composite2: 'test2'
    })
    expect(Item.pk).toBe('test-pk')
    expect(Item.sk).toBe('test#test2')
    expect(Item.test_composite).toBe('test')
    expect(Item).not.toHaveProperty('test_composite2')
  })

  it('fails with undefined input', () => {
    expect(() => TestModel.put()).toThrow(`'pk' or 'email' is required`)
  })

  it('fails when using an undefined schema field', () => {
    expect(() => TestModel.put({
      'pk': 'test-pk',
      'sk': 'test-sk',
      'unknown': '?'
    })).toThrow(`Field 'unknown' does not have a mapping or alias`)
  })

  it('fails when invalid string provided with no coercion', () => {
    expect(() => TestModel.put({
      'pk': 'test-pk',
      'sk': 'test-sk',
      'test_string': 1
    })).toThrow(`'test_string' must be of type string`)
  })

  it('fails when invalid boolean provided with no coercion', () => {
    expect(() => TestModel.put({
      'pk': 'test-pk',
      'sk': 'test-sk',
      'test_boolean': 'x'
    })).toThrow(`'test_boolean' must be of type boolean`)
  })

  it('fails when invalid number provided with no coercion', () => {
    expect(() => TestModel.put({
      'pk': 'test-pk',
      'sk': 'test-sk',
      'test_number': 'x'
    })).toThrow(`'test_number' must be of type number`)
  })

  it('fails when invalid number cannot be coerced', () => {
    expect(() => TestModel.put({
      'pk': 'test-pk',
      'sk': 'test-sk',
      'test_number_coerce': 'x1'
    })).toThrow(`Could not convert 'x1' to a number for 'test_number_coerce'`)
  })

  it('fails when invalid array provided with no coercion', () => {
    expect(() => TestModel.put({
      'pk': 'test-pk',
      'sk': 'test-sk',
      'test_list': 'x'
    })).toThrow(`'test_list' must be a list (array)`)
  })

  it('fails when invalid map provided', () => {
    expect(() => TestModel.put({
      'pk': 'test-pk',
      'sk': 'test-sk',
      'test_map': 'x'
    })).toThrow(`'test_map' must be a map (object)`)
  })

  it('fails when set contains different types', () => {
    expect(() => TestModel.put({
      'pk': 'test-pk',
      'sk': 'test-sk',
      'test_string_set_type': [1,2,3]
    })).toThrow(`'test_string_set_type' must be a valid set (array) containing only string types`)
  })

  it('fails when set contains multiple types', () => {
    expect(() => TestModel.put({
      'pk': 'test-pk',
      'sk': 'test-sk',
      'test_string_set': ['test',1]
    })).toThrow(`String Set contains Number value`)
  })

  it('fails when set coerces array and doesn\'t match type', () => {
    expect(() => TestModel.put({
      'pk': 'test-pk',
      'sk': 'test-sk',
      'test_number_set_type_coerce': "1,2,3"
    })).toThrow(`'test_number_set_type_coerce' must be a valid set (array) of type number`)
  })

  it('coerces array into set', () => {
    let { Item } = TestModel.put({
      'pk': 'test-pk',
      'sk': 'test-sk',
      'test_string_set_type_coerce': "1,2,3"
    })
    expect(Item['test_string_set_type_coerce'].values).toEqual(['1','2','3'])
  })

  it('fails when set doesn\'t contain array with no coercion', () => {
    expect(() => TestModel.put({
      'pk': 'test-pk',
      'sk': 'test-sk',
      'test_string_set': 'test'
    })).toThrow(`'test_string_set' must be a valid set (array)`)
  })

  it('fails when missing a required field', () => {
    expect(() => SimpleModelReq.put({
      'pk': 'test-pk',
      'test2': 'test'
    })).toThrow(`'test' is a required field`)
  })

})


describe('get',()=>{

  it('gets the key from inputs', () => {
    let { TableName, Key } = TestModel.get({ pk: 'test-pk', sk: 'test-sk' })
    expect(TableName).toBe('test-table')
    expect(Key).toEqual({ pk: 'test-pk', sk: 'test-sk' })
  })

  it('gets the key from input aliases', () => {
    let { TableName, Key } = TestModel.get({ email: 'test-pk', type: 'test-sk' })
    expect(TableName).toBe('test-table')
    expect(Key).toEqual({ pk: 'test-pk', sk: 'test-sk' })
  })

  it('filters out extra data', () => {
    let { TableName, Key } = TestModel.get({ pk: 'test-pk', sk: 'test-sk', test: 'test' })
    expect(TableName).toBe('test-table')
    expect(Key).toEqual({ pk: 'test-pk', sk: 'test-sk' })
  })

  it('coerces key values to correct types', () => {
    let { TableName, Key } = TestModel.get({ pk: 1, sk: true })
    expect(TableName).toBe('test-table')
    expect(Key).toEqual({ pk: '1', sk: 'true' })
  })

  it('fails with undefined input', () => {
    expect(() => TestModel.get()).toThrow(`'pk' or 'email' is required`)
  })

  it('fails when missing the sortKey', () => {
    expect(() => TestModel.get({ pk: 'test-pk' })).toThrow(`'sk' or 'type' is required`)
  })

  it('fails when missing the partitionKey is missing (no alias)', () => {
    expect(() => SimpleModel.get()).toThrow(`'pk' is required`)
  })

  it('fails when missing the sortKey is missing (no alias)', () => {
    expect(() => SimpleModelSk.get({ pk: 'test-pk' })).toThrow(`'sk' is required`)
  })

})

describe('delete',()=>{

  it('gets the key from inputs', () => {
    let { TableName, Key } = TestModel.delete({ pk: 'test-pk', sk: 'test-sk' })
    expect(TableName).toBe('test-table')
    expect(Key).toEqual({ pk: 'test-pk', sk: 'test-sk' })
  })

  it('gets the key from input aliases', () => {
    let { TableName, Key } = TestModel.delete({ email: 'test-pk', type: 'test-sk' })
    expect(TableName).toBe('test-table')
    expect(Key).toEqual({ pk: 'test-pk', sk: 'test-sk' })
  })

  it('filters out extra data', () => {
    let { TableName, Key } = TestModel.delete({ pk: 'test-pk', sk: 'test-sk', test: 'test' })
    expect(TableName).toBe('test-table')
    expect(Key).toEqual({ pk: 'test-pk', sk: 'test-sk' })
  })

  it('coerces key values to correct types', () => {
    let { TableName, Key } = TestModel.delete({ pk: 1, sk: true })
    expect(TableName).toBe('test-table')
    expect(Key).toEqual({ pk: '1', sk: 'true' })
  })

  it('fails with undefined input', () => {
    expect(() => TestModel.delete()).toThrow(`'pk' or 'email' is required`)
  })

})

describe('parse',()=>{

  it('parses single item', ()=>{
    let item = TestModel.parse({ pk: 'test@test.com', sk: 'email', test_string: 'test', __model: 'Test' })
    expect(item).toEqual({
      email: 'test@test.com',
      type: 'email',
      test_string: 'test'
    })
  })

  it('parses single item and omits a field', ()=>{
    let item = TestModel.parse({ pk: 'test@test.com', sk: 'email', test_string: 'test', __model: 'Test', to_omit: 'test' },['to_omit'])
    expect(item).toEqual({
      email: 'test@test.com',
      type: 'email',
      test_string: 'test'
    })
  })

  it('parses multiple items', ()=>{
    let items = TestModel.parse([
      { pk: 'test@test.com', sk: 'email', test_string: 'test' },
      { pk: 'test2@test.com', sk: 'email2', test_string: 'test2' }
    ])
    expect(items).toEqual([
      {
        email: 'test@test.com',
        type: 'email',
        test_string: 'test'
      },
      {
        email: 'test2@test.com',
        type: 'email2',
        test_string: 'test2'
      }
    ])
  })

  it('parses multiple items and omits a field', ()=>{
    let items = TestModel.parse([
      { pk: 'test@test.com', sk: 'email', test_string: 'test', to_omit: 'test' },
      { pk: 'test2@test.com', sk: 'email2', test_string: 'test2', to_omit: 'test' }
    ],['to_omit'])
    expect(items).toEqual([
      {
        email: 'test@test.com',
        type: 'email',
        test_string: 'test'
      },
      {
        email: 'test2@test.com',
        type: 'email2',
        test_string: 'test2'
      }
    ])
  })

  it('parses composite field', ()=>{
    let item = SimpleModel.parse({ pk: 'test@test.com', sk: 'active#email', test_composite: 'test' })
    expect(item).toEqual({
      pk: 'test@test.com',
      test_composite: 'test',
      test_composite2: 'email',
    })
  })


}) // end parse


describe('utility functions',()=>{

  test('get/verify fields in model schema', ()=>{
    expect(TestModel.field('test_string')).toBe('test_string')
    expect(TestModel.field('email')).toBe('pk')
    expect(() => TestModel.field('not-exists')).toThrow(`'not-exists' does not exist or is an invalid alias`)
  })

  test('get partitionKey from model', ()=>{
    expect(TestModel.partitionKey()).toBe('pk')
  })

  test('get sortKey from model', ()=>{
    expect(TestModel.sortKey()).toBe('sk')
  })

})



// it('calculated fields', () => {
//
//   // Define simple model for testing
//   const CalcModel = new Model('CalcModel',{
//     // Include table name
//     table: 'calc-table',
//
//     // Include model field
//     model: false,
//
//     // Include timestamps
//     timestamps: false,
//
//     // Define partition and sort keys
//     partitionKey: 'pk',
//     sortKey: 'sk',
//
//     // Define schema
//     schema: {
//       pk: { type: 'string', alias: 'key', default: (fields) => fields.state + '#' + fields.id, hidden: false },
//       sk: { type: 'string', hidden: false }, //, default: 'testing-default' },
//       test: {
//         type: 'string',
//         coerce: false,
//         required: true,
//         default: (fields) => {
//           // console.log('FIELDS:',fields)
//           if (!fields.status) {
//             throw 'Need to provide a status'
//           }
//           // if (fields.pk === 'test-id') {
//           //   return fields.test2(fields)+'XYZ'
//           // }
//           return fields.status + '#test-default'
//         }
//       },
//       test2: {
//         type: 'string',
//         default: (fields) => {
//           // return fields.pk + '##testing'
//         },
//         onUpdate: true
//       },
//       status: { save: false },
//       // $state: ['pk','#',0],
//       // $id: ['pk','#',1]
//       // state: 'string',
//       id: 'string',
//       country: ['sk',0],//, { default: 'USA' }],
//       region: ['sk',1,'string'],
//       state: ['sk',2,'number'],// { default: () => 'MA', save: true }],
//       county: ['sk',3],
//       city: ['sk',4, { save: true }],
//       neighborhood: ['sk',5,{ type: 'string', save: false, alias:'nbhd' }],
//       status2: ['test',0],
//       test_sort: { default: (f) => `${f.country}#${f.state}#${f.city}` }
//     }
//   })
//
//   console.log(JSON.stringify(CalcModel.model(),null,2))
//
//   console.log(JSON.stringify(CalcModel.update({
//     // id: 'MA#id123',
//     status: 'active',
//     region: 'Northeast',
//     country: 'USA',
//     state: '4567',
//     city: 'Worcester',
//     county: 'WorcesterCounty',
//     // neighborhood: true,//'a string',
//     nbhd: 'Southie',//'a string',
//     id: '1234567890',
//     // sk: 'test'
//   }),null,2));
//   //
//   // console.log(JSON.stringify(CalcModel.put({
//   //   // id: 'MA#id123',
//   //   status: 'active',
//   //   region: 'Northeast',
//   //   country: 'USA',
//   //   state: 'MA',
//   //   id: '1234567890',
//   //   // sk: 'test'
//   // }),null,2));
//
//   console.log(JSON.stringify(CalcModel.parse({
//     pk: 'MA#1234567890',
//     sk: 'USA#Northeast#1234#Suffolk#Boston#true',
//     status: 'active',
//     // state: 'NH',
//     test: 'active#test-default'
//   }),null,2));
//
// })
