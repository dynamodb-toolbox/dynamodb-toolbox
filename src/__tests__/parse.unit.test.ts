import { DocumentClient } from './bootstrap-tests'

// Import Table and Entity classes
import Table from '../classes/Table'
import Entity from '../classes/Entity/Entity'

// Create basic entity
const TestEntity = new Entity(require('./entities/test-entity.ts'))
const SimpleEntity = new Entity(require('./entities/simple-entity.ts'))

// Create basic table
const TestTable = new Table({
  name: 'test-table',
  partitionKey: 'pk',
  sortKey: 'sk',
  entities: [TestEntity, SimpleEntity],
  DocumentClient
})

const CompositeEntity = new Entity({
  // Specify entity name
  name: 'CompositeEntity',

  // Define attributes
  attributes: {
    pk: { type: 'string', partitionKey: true },
    sk: { type: 'string', sortKey: true, hidden: true },
    test_composite: ['sk', 0, { save: true }],
    test_composite2: ['sk', 1, { save: false }],
    test_composite3: ['sk', 2, {}]
  },
  table: TestTable
} as const)

describe('parse', () => {
  it('parses single item', () => {
    let item = TestEntity.parse({
      pk: 'test@test.com',
      sk: 'email',
      test_string: 'test',
      _et: 'TestEntity'
    })
    expect(item).toEqual({
      email: 'test@test.com',
      test_type: 'email',
      test_string: 'test',
      entity: 'TestEntity'
    })
  })

  it('parses single item and includes certain fields', () => {
    let item = TestEntity.parse(
      { pk: 'test@test.com', sk: 'email', test_string: 'test', _et: 'TestEntity' },
      ['email', 'sk']
    )
    expect(item).toEqual({
      email: 'test@test.com',
      test_type: 'email'
    })
  })

  it('parses multiple items', () => {
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

  it('parses multiple items and incudes certain field', () => {
    let items = TestEntity.parse(
      [
        { pk: 'test@test.com', sk: 'email', test_string: 'test' },
        { pk: 'test2@test.com', sk: 'email2', test_string: 'test2' }
      ],
      ['pk', 'test_string']
    )
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

  it('parses composite field', () => {
    let item = SimpleEntity.parse({
      pk: 'test@test.com',
      sk: 'active#email',
      test_composite: 'test'
    })
    expect(item).toEqual({
      pk: 'test@test.com',
      test_composite: 'test',
      test_composite2: 'email'
    })
  })

  // it('parses composite field without "save"', ()=>{
  //   let item = CompositeEntity.parse({
  //     pk: 'test@test.com',
  //     sk: 'active#email#foo',
  //     test_composite: 'test'
  //   })
  //   expect(item).toEqual({
  //     pk: 'test@test.com',
  //     test_composite: 'test',
  //     test_composite2: 'email',
  //     test_composite3: 'foo'
  //   })
  // })
}) // end parse
