const { DocumentClient } = require('./bootstrap-tests')

// Require Table and Entity classes
const Table = require('../classes/Table')
const Entity = require('../classes/Entity')

// Create basic entity
const TestEntity = new Entity(require('./entities/test-entity.js'))
const SimpleEntity = new Entity(require('./entities/simple-entity.js'))

// Create basic table
const TestTable = new Table({
  name: 'test-table',
  partitionKey: 'pk',
  sortKey: 'sk',
  entities: [TestEntity,SimpleEntity],
  DocumentClient
})


describe('parse',()=>{

  it('parses single item', ()=>{
    let item = TestEntity.parse({ pk: 'test@test.com', sk: 'email', test_string: 'test', _et: 'TestEntity' })
    expect(item).toEqual({
      email: 'test@test.com',
      test_type: 'email',
      test_string: 'test',
      entity: 'TestEntity'
    })
  })

  it('parses single item and includes certain fields', ()=>{
    let item = TestEntity.parse({ pk: 'test@test.com', sk: 'email', test_string: 'test', _et: 'TestEntity' }, ['email','sk'])
    expect(item).toEqual({
      email: 'test@test.com',
      test_type: 'email'
    })
  })

  it('parses multiple items', ()=>{
    let items = TestEntity.parse([
      { pk: 'test@test.com', sk: 'email', test_string: 'test' },
      { pk: 'test2@test.com', sk: 'email2', test_string: 'test2' }
    ])
    expect(items).toEqual([
      {
        email: 'test@test.com',
        test_type: 'email',
        test_string: 'test'
      },
      {
        email: 'test2@test.com',
        test_type: 'email2',
        test_string: 'test2'
      }
    ])
  })

  it('parses multiple items and incudes certain field', ()=>{
    let items = TestEntity.parse([
      { pk: 'test@test.com', sk: 'email', test_string: 'test' },
      { pk: 'test2@test.com', sk: 'email2', test_string: 'test2' }
    ],['pk','test_string'])
    expect(items).toEqual([
      {
        email: 'test@test.com',
        test_string: 'test'
      },
      {
        email: 'test2@test.com',
        test_string: 'test2'
      }
    ])
  })

  it('parses composite field', ()=>{
    let item = SimpleEntity.parse({ pk: 'test@test.com', sk: 'active#email', test_composite: 'test' })
    expect(item).toEqual({
      pk: 'test@test.com',
      test_composite: 'test',
      test_composite2: 'email'
    })
  })


}) // end parse
