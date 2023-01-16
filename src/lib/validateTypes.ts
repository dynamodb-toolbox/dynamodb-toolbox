/**
 * DynamoDB Toolbox: A simple set of tools for working with Amazon DynamoDB
 * @author Jeremy Daly <jeremy@jeremydaly.com>
 * @license MIT
 */

import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { toBool, hasValue, error, toDynamoBigInt } from './utils'

// Performs type validation/coercian
export default (DocumentClient: DocumentClient) => (mapping: any, field: any, value: any) => {
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
    case 'number': {
      if (typeof value === 'number') {
        return Number.isFinite(value) ? value : error(`'${field}' must be a finite number`)
      }

      if (!mapping.coerce) {
        return error(`'${field}' must be of type number`)
      }

      const coercedValue = Number(value)

      return typeof value === 'string' && Number.isFinite(coercedValue) && value.length > 0
        ? coercedValue
        : error(
          `Could not convert '${
            Array.isArray(value) ? `[${value}]` : value
          }' to a number for '${field}'`
        )
    }
    case 'bigint':
      return toDynamoBigInt(typeof value === 'bigint' || mapping.coerce
        ? BigInt(value)
        : error(`'${field}' must be of type bigint`))
    case 'list':
      return Array.isArray(value)
        ? value
        : mapping.coerce
          ? String(value)
            .split(',')
            .map(x => x.trim())
          : error(`'${field}' must be a list (array)`)
    case 'map':
      return value?.constructor === Object ? value : error(`'${field}' must be a map (object)`)
    case 'set':
      if (Array.isArray(value)) {
        if (!DocumentClient) error('DocumentClient required for this operation')
        const set = DocumentClient.createSet(value, { validate: true })
        return !mapping.setType || mapping.setType === set.type.toLowerCase()
          ? set
          : error(`'${field}' must be a valid set (array) containing only ${mapping.setType} types`)
      } else if (mapping.coerce) {
        if (!DocumentClient) error('DocumentClient required for this operation')
        const set = DocumentClient.createSet(
          String(value)
            .split(',')
            .map(x => x.trim())
        )
        return !mapping.setType || mapping.setType === set.type.toLowerCase()
          ? set
          : error(`'${field}' must be a valid set (array) of type ${mapping.setType}`)
      } else {
        return error(`'${field}' must be a valid set (array)`)
      }
    default:
      // TODO: Binary validation
      return value
  }
} // end validateTypes
