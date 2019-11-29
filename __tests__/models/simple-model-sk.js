// SIMPLE MODEL w/ SORT KEY for testing

module.exports = {
  // Include table name
  table: 'simple-table',

  // Include model field
  model: false,

  // Include timestamps
  timestamps: false,

  // Define partition and sort keys
  partitionKey: 'pk',
  sortKey: 'sk',

  // Define schema
  schema: {
    pk: { type: 'string' },
    sk: { type: 'string' },
    test: { type: 'string' }
  }
}
