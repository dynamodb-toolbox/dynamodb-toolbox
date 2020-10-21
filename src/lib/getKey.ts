'use strict'

/**
 * DynamoDB Toolbox: A simple set of tools for working with Amazon DynamoDB
 * @author Jeremy Daly <jeremy@jeremydaly.com>
 * @license MIT
 */

import validateTypes from './validateTypes'
import { error, transformAttr } from './utils'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

// Get partitionKey/sortKey
export default (DocumentClient: DocumentClient) => (data: any, schema: any, partitionKey: any, sortKey: any) => {

  // TODO: Think about a better way to reference pk/sk - can it work with secondary indexes?
  partitionKey = schema[partitionKey].map || partitionKey
  sortKey = (schema[sortKey] && schema[sortKey].map) || sortKey || null

  // Intialize validate type
  let validateType = validateTypes(DocumentClient)

  let pk = data[partitionKey] ||
      error(`'${partitionKey}'${schema[partitionKey].alias ? ` or '${schema[partitionKey].alias}'` : ''} is required`)

  let sk = sortKey === null || data[sortKey] ||
      error(`'${sortKey}'${schema[sortKey].alias ? ` or '${schema[sortKey].alias}'` : ''} is required`)

  return Object.assign(
    { [partitionKey]: transformAttr(schema[partitionKey],validateType(schema[partitionKey],partitionKey,pk),data) },
    sortKey !== null ? { [sortKey]: transformAttr(schema[sortKey],validateType(schema[sortKey],sortKey,sk),data) } : {}
  ) // end assign
} // end get keys
