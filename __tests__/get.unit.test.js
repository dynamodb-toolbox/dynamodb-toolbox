const { Model } = require('../index')

// Define main model for testing
const TestModel = new Model('TestModel',require('./models/test-model'))

// Define simple model for testing
const SimpleModel = new Model('SimpleModel',require('./models/simple-model'))

// Define simple model wity sortKey for testing
const SimpleModelSk = new Model('SimpleModelSk',require('./models/simple-model-sk'))

// Define simple model for testing
const SimpleModelReq = new Model('SimpleModelReq',require('./models/simple-model-req'))

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
