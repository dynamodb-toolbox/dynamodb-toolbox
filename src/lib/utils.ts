/**
 * DynamoDB Toolbox: A simple set of tools for working with Amazon DynamoDB
 * @author Jeremy Daly <jeremy@jeremydaly.com>
 * @license MIT
 */

import { EntityAttributeConfig } from '../classes/Entity'

export const validTypes = ['string', 'boolean', 'number', 'list', 'map', 'binary', 'set']
export const validKeyTypes = ['string', 'number', 'binary']

// Boolean conversion
export const toBool = (val: any) =>
  typeof val === 'boolean'
    ? val
    : ['false', '0', 'no'].includes(String(val).toLowerCase())
    ? false
    : Boolean(val)

// has value shortcut
export const hasValue = (val: any) => val !== undefined && val !== null

// isEmpty object shortcut
export const isEmpty = (val: any) =>
  val === undefined || (typeof val === 'object' && Object.keys(val).length === 0)

// Inline error handler
export const error = (err: string) => {
  throw new Error(err)
}

// Standard type error
export const typeError = (field: string) => {
  error(
    `Invalid or missing type for '${field}'. ` +
      `Valid types are '${validTypes.slice(0, -1).join(`', '`)}',` +
      ` and '${validTypes.slice(-1)}'.`
  )
}

// Key type error
export const keyTypeError = (field: string) => {
  error(
    `Invalid or missing type for '${field}'. ` +
      `Valid types for partitionKey and sortKey are 'string','number' and 'binary'`
  )
}

// Condition error
export const conditonError = (op: string) =>
  error(`You can only supply one sortKey condition per query. Already using '${op}'`)

// Transform attribute values
export const transformAttr = (mapping: EntityAttributeConfig, value: any, data: {}) => {
  value = mapping.transform ? mapping.transform(value, data) : value
  return mapping.prefix || mapping.suffix
    ? `${mapping.prefix || ''}${value}${mapping.suffix || ''}`
    : value
}
