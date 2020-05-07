'use strict'

/**
 * DynamoDB Toolbox: A simple set of tools for working with Amazon DynamoDB
 * @author Jeremy Daly <jeremy@jeremydaly.com>
 * @license MIT
 */

const parseAttributes = require('./parseEntityAttributes')
const { error } = require('./utils')

// Parse entity
module.exports = (entity) => {

  let {
    name,
    timestamps,
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
  if (timestamps) {
    attributes[created] = { type: 'string', alias: createdAlias, default: ()=> new Date().toISOString() }
    attributes[modified] = { type: 'string', alias: modifiedAlias, default: ()=> new Date().toISOString(), onUpdate: true }
  }

  // Tracking info
  let track = {
    fields: Object.keys(attributes), // attributes and alias list,
    defaults: {}, // tracks default attributes
    required: {},
    linked: {},
    keys: {} // tracks partition/sort/index keys
  }

  // Return the entity
  return Object.assign({
    name,
    schema: parseAttributes(attributes,track,false),
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
