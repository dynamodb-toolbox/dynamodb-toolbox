'use strict'

/**
 * DynamoDB Toolbox: A simple set of tools for working with Amazon DynamoDB
 * @author Jeremy Daly <jeremy@jeremydaly.com>
 * @license MIT
 */

const parseAttributes = require('./parseTableAttributes')
const { error } = require('./utils')

// Parse table
module.exports = table => {

  // Table name
  const name = typeof table.name === 'string'
    && table.name.trim().length > 0 ? table.name.trim()
    : error(`'name' must be defined`)

  // Specify partitionKey attribute
  const partitionKey = typeof table.partitionKey === 'string'
    && table.partitionKey.trim().length > 0 ? table.partitionKey.trim()
    : error(`'partitionKey' must be defined`)

  // Specify sortKey attribute (optional)
  const sortKey = typeof table.sortKey === 'string'
    && table.sortKey.trim().length > 0 ? table.sortKey.trim()
    : table.sortKey ? error(`'sortKey' must be string value`)
    : null

  // Disable, or rename field for entity tracking
  const entityField = table.entityField === false ? false
    : typeof table.entityField === 'string' && table.entityField.trim().length > 0 ?
      table.entityField.trim()
      : '_tp'

  // Parse table attributes
  const attributes = typeof table.attributes === 'object' && !Array.isArray(table.attributes) ?
    table.attributes
    : table.attributes ? error(`Please provide a valid 'attributes' object`)
    : {}

  // Add entityField to attributes
  if (entityField) attributes[entityField] = 'string'

  // Parse LSIs (optional)
  const lsis = typeof table.lsis === 'object' && !Array.isArray(table.lsis) ?
    parseLSIs(table.lsis)
    : table.lsis ? error(`Please provide a valid 'lsis' object`)
    : {}

  // Parse GSIs (optional)
  const gsis = typeof table.gsis === 'object' && !Array.isArray(table.gsis) ?
    parseGSIs(table.gsis)
    : table.gsis ? error(`Please provide a valid 'gsis' object`)
    : {}

  // Set auto execute and parse flags
  const autoExecute = table.autoExecute
  const autoParse = table.autoParse

  // Return the table
  return {
    name,
    Table: {
      partitionKey,
      sortKey,
      entityField,
      attributes: parseAttributes(attributes,partitionKey,sortKey),
      lsis,
      gsis
    },
    autoExecute,
    autoParse,
    Entities: [] // init Entity tracker
  } // end table

} // end parseTable


// Parse LSIs
const parseLSIs = lsis => Object.keys(lsis).reduce((acc,index) => {
  return Object.assign(acc,{ [index]: lsis[index] })
},{})

// Parse LSIs
const parseGSIs = gsis => Object.keys(gsis).reduce((acc,index) => {
  return Object.assign(acc,{ [index]: gsis[index] })
},{})