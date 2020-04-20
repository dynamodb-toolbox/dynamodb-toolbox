
describe.skip('parse',()=>{

  it('parses single item', ()=>{
    let item = TestModel.parse({ pk: 'test@test.com', sk: 'email', test_string: 'test', __model: 'Test' })
    expect(item).toEqual({
      email: 'test@test.com',
      type: 'email',
      test_string: 'test'
    })
  })

  it('parses single item and omits a field', ()=>{
    let item = TestModel.parse({ pk: 'test@test.com', sk: 'email', test_string: 'test', __model: 'Test', to_omit: 'test' },['to_omit'])
    expect(item).toEqual({
      email: 'test@test.com',
      type: 'email',
      test_string: 'test'
    })
  })

  it('parses multiple items', ()=>{
    let items = TestModel.parse([
      { pk: 'test@test.com', sk: 'email', test_string: 'test' },
      { pk: 'test2@test.com', sk: 'email2', test_string: 'test2' }
    ])
    expect(items).toEqual([
      {
        email: 'test@test.com',
        type: 'email',
        test_string: 'test'
      },
      {
        email: 'test2@test.com',
        type: 'email2',
        test_string: 'test2'
      }
    ])
  })

  it('parses multiple items and omits a field', ()=>{
    let items = TestModel.parse([
      { pk: 'test@test.com', sk: 'email', test_string: 'test', to_omit: 'test' },
      { pk: 'test2@test.com', sk: 'email2', test_string: 'test2', to_omit: 'test' }
    ],['to_omit'])
    expect(items).toEqual([
      {
        email: 'test@test.com',
        type: 'email',
        test_string: 'test'
      },
      {
        email: 'test2@test.com',
        type: 'email2',
        test_string: 'test2'
      }
    ])
  })

  it('parses composite field', ()=>{
    let item = SimpleModel.parse({ pk: 'test@test.com', sk: 'active#email', test_composite: 'test' })
    expect(item).toEqual({
      pk: 'test@test.com',
      test_composite: 'test',
      test_composite2: 'email',
    })
  })


}) // end parse
