const { Table, Entity } = require('../index')
const { DocumentClient } = require('./bootstrap-tests')

let TestTable
let TestEntity

describe('entities',()=>{

  beforeEach(() => {
    TestTable = new Table({
      name: 'test-table',
      partitionKey: 'pk',
      sortKey: 'sk',
      indexes: { 
        GSI1: { partitionKey: 'GSI1pk', sortKey: 'GSI1sk' },
        GSI2: { partitionKey: 'GSI1pk' }
      },
      DocumentClient,
      attributes: {
        strongType: 'list'
      }
    })
    
    TestEntity = new Entity({
      name: 'TestEntity',
      autoExecute: false,
      attributes: {
        email: { type: 'string', partitionKey: true },
        sort: { type: 'string', sortKey: true },
        test: 'string'
      }
    })    
  })

  it('fails when assigning the same entity to the table', () => {
    TestTable.entities = TestEntity
    expect(() => { TestTable.entities = TestEntity })
      .toThrow(`Entity name 'TestEntity' already exists`)
  })


  it('fails when assigning the same entity to the table', () => {
    
    TestEntity2 = new Entity({
      name: 'TestEntity',
      attributes: {
        email: { type: 'string', partitionKey: true },
        sort: { type: 'string', sortKey: true }
      }
    }) 

    TestTable.entities = TestEntity
    expect(() => { TestTable.entities = TestEntity2 })
      .toThrow(`Entity name 'TestEntity' already exists`)
  })

  it('fails when using a reserved word as an entity name', () => {
    
    TestEntity = new Entity({
      name: 'query',
      attributes: {
        email: { type: 'string', partitionKey: true },
        sort: { type: 'string', sortKey: true }
      }
    }) 

    expect(() => { TestTable.entities = TestEntity })
      .toThrow(`'query' is a reserved word and cannot be used to name an Entity`)
  })

  it('fails when missing a sort key', () => {
    
    TestEntity = new Entity({
      name: 'TestEntity',
      attributes: {
        email: { type: 'string', partitionKey: true },
        sort: { type: 'string' }
      }
    }) 

    expect(() => { TestTable.entities = TestEntity })
      .toThrow(`TestEntity entity does not have a sortKey defined`)
  })

  it('fails when a sort key should not be defined', () => {
    
    TestTable = new Table({
      name: 'test-table',
      partitionKey: 'pk'
    })

    TestEntity = new Entity({
      name: 'TestEntity',
      attributes: {
        email: { type: 'string', partitionKey: true },
        sort: { type: 'string', sortKey: true }
      }
    }) 

    expect(() => { TestTable.entities = TestEntity })
      .toThrow(`TestEntity entity contains a sortKey, but the Table does not`)
  })

  it('fails when table key name conflicts with an attribute name', () => {
    
    TestEntity = new Entity({
      name: 'TestEntity',
      attributes: {
        email: { type: 'string', partitionKey: true },
        sort: { type: 'string', sortKey: true },
        pk: 'string'
      }
    }) 

    expect(() => { TestTable.entities = TestEntity })
      .toThrow(`The Table's partitionKey name (pk) conflicts with an Entity attribute name`)
  })

  it('Maps a secondary index', () => {
    
    TestEntity = new Entity({
      name: 'TestEntity',
      attributes: {
        email: { type: 'string', partitionKey: true },
        sort: { type: 'string', sortKey: true },
        GSI1pk: { partitionKey: 'GSI1' },
        GSI1sk: { sortKey: 'GSI1' }
      },
      table: TestTable
    }) 

    expect(TestEntity.schema.keys).toHaveProperty('GSI1')    
  })

  it('fails when mapping an invalid secondary index', () => {
    
    TestEntity = new Entity({
      name: 'TestEntity',
      attributes: {
        email: { type: 'string', partitionKey: true },
        sort: { type: 'string', sortKey: true },
        GSI1pk: { partitionKey: 'GSI1x' }
      }
    }) 

    expect(() => { TestTable.entities = TestEntity })
      .toThrow(`'GSI1x' is not a valid secondary index name`)
  })

  it('fails when mapping an invalid key for a secondary index', () => {
    
    TestEntity = new Entity({
      name: 'TestEntity',
      attributes: {
        email: { type: 'string', partitionKey: true },
        sort: { type: 'string', sortKey: true },
        GSI2pk: { partitionKey: 'GSI2' },
        GSI2sk: { sortKey: 'GSI2' }
      }
    }) 

    expect(() => { TestTable.entities = TestEntity })
      .toThrow(`TestEntity contains a sortKey, but it is not used by GSI2`)
  })

  it('fails when secondary index mapping conflicts with an entity attribute', () => {
    
    TestEntity = new Entity({
      name: 'TestEntity',
      attributes: {
        email: { type: 'string', partitionKey: true },
        sort: { type: 'string', sortKey: true },
        GSI1pk: { partitionKey: 'GSI1' },
        GSI1skx: { sortKey: 'GSI1' },
        GSI1sk: 'string'
      }
    }) 
    expect(() => { TestTable.entities = TestEntity })
      .toThrow(`GSI1's sortKey name (GSI1sk) conflicts with another Entity attribute name`)
  })

  it('fails when secondary index mapping is missing either the partition or sort key', () => {
    
    TestEntity = new Entity({
      name: 'TestEntity',
      attributes: {
        email: { type: 'string', partitionKey: true },
        sort: { type: 'string', sortKey: true },
        GSI1pk: { partitionKey: 'GSI1' },
        // GSI1sk: {  },
      }
    }) 
    expect(() => { TestTable.entities = TestEntity })
      .toThrow(`GSI1 requires mappings for both the partitionKey and the sortKey`)
  })

  it('fails when attribute conflicts with entityField', () => {
    
    TestEntity = new Entity({
      name: 'TestEntity',
      attributes: {
        email: { type: 'string', partitionKey: true },
        sort: { type: 'string', sortKey: true },
        _tp: 'string'
        
      }
    }) 
    expect(() => { TestTable.entities = TestEntity })
      .toThrow(`Attribute or alias '_tp' conflicts with the table's 'entityField' mapping or entity alias`)
  })

  it(`fails when attribute type conflicts with table's type`, () => {
    
    TestEntity = new Entity({
      name: 'TestEntity',
      attributes: {
        email: { type: 'string', partitionKey: true },
        sort: { type: 'string', sortKey: true },
        strongType: 'number'
        
      }
    }) 
    expect(() => { TestTable.entities = TestEntity })
      .toThrow(`TestEntity attribute type for 'strongType' (number) does not match table's type (list)`)
  })

  it(`adds setType to set types`, () => {
    
    TestEntity = new Entity({
      name: 'TestEntity',
      attributes: {
        email: { type: 'string', partitionKey: true },
        sort: { type: 'string', sortKey: true },
        testSet: { type: 'set', setType: 'number' }
      },
      table: TestTable
    }) 

    TestEntity2 = new Entity({
      name: 'TestEntity2',
      attributes: {
        email: { type: 'string', partitionKey: true },
        sort: { type: 'string', sortKey: true },
        testSet: { type: 'set', setType: 'string' }
      },
      table: TestTable
    }) 
    expect(TestTable.Table.attributes.testSet.mappings.TestEntity._setType).toBe('number')
    expect(TestTable.Table.attributes.testSet.mappings.TestEntity2._setType).toBe('string')
  })

  
  it(`fails on invalid entity assignement`, () => {    
    expect(() => { TestTable.entities = {} })
      .toThrow(`Invalid Entity`)
  })

})
