// Include dynalite and config server (use in memory)
// @ts-ignore: No type file available
import dynalite from 'dynalite'

// Load simple table creation parameters
export const createTableParams = require('./tables/create-table.json')

export const dynaliteServer = dynalite({
  createTableMs: 0,
  updateTableMs: 0,
  deleteTableMs: 0,
})

// Load AWS SDK
import AWS from 'aws-sdk'

// Create DynamoDB connection to dynalite
export const DynamoDB = new AWS.DynamoDB({
  endpoint: 'http://localhost:4567',
  region: 'us-east-1',
  credentials: new AWS.Credentials({
    accessKeyId: 'test',
    secretAccessKey: 'test',
  }),
})

// Create our document client
export const DocumentClient = new AWS.DynamoDB.DocumentClient({
  endpoint: 'http://localhost:4567',
  region: 'us-east-1',
  credentials: new AWS.Credentials({
    accessKeyId: 'test',
    secretAccessKey: 'test',
  }),
  // convertEmptyValues: true
})

// Delay helper
export const delay = (ms: number) => new Promise((res) => setTimeout(res, ms))

export const DocumentClient2 = new AWS.DynamoDB.DocumentClient({
  region: 'us-east-1',
  credentials: new AWS.SharedIniFileCredentials({ profile: '' }),
  // convertEmptyValues: false
})