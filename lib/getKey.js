'use strict'

/**
 * DynamoDB Toolbox: A simple set of tools for working with Amazon DynamoDB
 * @author Jeremy Daly <jeremy@jeremydaly.com>
 * @license MIT
 */

const validateTypes = require('./validateTypes')
const { error } = require('./utils')

// Get partitionKey/sortKey
module.exports = (DocumentClient) => (data,schema,partitionKey,sortKey) => {

  // TODO: Think about a better way to reference pk/sk - can it work with secondary indexes?
  partitionKey = schema[partitionKey].map || partitionKey
  sortKey = (schema[sortKey] && schema[sortKey].map) || sortKey

  // Intialize validate type
  let validateType = validateTypes(DocumentClient)

  let pk = data[partitionKey] ||
      error(`'${partitionKey}'${schema[partitionKey].alias ? ` or '${schema[partitionKey].alias}'` : ''} is required`)

  let sk = sortKey === null || data[sortKey] ||
      error(`'${sortKey}'${schema[sortKey].alias ? ` or '${schema[sortKey].alias}'` : ''} is required`)

  return Object.assign(
    { [partitionKey]: validateType(schema[partitionKey],partitionKey,pk,data) },
    sortKey !== null ? { [sortKey]: validateType(schema[sortKey],sortKey,sk,data) } : {}
  ) // end assign
} // end get keys
