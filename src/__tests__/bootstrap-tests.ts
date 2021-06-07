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
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

// Create DynamoDB connection to dynalite
export const ddbClient = new DynamoDBClient({
  endpoint: 'http://localhost:4567',
  region: 'us-east-1',
  credentials: {
    accessKeyId: 'test',
    secretAccessKey: 'test',
  },
})

const marshallOptions = {
  // Whether to automatically convert empty strings, blobs, and sets to `null`.
  convertEmptyValues: false, // false, by default.
  // Whether to remove undefined values while marshalling.
  removeUndefinedValues: false, // false, by default.
  // Whether to convert typeof object to map attribute.
  convertClassInstanceToMap: false, // false, by default.
}

const unmarshallOptions = {
  // Whether to return numbers as a string instead of converting them to native JavaScript numbers.
  wrapNumbers: false, // false, by default.
}

const translateConfig = { marshallOptions, unmarshallOptions }

// Create the DynamoDB Document client.
export const ddbDocClient = DynamoDBDocumentClient.from(ddbClient, translateConfig)

// Delay helper
export const delay = (ms: number) => new Promise((res) => setTimeout(res, ms))
