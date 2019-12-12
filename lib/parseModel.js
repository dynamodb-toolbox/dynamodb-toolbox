'use strict'

/**
 * DynamoDB Toolbox: A simple set of tools for working with Amazon DynamoDB
 * @author Jeremy Daly <jeremy@jeremydaly.com>
 * @license MIT
 */

const mappingConfig = require('./mappingConfig')
const compositeKeyConfig = require('./compositeKeyConfig')
const { error, typeError, validTypes } = require('./utils')

// Parse model
module.exports = (name,model) => {

  let model_name = typeof name === 'string'
    && name.trim().length > 0 ? name.trim()
    : error('Please provide a string value for the model name')

  let model_field = model.model === false ? false
    : typeof model.model === 'string' && model.model.trim().length > 0 ?
      model.model.trim()
      : '__model'

  let timestamps = typeof model.timestamps === 'boolean' ? model.timestamps : false

  let created = typeof model.created === 'string'
    && model.created.trim().length > 0 ? model.created.trim()
    : 'created'

  let modified = typeof model.modified === 'string'
    && model.modified.trim().length > 0 ? model.modified.trim()
    : 'modified'

  let partitionKey = typeof model.partitionKey === 'string'
    && model.partitionKey.trim().length > 0 ? model.partitionKey.trim()
    : error(`'partitionKey' must be defined`)

  let sortKey = typeof model.sortKey === 'string'
    && model.sortKey.trim().length > 0 ? model.sortKey.trim()
    : model.sortKey ? error(`'sortKey' must be string value`)
    : null

  let table = typeof model.table === 'string'
    && model.table.trim().length > 0 ? model.table.trim()
    : error(`'table' must be defined`)

  let schema = typeof model.schema === 'object' && !Array.isArray(model.schema) ?
    model.schema : error(`Please provide a valid 'schema'`)

  // Add model_field
  if (model_field) {
    schema[model_field] = { type: 'string', default: model_name, hidden: true }
  }

  // Add timestamps
  if (timestamps) {
    schema[created] = { type: 'string', default: ()=> new Date().toISOString() }
    schema[modified] = { type: 'string', default: ()=> new Date().toISOString(), onUpdate: true }
  }

  // Track info
  let track = {
    fields: Object.keys(schema), // field and alias list,
    defaults: {}, // tracks default fields
    required: {},
    linked: {}
  }

  // Return the model
  return {
    table,
    partitionKey,
    sortKey,
    schema: Object.keys(schema).reduce((acc,field) => {
      if (typeof schema[field] === 'string') {
        return validTypes.includes(schema[field]) ?
          Object.assign(acc,mappingConfig(field,{ type: schema[field] },track))
          : typeError(field)
      } else if (Array.isArray(schema[field])) {
        return Object.assign(acc,compositeKeyConfig(field,schema[field],track,schema))
      } else {
        return !schema[field].type || validTypes.includes(schema[field].type) ?
          Object.assign(acc,mappingConfig(field,schema[field],track))
          : typeError(field)
      }
    },{}),
    defaults: track.defaults,
    required: track.required,
    linked: track.linked
  } // end mapping object

} // end parseModel
