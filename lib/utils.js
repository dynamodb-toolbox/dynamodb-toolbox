'use strict'

/**
 * DynamoDB Toolbox: A simple set of tools for working with Amazon DynamoDB
 * @author Jeremy Daly <jeremy@jeremydaly.com>
 * @license MIT
 */

const validTypes = ['string','boolean','number','list','map','binary','set']
module.exports.validTypes = validTypes

const validKeyTypes = ['string','number','binary']
module.exports.validKeyTypes = validKeyTypes

// Boolean conversion
module.exports.toBool = val =>
  typeof val === 'boolean' ? val
  : ['false','0','no'].includes(String(val).toLowerCase()) ? false
  : Boolean(val)

// has value shortcut
module.exports.hasValue = val => val !== undefined && val !== null

// Inline error handler
const error = err => { throw err }
module.exports.error = error

// Standard type error
module.exports.typeError = field => {
  error(`Invalid or missing type for '${field}'. `
    + `Valid types are '${validTypes.slice(0,-1).join(`', '`)}',`
    + ` and '${validTypes.slice(-1)}'.`)
}

// Key type error
module.exports.keyTypeError = field => {
  error(`Invalid or missing type for '${field}'. `
    + `Valid types for partitionKey and sortKey are 'string','number' and 'binary'`)
}
