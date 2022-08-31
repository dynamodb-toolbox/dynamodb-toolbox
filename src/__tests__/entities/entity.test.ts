// TEST ENTITY for testing

export = {
  // Specify name
  name: 'TestEntity',
  // Optional description
  // description: 'This is a test description for this entity',
  // Define attributes
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
    simple_string: 'string'
  }
}
