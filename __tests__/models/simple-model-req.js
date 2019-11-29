// SIMPLE MODEL w/ REQUIRED fields for testing

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
    test: { type: 'string', required: true },
    test2: { type: 'string', required: 'always' }
  }
}
