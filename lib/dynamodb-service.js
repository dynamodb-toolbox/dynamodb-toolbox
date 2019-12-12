'use strict'

/**
 * DynamoDB Toolbox: A simple set of tools for working with Amazon DynamoDB
 * @author Jeremy Daly <jeremy@jeremydaly.com>
 * @license MIT
 */

// Require DynamoDB client
const DynamoDB = require('aws-sdk/clients/dynamodb')

// Export
module.exports = new DynamoDB.DocumentClient()
