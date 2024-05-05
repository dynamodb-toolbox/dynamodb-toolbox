/**
 * DynamoDB Toolbox: A simple set of tools for working with Amazon DynamoDB
 * @author Jeremy Daly <jeremy@jeremydaly.com>
 * @license MIT
 */


import validateTypes from './validateTypes.js'
import { error, transformAttr } from './utils.js'

// Normalize Data
export default () => (
  schema: any,
  linked: any,
  data: any,
  filter = false,
  throwOnMissingNonPartitionRequiredProperties = true
) => {
  // Intialize validate type
  const validateType = validateTypes()

  // Build and execute defaults dependency graph
  const dependsOn = (map: any, attr: any) => {
    // If the default depends on other attributes
    if (schema[attr].dependsOn) {
      (Array.isArray(schema[attr].dependsOn)
        ? schema[attr].dependsOn
        : [schema[attr].dependsOn]
      ).forEach((dependent: any) => {
        // If the dependent is a valid attribute or alias
        if (schema[dependent]) {
          // If the dependent is a function
          if (typeof map[dependent] === 'function') {
            // Resolve the dependency graph
            map = dependsOn(map, dependent)
          } if (typeof map[dependent] === 'undefined') {
            throw new DependsOnUndefined(`'${dependent}' is undefined, bailing`)
          }
        } else {
          error(`'${dependent}' is not a valid attribute or alias name`)
        }
      })

      map[attr] = map[attr](map)
      return map
    } else {
      try {
        map[attr] = map[attr](map)
        if (schema[attr].alias) map[schema[attr].alias] = map[attr]
        if (schema[attr].map) map[schema[attr].map] = map[attr]
      } catch (e) {
        // noop
      }
      return map
    }
  }

  // Generate normalized data object
  const dataMap = Object.keys(data).reduce(
    (acc, field) => {
      // Return a map with normalized data and alias references
      return Object.assign(
        acc,
        schema[field]
          ? {
            data: { ...acc.data, [schema[field].map || field]: data[field] },
            aliases: { ...acc.aliases, [schema[field].alias || field]: data[field] }
          }
          : filter
            ? {} // this will filter out non-mapped fields
            : field === '$remove'
              ? { data: { ...acc.data, $remove: data[field] } } // support for removes
              : error(`Field '${field}' does not have a mapping or alias`)
      )
    },
    { data: {}, aliases: {} }
  )

  // Create a combined data object for defaults
  let defaultMap: Record<string, any> = { ...dataMap.data, ...dataMap.aliases }
  const defaults: Record<string, any> = Object.keys(defaultMap).reduce((acc, attr) => {
    // If a function, resolve the dependency graph
    if (typeof defaultMap[attr] === 'function') {
      try {
        const map = dependsOn(defaultMap, attr)
        defaultMap = map
      } catch (e) {
        if (throwOnMissingNonPartitionRequiredProperties 
          && e instanceof DependsOnUndefined 
          && (schema[attr].partitionKey === true || schema[attr].sortKey === true || schema[attr].required)) {
          throw new Error(`Required field '${attr}' depends on attribute(s), one or more of which can't be resolved (${schema[attr].dependsOn})`)
        }
        delete defaultMap[attr]
      }
    }
    return Object.assign(acc, { [attr]: defaultMap[attr] })
  }, {})

  // Generate final data and evaluate function expressions
  const _data: Record<string, any> = Object.keys(dataMap.data).reduce((acc, field) => {
    return Object.assign(acc, {
      [field]: defaults[field]
    })
  }, {})

  // Process linked
  const composites = Object.keys(linked).reduce((acc, attr) => {
    // Convert field to mapped field
    const field = (schema[attr] && schema[attr].map) || attr

    if (_data[field] !== undefined) return acc // if value exists, let override
    const values = linked[attr]
      .map((f: any) => {
        if (_data[f] === undefined) {
          return null
        }
        return transformAttr(schema[f], validateType(schema[f], f, _data[f]), _data)
      })
      .filter((x: any) => x !== null)

    if (values.length === linked[attr].length) {
      return Object.assign(acc, {
        [field]: values.join(schema[attr].delimiter || '#')
      })
    } else {
      return acc
    }
  }, {})

  // Return the merged data
  return Object.assign(composites, _data)
}

class DependsOnUndefined extends Error {
  constructor(message: string) {
    super(message)
  }
}
