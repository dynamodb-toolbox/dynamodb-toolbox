/**
 * DynamoDB Toolbox: A simple set of tools for working with Amazon DynamoDB
 * @author Jeremy Daly <jeremy@jeremydaly.com>
 * @license MIT
 */

 // Import libraries, types, and classes
import parseAttributes from './parseTableAttributes'
import { error, hasValue } from './utils'
import { TableConstructor, TableIndexes } from '../classes/Table'

export type ParsedTable = ReturnType<typeof parseTable>

// Parse table
export const parseTable = (table: TableConstructor) => {

  let {
    name, // Table name
    alias, // For batch references
    partitionKey,
    sortKey,
    entityField,
    attributes,
    indexes,
    autoExecute,
    autoParse,
    removeNullAttributes,
    treatWhitespaceAsNull,
    entities,
    DocumentClient,
    ...args // extraneous config
  } = table


  // Error on extraneous arguments
  if (Object.keys(args).length > 0)
    error(`Invalid Table configuration options: ${Object.keys(args).join(', ')}`)

  // Table name
  name = typeof name === 'string' && name.trim().length > 0 ? name.trim()
    : error(`'name' must be defined`)

  // Verify alias
  alias = typeof alias === 'string'
    && alias.trim().length > 0 ? alias.trim()
    : alias ? error(`'alias' must be a string value`)
    : null

  // Specify partitionKey attribute
  partitionKey = typeof partitionKey === 'string'
    && partitionKey.trim().length > 0 ? partitionKey.trim()
    : error(`'partitionKey' must be defined`)

  // Specify sortKey attribute (optional)
  sortKey = typeof sortKey === 'string'
    && sortKey.trim().length > 0 ? sortKey.trim()
    : sortKey ? error(`'sortKey' must be a string value`)
    : null

  // Disable, or rename field for entity tracking
  entityField = entityField === false ? false
    : typeof entityField === 'string' && entityField.trim().length > 0 ?
      entityField.trim()
      : '_et'

  // Parse table attributes
  attributes = hasValue(attributes) && typeof attributes === 'object' && !Array.isArray(attributes) ?
    attributes
    : attributes ? error(`Please provide a valid 'attributes' object`)
    : {}

  // Add entityField to attributes
  if (entityField) attributes[entityField] = 'string'

  // Parse indexes (optional)
  indexes = hasValue(indexes) && typeof indexes === 'object' && !Array.isArray(indexes) ?
    parseIndexes(indexes,partitionKey)
    : indexes ? error(`Please provide a valid 'indexes' object`)
    : {}

  // Return the table
  return Object.assign({
    name,
    alias,
    Table: {
      partitionKey,
      sortKey,
      entityField,
      attributes: parseAttributes(attributes,partitionKey,sortKey) as any,
      indexes
    },
    autoExecute,
    autoParse,
    removeNullAttributes,
    treatWhitespaceAsNull,
    _entities: [] // init Entity tracker
  },
  DocumentClient ? { DocumentClient } : {}, // end DocumentClient
  entities ? { entities } : {} // end entities
  )
} // end parseTable


// Parse Indexes
const parseIndexes = (indexes: TableIndexes, pk: string): TableIndexes => 
  Object.keys(indexes).reduce((acc,index) => {
  
  // TODO: indexes can not be named TABLE

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
      partitionKey && type === 'GSI' ? { partitionKey } : {},
      sortKey ? { sortKey } : {},
      { type }
    ) // end
  })
},{})

export default parseTable