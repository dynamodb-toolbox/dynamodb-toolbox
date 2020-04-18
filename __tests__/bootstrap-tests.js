// Load simple table creation parameters
module.exports.createTableParams = require('./tables/create-table.json')

// Include dynalite and config server (use in memory)
const dynalite = require('dynalite')
module.exports.dynaliteServer = dynalite({
  createTableMs: 0,
  updateTableMs: 0,
  deleteTableMs: 0
})

// Load AWS SDK
const AWS = require('aws-sdk')

// Create DynamoDB connection to dynalite
module.exports.DynamoDB = new AWS.DynamoDB({
  endpoint: 'http://localhost:4567',
  region: 'us-east-1',
  credentials: new AWS.Credentials({ accessKeyId: 'test', secretAccessKey: 'test' })
})

// Create our document client
module.exports.DocumentClient = new AWS.DynamoDB.DocumentClient({
  endpoint: 'http://localhost:4567',
  region: 'us-east-1',
  credentials: new AWS.Credentials({ accessKeyId: 'test', secretAccessKey: 'test' })
})

// Delay helper
module.exports.delay = ms => new Promise(res => setTimeout(res, ms))