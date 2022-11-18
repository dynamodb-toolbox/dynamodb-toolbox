import Table from '../classes/Table'
import Entity from '../classes/Entity'
import { DocumentClient } from './bootstrap.test'

const TestEntity = new Entity({
  name: 'TestEntity',
  attributes: {
    email: { type: 'string', partitionKey: true },
    test_type: { type: 'string', sortKey: true },
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
    simple_string: 'string',
    format_simple_string: {
      type: 'string',
      format: (input: string) => input.toUpperCase(),
    }
  }
})
const SimpleEntity = new Entity({
  name: 'SimpleEntity',

  attributes: {
    pk: { type: 'string', partitionKey: true },
    sk: { type: 'string', hidden: true, sortKey: true },
    test: { type: 'string' },
    test_composite: ['sk', 0, { save: true }],
    test_composite2: ['sk', 1, { save: false }],
    test_undefined: { default: () => undefined }
  }
})

new Table({
  name: 'test-table',
  partitionKey: 'pk',
  sortKey: 'sk',
  entities: [TestEntity, SimpleEntity],
  DocumentClient
})

describe('parse', () => {
  it('parses single item', () => {
    const item = TestEntity.parse({
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
    const item = TestEntity.parse(
      { pk: 'test@test.com', sk: 'email', test_string: 'test', _et: 'TestEntity' },
      ['email', 'sk']
    )
    expect(item).toEqual({
      email: 'test@test.com',
      test_type: 'email'
    })
  })

  it('parses multiple items', () => {
    const items = TestEntity.parse([
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
    const items = TestEntity.parse(
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
    const item = SimpleEntity.parse({
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
