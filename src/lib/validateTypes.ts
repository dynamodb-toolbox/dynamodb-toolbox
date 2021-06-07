/**
 * DynamoDB Toolbox: A simple set of tools for working with Amazon DynamoDB
 * @author Jeremy Daly <jeremy@jeremydaly.com>
 * @license MIT
 */

import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import { toBool, hasValue, error, hasSameTypes, typeOf } from './utils'

// Performs type validation/coercian
export default (DocumentClient: DynamoDBDocumentClient) => (
  mapping: any,
  field: any,
  value: any
) => {
  // Evaluate function expressions
  // TODO: should this happen here?
  // let value = typeof input === 'function' ? input(data) : input

  // return if undefined or null
  if (!hasValue(value)) return value

  switch (mapping.type) {
    case 'string':
      return typeof value === 'string' || mapping.coerce
        ? String(value)
        : error(`'${field}' must be of type string`)
    case 'boolean':
      return typeof value === 'boolean' || mapping.coerce
        ? toBool(value)
        : error(`'${field}' must be of type boolean`)
    case 'number':
      return typeof value === 'number' || mapping.coerce
        ? String(parseInt(value)) === String(value)
          ? parseInt(value)
          : String(parseFloat(value)) === String(value)
          ? parseFloat(value)
          : error(`Could not convert '${value}' to a number for '${field}'`)
        : error(`'${field}' must be of type number`)
    case 'list':
      return Array.isArray(value)
        ? value
        : mapping.coerce
        ? String(value)
            .split(',')
            .map((x) => x.trim())
        : error(`'${field}' must be a list (array)`)
    case 'map':
      return typeof value === 'object' && !Array.isArray(value)
        ? value
        : error(`'${field}' must be a map (object)`)
    case 'set':
      if (value instanceof Set) {
        return hasSameTypes([...value])
          ? value
          : error(
              `'${field}' must be a valid set containing only ${mapping.setType} types`
            )
      } else if (Array.isArray(value)) {
        return (!mapping.setType ||
          value.length === 0 ||
          mapping.setType === typeOf(value[0]).toLowerCase()) &&
          hasSameTypes(value)
          ? new Set(value)
          : error(
              `'${field}' must be a valid set (array) containing only ${mapping.setType} types`
            )
      } else if (mapping.coerce) {
        const arrayVal = String(value)
          .split(',')
          .map((x) => x.trim())
        return (!mapping.setType ||
          arrayVal.length === 0 ||
          mapping.setType === typeOf(arrayVal[0]).toLowerCase()) &&
          hasSameTypes(arrayVal)
          ? new Set(arrayVal)
          : error(
              `'${field}' must be a valid set (array) of type ${mapping.setType}`
            )
      } else {
        return error(`'${field}' must be a valid set (array)`)
      }
    default:
      // TODO: Binary validation
      return value
  }
} // end validateTypes
