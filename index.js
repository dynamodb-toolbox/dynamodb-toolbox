'use strict'

/**
 * DynamoDB Toolbox: A simple set of tools for working with Amazon DynamoDB
 * @author Jeremy Daly <jeremy@jeremydaly.com>
 * @version 0.2.0
 * @license MIT
 */

// TODO: Check param merging
// TODO: 'Remove null fields' option
// TODO: prevent reserved field names?

const Table = require('./build/classes/Table')
const Entity = require('./build/classes/Entity')

module.exports = {
  Table,
  Entity
}
