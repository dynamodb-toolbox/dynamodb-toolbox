'use strict'

/**
 * DynamoDB Toolbox: A simple set of tools for working with Amazon DynamoDB
 * @author Jeremy Daly <jeremy@jeremydaly.com>
 * @license MIT
 */

const documentClient = require('./dynamodb-service.js')
const { toBool, hasValue, error } = require('../lib/utils')

// Performs type validation/coercian
module.exports = (mapping,field,input,data={}) => {

  // Evaluate function expressions
  let value = typeof input === 'function' ? input(data) : input

  // return if undefined or null
  if (!hasValue(value)) return value

  switch(mapping.type) {
    case 'string':
      return typeof value === 'string' || mapping.coerce ? String(value)
        : error(`'${field}' must be of type string`)
    case 'boolean':
      return typeof value === 'boolean' || mapping.coerce ? toBool(value)
        : error(`'${field}' must be of type boolean`)
    case 'number':
      return typeof value === 'number' || mapping.coerce ?
        (String(parseInt(value)) === String(value) ? parseInt(value)
        : error(`Could not convert '${value}' to a number for '${field}'`))
        : error(`'${field}' must be of type number`)
    case 'list':
      return Array.isArray(value) ? value
        : mapping.coerce ? String(value).split(',').map(x => x.trim())
        : error(`'${field}' must be a list (array)`)
    case 'map':
      return typeof value === 'object' && !Array.isArray(value) ? value
        : error(`'${field}' must be a map (object)`)
    case 'set':
      if (Array.isArray(value)) {
        let set = documentClient.createSet(value, { validate: true })
        return !mapping.setType || mapping.setType === set.type.toLowerCase() ? set
          : error(`'${field}' must be a valid set (array) containing only ${mapping.setType} types`)
      } else if (mapping.coerce) {
        let set = documentClient.createSet(String(value).split(',').map(x => x.trim()))
        return !mapping.setType || mapping.setType === set.type.toLowerCase() ? set
          : error(`'${field}' must be a valid set (array) of type ${mapping.setType}`)
      } else {
        error(`'${field}' must be a valid set (array)`)
      }
      break
    default:
      return value
  }
} // end validateType
