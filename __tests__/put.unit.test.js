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
    simple_string: 'string',
    test_composite: ['sort',0, { save: true }],
    test_composite2: ['sort',1]
  },
  table: TestTable
})

const TestTable2 = new Table({
  name: 'test-table',
  partitionKey: 'pk',
  DocumentClient
})

const TestEntity2 = new Entity({
  name: 'TestEntity2',
  autoExecute: false,
  attributes: {
    email: { type: 'string', partitionKey: true },
    sort: { type: 'string', map: 'sk' },
    test_composite: ['sort',0, { save: true }],
    test_composite2: ['sort',1]
  },
  table: TestTable2
})

const TestEntity3 = new Entity({
  name: 'TestEntity3',
  autoExecute: false,
  attributes: {
    email: { type: 'string', partitionKey: true },
    test: { required: true },
    test2: 'string'
  },
  table: TestTable2
})

describe('put',()=>{

  it('creates basic item',() => {
    let { TableName, Item } = TestEntity.generatePutParams({ pk: 'test-pk', sk: 'test-sk' })

    expect(Item.pk).toBe('test-pk')
    expect(Item.sk).toBe('test-sk')
    expect(Item._tp).toBe('TestEntity')
    expect(Item.test_string).toBe('test string')
    expect(Item).toHaveProperty('_ct')
    expect(Item).toHaveProperty('_md')
  })

  it('creates item with aliases',() => {
    let { Item } = TestEntity.generatePutParams({ email: 'test-pk', sort: 'test-sk', count: 5 })
    
    expect(Item.pk).toBe('test-pk')
    expect(Item.sk).toBe('test-sk')
    expect(Item.test_number).toBe(5)
    expect(Item._tp).toBe('TestEntity')
    expect(Item.test_string).toBe('test string')
    expect(Item).toHaveProperty('_ct')
    expect(Item).toHaveProperty('_md')
  })

  it('creates item with default override',() => {
    let { Item } = TestEntity.generatePutParams({ pk: 'test-pk', sk: 'test-sk', test_string: 'different value' })
    expect(Item.pk).toBe('test-pk')
    expect(Item.sk).toBe('test-sk')
    expect(Item._tp).toBe('TestEntity')
    expect(Item.test_string).toBe('different value')
    expect(Item).toHaveProperty('_ct')
    expect(Item).toHaveProperty('_md')
  })

  it('creates item with saved composite field',() => {
    let { Item } = TestEntity2.generatePutParams({
      pk: 'test-pk',
      test_composite: 'test',
    })  
    expect(Item.pk).toBe('test-pk')
    expect(Item.test_composite).toBe('test')
  })

  it('creates item that ignores field with no value',() => {
    let { Item } = TestEntity2.generatePutParams({
      pk: 'test-pk',
      test_composite: undefined
    })
    
    expect(Item.pk).toBe('test-pk')
    expect(Item).not.toHaveProperty('sk')
    expect(Item).not.toHaveProperty('test_composite')
  })

  it('creates item that overrides composite key',() => {
    let { Item } = TestEntity2.generatePutParams({
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
    let { Item } = TestEntity2.generatePutParams({
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
    expect(() => TestEntity.generatePutParams()).toThrow(`'pk' or 'email' is required`)
  })

  it('fails when using an undefined schema field', () => {
    expect(() => TestEntity.generatePutParams({
      'pk': 'test-pk',
      'sk': 'test-sk',
      'unknown': '?'
    })).toThrow(`Field 'unknown' does not have a mapping or alias`)
  })

  it('fails when invalid string provided with no coercion', () => {
    expect(() => TestEntity.generatePutParams({
      'pk': 'test-pk',
      'sk': 'test-sk',
      'test_string': 1
    })).toThrow(`'test_string' must be of type string`)
  })

  it('fails when invalid boolean provided with no coercion', () => {
    expect(() => TestEntity.generatePutParams({
      'pk': 'test-pk',
      'sk': 'test-sk',
      'test_boolean': 'x'
    })).toThrow(`'test_boolean' must be of type boolean`)
  })

  it('fails when invalid number provided with no coercion', () => {
    expect(() => TestEntity.generatePutParams({
      'pk': 'test-pk',
      'sk': 'test-sk',
      'test_number': 'x'
    })).toThrow(`'test_number' must be of type number`)
  })

  it('fails when invalid number cannot be coerced', () => {
    expect(() => TestEntity.generatePutParams({
      'pk': 'test-pk',
      'sk': 'test-sk',
      'test_number_coerce': 'x1'
    })).toThrow(`Could not convert 'x1' to a number for 'test_number_coerce'`)
  })

  it('fails when invalid array provided with no coercion', () => {
    expect(() => TestEntity.generatePutParams({
      'pk': 'test-pk',
      'sk': 'test-sk',
      'test_list': 'x'
    })).toThrow(`'test_list' must be a list (array)`)
  })

  it('fails when invalid map provided', () => {
    expect(() => TestEntity.generatePutParams({
      'pk': 'test-pk',
      'sk': 'test-sk',
      'test_map': 'x'
    })).toThrow(`'test_map' must be a map (object)`)
  })

  it('fails when set contains different types', () => {
    expect(() => TestEntity.generatePutParams({
      'pk': 'test-pk',
      'sk': 'test-sk',
      'test_string_set_type': [1,2,3]
    })).toThrow(`'test_string_set_type' must be a valid set (array) containing only string types`)
  })

  it('fails when set contains multiple types', () => {
    expect(() => TestEntity.generatePutParams({
      'pk': 'test-pk',
      'sk': 'test-sk',
      'test_string_set': ['test',1]
    })).toThrow(`String Set contains Number value`)
  })

  it('fails when set coerces array and doesn\'t match type', () => {
    expect(() => TestEntity.generatePutParams({
      'pk': 'test-pk',
      'sk': 'test-sk',
      'test_number_set_type_coerce': "1,2,3"
    })).toThrow(`'test_number_set_type_coerce' must be a valid set (array) of type number`)
  })

  it('coerces array into set', () => {
    let { Item } = TestEntity.generatePutParams({
      'pk': 'test-pk',
      'sk': 'test-sk',
      'test_string_set_type_coerce': "1,2,3"
    })
    expect(Item['test_string_set_type_coerce'].values).toEqual(['1','2','3'])
  })

  it('fails when set doesn\'t contain array with no coercion', () => {
    expect(() => TestEntity.generatePutParams({
      'pk': 'test-pk',
      'sk': 'test-sk',
      'test_string_set': 'test'
    })).toThrow(`'test_string_set' must be a valid set (array)`)
  })

  it('fails when missing a required field', () => {
    expect(() => TestEntity3.generatePutParams({
      'pk': 'test-pk',
      'test2': 'test'
    })).toThrow(`'test' is a required field`)
  })

})
