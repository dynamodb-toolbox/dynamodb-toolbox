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

  // Parse indexes (optional)
  const indexes = typeof table.indexes === 'object' && !Array.isArray(table.indexes) ?
    parseIndexes(table.indexes,partitionKey)
    : table.indexes ? error(`Please provide a valid 'indexes' object`)
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
      indexes
    },
    autoExecute,
    autoParse,
    Entities: [] // init Entity tracker
  } // end table

} // end parseTable


// Parse Indexes
const parseIndexes = (indexes,pk) => Object.keys(indexes).reduce((acc,index) => {
  
  // Destructure the index
  const { partitionKey, sortKey, ...args } = indexes[index]
  
  // Error on extraneous arguments
  if (Object.keys(args).length > 0)
    error(`Invalid index options: ${Object.keys(args).join(', ')}`)

  // Verify partitionKey
  if (partitionKey && typeof partitionKey !== 'string')
    error(`'partitionKey' for ${index} must be a string`)

  // Verify sortKey
  if (sortKey && typeof sortKey !== 'string')
    error(`'sortKey' for ${index} must be a string`)
  
  // Verify the presences of either pk or sk
  if (!sortKey && !partitionKey)
    error(`A 'partitionKey', 'sortKey' or both, must be provided for ${index}`)

  // Guess index type
  const type = !partitionKey || partitionKey === pk ? 'LSI' : 'GSI'

  // Return the structured index object
  return Object.assign(acc,{ 
    [index]: Object.assign({},
      partitionKey ? { partitionKey } : {},
      sortKey ? { sortKey } : {},
      { type }
    ) // end
  })
},{})