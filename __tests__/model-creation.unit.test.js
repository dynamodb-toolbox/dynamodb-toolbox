const { Model } = require('../index')

// Define main model for testing
const TestModel = new Model('TestModel',require('./models/test-model'))

// Define simple model for testing
const SimpleModel = new Model('SimpleModel',require('./models/simple-model'))

// Define simple model wity sortKey for testing
const SimpleModelSk = new Model('SimpleModelSk',require('./models/simple-model-sk'))

// Define simple model for testing
const SimpleModelReq = new Model('SimpleModelReq',require('./models/simple-model-req'))


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
      delimiter: '#',
      schema: {
        pk: { type: 'string', coerce: true },
        __model: { type: 'string', default: 'Default', coerce: true, hidden: true }
      },
      defaults: {
        __model: 'Default'
      },
      required: {},
      linked: {},
      indexes: {}
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
      delimiter: '#',
      schema: {
        pk: { type: 'string', coerce: true }
      },
      defaults: {},
      required: {},
      linked: {},
      indexes: {}
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
      delimiter: '#',
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
      linked: {},
      indexes: {}
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
      delimiter: '#',
      schema: {
        pk: { type: 'string', coerce: true },
        my_model_field: { type: 'string', default: 'Default', hidden: true, coerce: true }
      },
      defaults: {
        my_model_field: 'Default'
      },
      required: {},
      linked: {},
      indexes: {}
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
      delimiter: '#',
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
      linked: {},
      indexes: {}
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
      delimiter: '#',
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
      linked: {},
      indexes: {}
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

  it('creates basic model w/ indexes', () => {
    let Default = new Model('Default',{
      table: 'test-table',
      partitionKey: 'pk',
      sortKey: 'sk',
      schema: {
        pk: 'string',
        sk: 'string',
        gsipk: 'string'
      },
      indexes: {
        gsi: {
          partitionKey: 'gsiPk'
        }
      }
    })

    expect(Default.model()).toEqual({
      table: 'test-table',
      partitionKey: 'pk',
      sortKey: 'sk',
      schema: {
        pk: { type: 'string', coerce: true },
        sk: { type: 'string', coerce: true },
        gsipk: { type: 'string', coerce: true },
        __model: { type: 'string', default: 'Default', coerce: true, hidden: true }
      },
      defaults: {
        __model: 'Default'
      },
      required: {},
      linked: {},
      indexes: {
        gsi: {
          partitionKey: 'gsiPk'
        }
      }
    })
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

  it('fails when creating a model with a non-string delimiter', () => {
    let result = () => new Model('TestModel',{
      table: 'test-table',
      partitionKey: 'pk',
      delimiter: 123,
      schema: {
        pk: 'string'
      }
    })
    expect(result).toThrow(`'delimiter' must be string value`)
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

  it('fails when index partitionKey is missing', () => {
    let result = () => new Model('Default',{
      table: 'test-table',
      partitionKey: 'pk',
      sortKey: 'sk',
      schema: {
        pk: 'string',
        sk: 'string'
      },
      indexes: {
        gsi: {
          sortKey: 'I am missing the partitionKey'
        }
      }
    })
    expect(result).toThrow(`Index gsi must have valid partitionKey`)
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
