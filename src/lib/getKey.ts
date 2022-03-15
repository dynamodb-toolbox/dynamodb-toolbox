/**
 * DynamoDB Toolbox: A simple set of tools for working with Amazon DynamoDB
 * @author Jeremy Daly <jeremy@jeremydaly.com>
 * @license MIT
 */

import validateTypes from './validateTypes'
import { error, transformAttr } from './utils'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

// Get partitionKey/sortKey
export default (DocumentClient: DynamoDBDocumentClient) => (data: any, schema: any, partitionKey: any, sortKey: any) => {

  // TODO: Think about a better way to reference pk/sk - can it work with secondary indexes?
  partitionKey = schema[partitionKey].map || partitionKey
  sortKey = (schema[sortKey] && schema[sortKey].map) || sortKey || null

  // Intialize validate type
  let validateType = validateTypes(DocumentClient)

  // TODO: Add tests for 0 values
  let pk = data[partitionKey]
  if (pk === undefined || pk === null || pk === '') {
    error(`'${partitionKey}'${schema[partitionKey].alias ? ` or '${schema[partitionKey].alias}'` : ''} is required`)
  }

  const sk = data[sortKey]
  if (sortKey && (sk === undefined || sk === null || sk === '')) {
    error(`'${sortKey}'${schema[sortKey].alias ? ` or '${schema[sortKey].alias}'` : ''} is required`)
  }

  return Object.assign(
    { [partitionKey]: transformAttr(schema[partitionKey],validateType(schema[partitionKey],partitionKey,pk),data) },
    sortKey !== null ? { [sortKey]: transformAttr(schema[sortKey],validateType(schema[sortKey],sortKey,sk),data) } : {}
  ) // end assign
} // end get keys
