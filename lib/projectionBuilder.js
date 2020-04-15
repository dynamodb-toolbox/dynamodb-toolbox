'use strict'

/**
 * DynamoDB Toolbox: A simple set of tools for working with Amazon DynamoDB
 * @author Jeremy Daly <jeremy@jeremydaly.com>
 * @license MIT
 */

// https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.ProjectionExpressions.html

// Import standard error handler
const { error } = require('./utils')

// This should be able to parse and array with values,
// or an object that uses the name of the entity plus and array of values
// e.g. ['attr1','attr2'] or { MyEntity: ['attr1', 'attr2'] }
// Ths should also be able to parse any combination,
// e.g. [ 'attr1', 'attr2', { MyEntity: ['attr3','attr4'] }]

module.exports = (attributes,table={}) => {
  
  // Create an attribute names counter
  let index = 0
  
  // If attributes isn't an array, make it one
  const attrs = Array.isArray(attributes) ? attributes
    // support simple string list
    : typeof attributes === 'string' ? attributes.split(',').map(x=>x.trim())
    : [attributes]

  // Check that table is valid and contains attributes
  if (
    table.constructor.name !== 'Table' 
    || !table.Table 
    || Object.keys(table.Table.attributes).length == 0
  ) {
    error(`Tables must be valid and contain attributes`)
  } // end check table

  // Add entityField if exists
  if (table.Table.entityField) attrs.push(table.Table.entityField)

  // Default collectors
  const names = {}
  let tableAttrs = []
  const entities = {}

  // Loop through the attributes and add to the map
  for (const i in attrs) {

    // If a string
    if (typeof attrs[i] === 'string') {

      // Check single attribute and merge results
      const attr = checkAttribute(attrs[i],table.Table.attributes)
      if (!Object.values(names).includes(attr)) {
        names[`#proj${++index}`] = attr
        tableAttrs.push(attrs[i])
      } // end if

    } else if (typeof attrs[i] === 'object') {

      // If an object, loop through keys
      for (const entity in attrs[i]) {
        // Check that the entity name exists
        if (table[entity]) {

          // Track entity attributes
          if (!entities[entity]) entities[entity] = []

          // If attributes isn't an array, make it one
          const ent_attrs = Array.isArray(attrs[i][entity]) ? attrs[i][entity]
            // support simple string list
            : typeof attrs[i][entity] === 'string' ? attrs[i][entity].split(',').map(x=>x.trim())
            : error(`Only arrays or strings are supported`)

          // Loop entity projections
          for (const i in ent_attrs) {
            // Check for string type
            if (typeof ent_attrs[i] != 'string') error(`Entity projections must be string values`)
            // Check the attribute and merge results

            const attr = checkAttribute(ent_attrs[i],table[entity].schema.attributes)
            if (!Object.values(names).includes(attr)) {
              names[`#proj${++index}`] = attr  
            } // end if
            entities[entity].push(attr)
          } // end for

        } else {
          error(`'${entity}' is not a valid entity on this table`)
        } // end if valid entity

      } // end for loop
     
    // Throw error if invalid type
    } else {
      error(`'${typeof attrs[i]}' is an invalid type. Projections require strings or arrays`)
    }
  } // end for

  return { 
    names,
    projections: Object.keys(names).join(','),
    entities: Object.keys(entities).reduce((acc,ent) => {  
      return Object.assign(acc,{ [ent]: [...new Set([...entities[ent],...tableAttrs])] })
    },{}),
    tableAttrs
  }

} // end module

// Check attribute against attribute set
const checkAttribute = (attr,attrs) => {
  // Split paths with dot notation
  const path = attr.split('.')
  // Check that the base path exists as an attribute or alias
  if (path[0] in attrs) {
    // Replace base alias with table attribute
    path[0] = attrs[path[0]].mapped ? attrs[path[0]].mapped : path[0]
    // Return joined path
    return path.join('.')
  // Throw an error if not a valid attribute or alias
  } else {
    error(`'${attr}' is not a valid table attribute. To use aliases, please specify the Entity.`)
  }  
}
