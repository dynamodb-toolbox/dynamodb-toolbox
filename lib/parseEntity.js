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
  
  // Entity name
  let name = typeof entity.name === 'string'
    && entity.name.trim().length > 0 ? entity.name.trim()
    : error(`'name' must be defined`)

  // Enable created/modified timestamps on items
  let timestamps = typeof entity.timestamps === 'boolean' ? entity.timestamps : true

  // Define 'created' attribute name
  let created = typeof entity.created === 'string'
    && entity.created.trim().length > 0 ? entity.created.trim()
    : '_ct'

  // Define 'createdAlias'
  let createdAlias = typeof entity.createdAlias === 'string'
    && entity.createdAlias.trim().length > 0 ? entity.createdAlias.trim()
    : 'created'

  // Define 'modified' attribute anme
  let modified = typeof entity.modified === 'string'
    && entity.modified.trim().length > 0 ? entity.modified.trim()
    : '_md'

  // Define 'modifiedAlias'
  let modifiedAlias = typeof entity.modifiedAlias === 'string'
    && entity.modifiedAlias.trim().length > 0 ? entity.modifiedAlias.trim()
    : 'modified'

  // Map partition key (TODO: auto alias?)
  let partitionKey = typeof entity.partitionKey === 'string'
    && entity.partitionKey.trim().length > 0 ? entity.partitionKey.trim()
    : error(`'partitionKey' must be defined`)

  // Map sort key (if defined) (TODO: auto alias?)
  let sortKey = typeof entity.sortKey === 'string'
    && entity.sortKey.trim().length > 0 ? entity.sortKey.trim()
    : entity.sortKey ? error(`'sortKey' must be string value`)
    : null

  // Define 'entityAlias'
  let typeAlias = typeof entity.typeAlias === 'string'
    && entity.typeAlias.trim().length > 0 ? entity.typeAlias.trim()
    : 'type'

  // Sanity check the attributes
  let attributes = typeof entity.attributes === 'object' && !Array.isArray(entity.attributes) ?
    entity.attributes : error(`Please provide a valid 'attributes' object`)

  // Set auto execute and parse flags
  let autoExecute = entity.autoExecute
  let autoParse = entity.autoParse

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
    linked: {}
  }

  // Return the entity
  return {
    name,
    schema: {
      partitionKey,
      sortKey,
      attributes: parseAttributes(attributes,track,false)
    },
    defaults: track.defaults,
    required: track.required,
    linked: track.linked,
    autoExecute,
    autoParse,
    _tpAlias: typeAlias 
  } // end mapping object

} // end parseEntity
