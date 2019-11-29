const { Model } = require('../index')

// Define main model for testing
const TestModel = new Model('TestModel',require('./models/test-model'))

// Define simple model for testing
const SimpleModel = new Model('SimpleModel',require('./models/simple-model'))

// Define simple model wity sortKey for testing
const SimpleModelSk = new Model('SimpleModelSk',require('./models/simple-model-sk'))

// Define simple model for testing
const SimpleModelReq = new Model('SimpleModelReq',require('./models/simple-model-req'))

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
