const AWS = require('aws-sdk')
const dynalite = require('dynalite')

module.exports.dynaliteServer = dynalite({
  createTableMs: 0,
  updateTableMs: 0,
  deleteTableMs: 0
})

module.exports.DynamoDB = new AWS.DynamoDB({
  endpoint: 'http://localhost:4567',
  region: 'us-east-1',
  credentials: new AWS.Credentials({ accessKeyId: 'test', secretAccessKey: 'test' })
})

module.exports.DocumentClient = new AWS.DynamoDB.DocumentClient({
  endpoint: 'http://localhost:4567',
  region: 'us-east-1',
  credentials: new AWS.Credentials({ accessKeyId: 'test', secretAccessKey: 'test' }),
})
