'use strict'

/**
 * DynamoDB Toolbox: A simple set of tools for working with Amazon DynamoDB
 * @author Jeremy Daly <jeremy@jeremydaly.com>
 * @version 0.2.0
 * @license MIT
 */

const Table = require('./classes/Table')
const Entity = require('./classes/Entity')

module.exports = {
  Table,
  Entity
}


// TODO: prevent reserved field names?
