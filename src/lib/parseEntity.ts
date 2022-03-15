/**
 * DynamoDB Toolbox: A simple set of tools for working with Amazon DynamoDB
 * @author Jeremy Daly <jeremy@jeremydaly.com>
 * @license MIT
 */

 // Import libraries & types
import parseEntityAttributes from './parseEntityAttributes'
import { EntityConstructor } from '../classes/Entity'

// Import error handlers
import { error } from './utils'

export interface TrackingInfo {
  fields: string[]
  defaults: any
  required: any,
  linked: Linked,
  keys: any
}

export interface Linked {
  [key: string]: string[]
}

export interface TrackingInfoKeys {
  partitionKey?: string
  sortKey?: string 
}

export type ParsedEntity = ReturnType<typeof parseEntity>

// Parse entity
export function parseEntity(entity: EntityConstructor) {

  let {
    name,
    timestamps,
    timestampsFormat,
    created,
    createdAlias,
    modified,
    modifiedAlias,
    typeAlias,
    attributes,
    autoExecute,
    autoParse,
    table,
    ...args // extraneous config
  } = entity

  // TODO: verify string types (e.g. created)

  // Error on extraneous arguments
  if (Object.keys(args).length > 0)
    error(`Invalid Entity configuration options: ${Object.keys(args).join(', ')}`)

  // Entity name
  name = typeof name === 'string'
    && name.trim().length > 0 ? name.trim()
    : error(`'name' must be defined`)

  // Enable created/modified timestamps on items
  timestamps = typeof timestamps === 'boolean' ? timestamps : true

  // Define timestamp formatter
  timestampsFormat = typeof timestampsFormat === 'function'
    ? timestampsFormat : (d) => d.toISOString() // default to ISO

  // Define 'created' attribute name
  created = typeof created === 'string'
    && created.trim().length > 0 ? created.trim()
    : '_ct'

  // Define 'createdAlias'
  createdAlias = typeof createdAlias === 'string'
    && createdAlias.trim().length > 0 ? createdAlias.trim()
    : 'created'

  // Define 'modified' attribute anme
  modified = typeof modified === 'string'
    && modified.trim().length > 0 ? modified.trim()
    : '_md'

  // Define 'modifiedAlias'
  modifiedAlias = typeof modifiedAlias === 'string'
    && modifiedAlias.trim().length > 0 ? modifiedAlias.trim()
    : 'modified'

  // Define 'entityAlias'
  typeAlias = typeof typeAlias === 'string'
    && typeAlias.trim().length > 0 ? typeAlias.trim()
    : 'entity'

  // Sanity check the attributes
  attributes = typeof attributes === 'object' && !Array.isArray(attributes) ?
    attributes : error(`Please provide a valid 'attributes' object`)

  // Add timestamps
  if (timestamps && timestampsFormat) {
    const formatter = timestampsFormat // for eslint
    attributes[created] = { type: 'string', alias: createdAlias, default: ()=> formatter(new Date()) }
    attributes[modified] = { type: 'string', alias: modifiedAlias, default: ()=> formatter(new Date()), onUpdate: true }
  }

  // Tracking info
  let track: TrackingInfo = {
    fields: Object.keys(attributes), // attributes and alias list,
    defaults: {}, // tracks default attributes
    required: {},
    linked: {},
    keys: {} // tracks partition/sort/index keys
  }

  // Return the entity
  return Object.assign({
    name,
    schema: parseEntityAttributes(attributes,track), // removed nested attribute?
    defaults: track.defaults,
    required: track.required,
    linked: track.linked,
    autoExecute,
    autoParse,
    _etAlias: typeAlias 
  },
  table ? { table } : {}
  ) // end mapping object

} // end parseEntity

export default parseEntity