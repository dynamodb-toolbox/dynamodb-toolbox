const { Model } = require('../index')

// Define main model for testing
const TestModel = new Model('TestModel',require('./models/test-model'))

// Define simple model for testing
const SimpleModel = new Model('SimpleModel',require('./models/simple-model'))

// Define simple model wity sortKey for testing
const SimpleModelSk = new Model('SimpleModelSk',require('./models/simple-model-sk'))

// Define simple model for testing
const SimpleModelReq = new Model('SimpleModelReq',require('./models/simple-model-req'))

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
