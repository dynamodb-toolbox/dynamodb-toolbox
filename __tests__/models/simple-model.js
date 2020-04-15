// SIMPLE MODEL for testing

module.exports = {
  // Include table name
  table: 'simple-table',

  // Include model field
  model: false,

  // Include timestamps
  timestamps: false,

  // Define partition and sort keys
  partitionKey: 'pk',

  // Define schema
  schema: {
    pk: { type: 'string' },
    sk: { type: 'string', hidden: true },
    test: { type: 'string' },
    test_composite: ['sk',0, { save: true }],
    test_composite2: ['sk',1],
    test_undefined: { default: () => undefined }
  },
  
  // Define delimiter
  delimiter: '|'
}
