// Require Table and Entity classes
const Table = require('../classes/Table')
const Entity = require('../classes/Entity')

// TODO: Secondary index test
// TODO: execute/parse setting tests, etc.

describe('Entity creation', ()=> {

  it('creates basic entity w/ defaults', async () => {

    // Create entity
    const TestEntity = new Entity({
      name: 'TestEntity',
      attributes: {
        pk: { partitionKey: true }
      }
    })
    
    expect(TestEntity.name).toBe('TestEntity')
    expect(TestEntity.schema.attributes.pk).toEqual({ 
      partitionKey: true,
      type: 'string', 
      coerce: true
    })
    expect(TestEntity.schema.keys).toEqual({ partitionKey: 'pk' })
    expect(TestEntity.schema.attributes.created).toHaveProperty('default')
    expect(TestEntity.schema.attributes.created.map).toBe('_ct')
    expect(TestEntity.schema.attributes.modified).toHaveProperty('default')
    expect(TestEntity.schema.attributes.modified.map).toBe('_md')
    expect(TestEntity.schema.attributes).toHaveProperty('_ct')
    expect(TestEntity.schema.attributes).toHaveProperty('_md')
    expect(TestEntity.defaults).toHaveProperty('_ct')
    expect(TestEntity.defaults).toHaveProperty('_md')
    expect(TestEntity._tpAlias).toBe('type')
  })


  it('creates basic entity w/o timestamps', () => {
    let TestEntity = new Entity({
      name: 'TestEntity',
      timestamps: false,
      attributes: {
        pk: { partitionKey: true }
      }
    })

    expect(TestEntity.name).toBe('TestEntity')
    expect(TestEntity.schema.attributes.pk).toEqual({ 
      partitionKey: true,
      type: 'string', 
      coerce: true
    })
    expect(TestEntity.schema.keys).toEqual({ partitionKey: 'pk' })
    expect(TestEntity.schema.attributes).not.toHaveProperty('created')
    expect(TestEntity.schema.attributes).not.toHaveProperty('_ct')
    expect(TestEntity.schema.attributes).not.toHaveProperty('created')
    expect(TestEntity.schema.attributes).not.toHaveProperty('_md')
    expect(TestEntity.defaults).not.toHaveProperty('_ct')
    expect(TestEntity.defaults).not.toHaveProperty('_md')
    expect(TestEntity._tpAlias).toBe('type')
  })


  it('creates entity that overrides timestamp names', () => {
    let TestEntity = new Entity({
      name: 'TestEntity',
      created: 'createdAt',
      modified: 'modifiedAt',
      attributes: {
        pk: { partitionKey: true }
      }
    })

    expect(TestEntity.schema.keys).toEqual({ partitionKey: 'pk' })
    expect(TestEntity.schema.attributes.createdAt).toHaveProperty('default')
    expect(TestEntity.schema.attributes.modifiedAt).toHaveProperty('default')
    expect(TestEntity.defaults).toHaveProperty('createdAt')
    expect(TestEntity.defaults).toHaveProperty('modifiedAt')
  })

  it('creates basic entity w/ required fields', () => {
    let TestEntity = new Entity({
      name: 'TestEntity',
      attributes: {
        pk: { partitionKey: true },
        test: { type: 'string', required: true },
        test2: { type: 'string', required: 'always' }
      }
    })

    expect(TestEntity.required.test).toEqual(false)
    expect(TestEntity.required.test2).toEqual(true)
  })

  it('creates entity w/ composite field type defaults and string assignment', () => {
    let TestEntity = new Entity({
      name: 'TestEntity',
      attributes: {
        pk: { partitionKey: true },
        test: ['pk',0],
        test2: ['pk',1,'number']
      }
    })
    
    expect(TestEntity.schema.attributes.test.type).toBe('string')
    expect(TestEntity.schema.attributes.test2.type).toBe('number')
    expect(TestEntity.linked).toEqual({ pk: [ 'test', 'test2' ] })
  })

  it('creates entity w/ composite field alias', () => {
    let TestEntity = new Entity({
      name: 'TestEntity',
      attributes: {
        pk: { partitionKey: true },
        test: ['pk',0, {alias: 'test2' }]
      }
    })

    expect(TestEntity.schema.attributes.test2.map).toBe('test')
  })

  it('fails when creating a entity without a partitionKey', () => {
    let result = () => new Entity({
      name: 'TestEntity',
      attributes: {}
    })
    expect(result).toThrow(`Entity requires a partitionKey attribute`)
  })


  it('fails when creating a entity without a name', () => {
    let result = () => new Entity({
      attributes: {
        pk: { partitionKey: true }
      }
    })
    expect(result).toThrow(`'name' must be defined`)
  })


  it('fails when creating a entity with an invalid attributes object (array)', () => {
    let result = () => new Entity({
      name: 'TestEntity',
      attributes: [1,2,3]
    })
    expect(result).toThrow(`Please provide a valid 'attributes' object`)
  })

  it('fails when creating a entity with an invalid attributes object (string)', () => {
    let result = () => new Entity({
      name: 'TestEntity',
      attributes: 'test'
    })
    expect(result).toThrow(`Please provide a valid 'attributes' object`)
  })

  it('fails when attribute has an invalid type (string style)', () => {
    let result = () => new Entity({
      name: 'TestEntity',
      attributes: {
        pk: 'x'
      }
    })
    expect(result).toThrow(`Invalid or missing type for 'pk'. Valid types are 'string', 'boolean', 'number', 'list', 'map', 'binary', and 'set'.`)
  })

  it('fails when attribute has an invalid type (object style)', () => {
    let result = () => new Entity({
      name: 'TestEntity',
      attributes: {
        pk: { type: 'x' }
      }
    })
    expect(result).toThrow(`Invalid or missing type for 'pk'. Valid types are 'string', 'boolean', 'number', 'list', 'map', 'binary', and 'set'.`)
  })

  it(`fails when an attribute has invalid 'onUpdate' setting`, () => {
    let result = () => new Entity({
      name: 'TestEntity',
      attributes: {
        pk: { partitionKey: true },
        test: { type: 'string', onUpdate: 'x' }
      }
    })
    expect(result).toThrow(`'onUpdate' must be a boolean`)
  })

  it(`fails when attribute alias duplicates existing property`, () => {
    let result = () => new Entity({
      name: 'TestEntity',
      attributes: {
        pk: { partitionKey: true },
        test: { type: 'string', alias: 'pk' }
      }
    })
    expect(result).toThrow(`'alias' must be a unique string`)
  })

  it(`fails when an attribute uses 'setType' when not a 'set'`, () => {
    let result = () => new Entity({
      name: 'TestEntity',
      attributes: {
        pk: { partitionKey: true },
        test: { type: 'string', setType: 'string' }
      }
    })
    expect(result).toThrow(`'setType' is only valid for type 'set'`)
  })

  it(`fails when attribute uses invalid 'setType'`, () => {
    let result = () => new Entity({
      name: 'TestEntity',
      attributes: {
        pk: { partitionKey: true },
        test: { type: 'set', setType: 'test' }
      }
    })
    expect(result).toThrow(`Invalid 'setType', must be 'string', 'number', or 'binary'`)
  })

  it(`fails when setting an invalid attribute property type`, () => {
    let result = () => new Entity({
      name: 'TestEntity',
      attributes: {
        pk: { partitionKey: true },
        test: { type: 'string', unknown: true }
      }
    })
    expect(result).toThrow(`'unknown' is not a valid property type`)
  })

  it(`fails when setting an invalid required property`, () => {
    let result = () => new Entity({
      name: 'TestEntity',
      attributes: {
        pk: { partitionKey: true },
        test: { type: 'string', required: 'x' }
      }
    })
    expect(result).toThrow(`'require' must be a boolean or set to 'always'`)
  })

  it(`fails when composite references missing field`, () => {
    let result = () => new Entity({
      name: 'TestEntity',
      attributes: {
        pk: { partitionKey: true },
        test: ['x',0]
      }
    })
    expect(result).toThrow(`'test' must reference another field`)
  })

  it(`fails when composite uses non-numeric index`, () => {
    let result = () => new Entity({
      name: 'TestEntity',
      attributes: {
        pk: { partitionKey: true },
        test: ['pk','x']
      }
    })
    expect(result).toThrow(`'test' position value must be numeric`)
  })

  it(`fails when composite uses invalid type`, () => {
    let result = () => new Entity({
      name: 'TestEntity',
      attributes: {
        pk: { partitionKey: true },
        test: ['pk',1,'x']
      }
    })
    expect(result).toThrow(`'test' type must be 'string','number', 'boolean' or a configuration object`)
  })

  it(`fails when composite array length is incorrect`, () => {
    let result = () => new Entity({
      name: 'TestEntity',
      attributes: {
        pk: { partitionKey: true },
        test: ['pk']
      }
    })
    expect(result).toThrow(`Composite key configurations must have 2 or 3 items`)
  })


  it(`fails when missing entity definition`, () => {
    let result = () => new Entity()
    expect(result).toThrow(`Please provide a valid entity definition`)
  })

  it(`fails when providing an invalid entity definition`, () => {
    let result = () => new Entity('test')
    expect(result).toThrow(`Please provide a valid entity definition`)
  })

  it(`fails when providing an array as the entity definition`, () => {
    let result = () => new Entity([])
    expect(result).toThrow(`Please provide a valid entity definition`)
  })


  it('creates entity w/ table', async () => {
  
    // Create basic table
    const TestTable = new Table({
      name: 'test-table',
      partitionKey: 'pk'
    })

    // Create basic entity
    const TestEntity = new Entity({
      name: 'TestEnt',
      attributes: {
        pk: { partitionKey: true }
      },
      table: TestTable
    })

    expect(TestTable instanceof Table).toBe(true)
    expect(TestTable.name).toBe('test-table')
    expect(TestTable.Table.partitionKey).toBe('pk')
    expect(TestTable.Table.sortKey).toBeNull()
    expect(TestTable.Table.entityField).toBe('_tp')
    expect(TestTable.Table.indexes).toEqual({})
    // expect(TestTable.Table.attributes).toEqual({
    //   _tp: { type: 'string' },
    //   pk: { type: 'string', mappings: { TestEnt: { pk: 'string' } } },
    //   _ct: { type: 'string', mappings: { TestEnt: { created: 'string' } } },
    //   _md: { type: 'string', mappings: { TestEnt: { modified: 'string' } } }
    // })
    expect(TestTable.autoExecute).toBe(true)
    expect(TestTable.autoParse).toBe(true)
    expect(TestTable.entities).toEqual(['TestEnt'])
    expect(TestEntity.schema.keys).toEqual({ partitionKey: 'pk' })
    expect(TestEntity.schema.attributes.created).toHaveProperty('default')
    expect(TestEntity.schema.attributes.created.map).toBe('_ct')
    expect(TestEntity.schema.attributes.modified).toHaveProperty('default')
    expect(TestEntity.schema.attributes.modified.map).toBe('_md')
    expect(TestEntity.schema.attributes).toHaveProperty('_ct')
    expect(TestEntity.schema.attributes).toHaveProperty('_md')
    expect(TestEntity.defaults).toHaveProperty('_ct')
    expect(TestEntity.defaults).toHaveProperty('_md')
    expect(TestEntity._tpAlias).toBe('type')
  }) // creates entity w/ table


})
