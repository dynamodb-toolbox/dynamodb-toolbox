const Table = require('../../classes/Table')
const { DocumentClient } = require('../bootstrap-tests')

module.exports = new Table({
  name: 'test-table',
  partitionKey: 'pk',
  sortKey: 'sk',
  DocumentClient
})