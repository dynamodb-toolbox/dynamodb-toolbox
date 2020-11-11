// SIMPLE ENTITY for testing

export = {
  // Specify entity name
  name: 'SimpleEntity',

  // Define attributes
  attributes: {
    pk: { type: 'string', partitionKey: true },
    sk: { type: 'string', hidden: true, sortKey: true },
    test: { type: 'string' },
    test_composite: ['sk',0, { save: true }],
    test_composite2: ['sk',1, { save: false }],
    test_undefined: { default: () => undefined }
  }
}
