'use strict'

/**
 * DynamoDB Toolbox: A simple set of tools for working with Amazon DynamoDB
 * @author Jeremy Daly <jeremy@jeremydaly.com>
 * @license MIT
 */

const validateType = require('./validateType')
const { error } = require('./utils')

// Normalize Data
module.exports = (schema,linked,data,filter=false) => {
  let _data = Object.keys(data).reduce((acc,field) => {
    return Object.assign(acc,
      schema[field] ? { [schema[field].mapped || field] : data[field] }
      : filter ? {}
      : error(`Field '${field}' does not have a mapping or alias`)
    )
  },{})

  // Process linked
  let composites = Object.keys(linked).reduce((acc,field) => {
    if (_data[field] !== undefined) return acc // if value exists, let override
    let values = linked[field].map(f => {
      if (_data[f] === undefined) { return null }
      return validateType(schema[f],f,_data[f],_data)
    }).filter(x => x !== null)

    // if (values.length > 0 && values.length !== linked[field].length) {
    //   error(`${linked[field].join(', ')} are all required for composite key`)
    // } else
    if (values.length === linked[field].length) {
      return Object.assign(acc, { [field]: values.join('#') })
    } else {
      return acc
    }
  },{})

  // Return the merged data
  return Object.assign(composites,_data)

}
