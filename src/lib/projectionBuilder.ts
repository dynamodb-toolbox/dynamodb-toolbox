/**
 * DynamoDB Toolbox: A simple set of tools for working with Amazon DynamoDB
 * @author Jeremy Daly <jeremy@jeremydaly.com>
 * @license MIT
 */

// https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.ProjectionExpressions.html

import { A } from 'ts-toolbelt'

// Import standard error handler
import { TableDef } from '../classes/Table/Table'
import { error } from './utils'
import checkAttribute from './checkAttribute'

// This should be able to parse an array with values,
// or an object that uses the name of the entity plus an array of values
// e.g. ['attr1','attr2'] or { MyEntity: ['attr1', 'attr2'] }
// Ths should also be able to parse any combination,
// e.g. [ 'attr1', 'attr2', { MyEntity: ['attr3','attr4'] }]
export type ProjectionAttributesTable = { [key: string]: ProjectionAttributes }
export type ProjectionAttributes =
  | A.Key
  | ProjectionAttributeType
  | (A.Key | ProjectionAttributeType)[]
export type ProjectionAttributeType = { [key: string]: string | string[] }

const projectionBuilder = <EntityTable extends TableDef | undefined>(
  attributes: ProjectionAttributes,
  table: EntityTable,
  entity: string | null,
  type = false
) => {
  // Create an attribute names counter
  let index = 0

  // If attributes isn't an array, make it one
  const attrs = Array.isArray(attributes)
    ? attributes
    : // support simple string list
    typeof attributes === 'string'
    ? attributes.split(',').map(x => x.trim())
    : [attributes]

  // Check that table is valid and contains attributes
  if (!table || !table.Table || Object.keys(table.Table.attributes).length == 0) {
    throw new Error('Tables must be valid and contain attributes')
  } // end check table

  // Add entityField if exists
  if (type && table.Table.entityField) attrs.push(table.Table.entityField)

  // Default collectors
  let names: { [key: string]: string } = {}
  let tableAttrs: string[] = []
  let entities: { [key: string]: string[] } = {}

  // Loop through the attributes and add to the map
  for (const attribute of attrs) {
    // If a string
    if (typeof attribute === 'string') {
      // Check single attribute and merge results
      const attr = checkAttribute(
        attribute,
        entity ? table[entity].schema.attributes : table.Table.attributes
      )

      if (!Object.values(names).includes(attr)) {
        names[`#proj${++index}`] = attr
        tableAttrs.push(attribute)
      } // end if
    } else if (typeof attribute === 'object') {
      // If an object, loop through keys
      for (const entity in attribute) {
        // Check that the entity name exists
        if (table[entity]) {
          // Track entity attributes
          if (!entities[entity]) entities[entity] = []

          // If attributes isn't an array, make it one
          const ent_attrs = Array.isArray(attribute[entity])
            ? attribute[entity]
            : // support simple string list
            typeof attribute[entity] === 'string'
            ? String(attribute[entity])
                .split(',')
                .map(x => x.trim())
            : error(`Only arrays or strings are supported`)

          // Loop entity projections
          for (const ent_attribute of ent_attrs) {
            // Check for string type
            if (typeof ent_attribute != 'string') error(`Entity projections must be string values`)

            // Check the attribute and merge results
            const attr = checkAttribute(ent_attribute, table[entity].schema.attributes)

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
      error(`'${typeof attribute}' is an invalid type. Projections require strings or arrays`)
    }
  } // end for

  return {
    names,
    projections: Object.keys(names).join(','),
    entities: Object.keys(entities).reduce((acc, ent) => {
      return Object.assign(acc, { [ent]: [...new Set([...entities[ent], ...tableAttrs])] })
    }, {}),
    tableAttrs
  }
} // end module

export default projectionBuilder
