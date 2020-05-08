'use strict'

/**
 * DynamoDB Toolbox: A simple set of tools for working with Amazon DynamoDB
 * @author Jeremy Daly <jeremy@jeremydaly.com>
 * @license MIT
 */

const validateTypes = require('./validateTypes')
const { error, transformAttr } = require('./utils')

// Normalize Data
module.exports = (DocumentClient) => (schema,linked,data,filter=false) => {

  // Intialize validate type
  const validateType = validateTypes(DocumentClient)
  
  let _data = Object.keys(data).reduce((acc,field) => {

    return Object.assign(acc,
      schema[field] ? { [schema[field].map || field] : data[field] }
      : filter ? {} // this will filter out non-mapped fields
      : field === '$remove' ? { $remove: data[field] } // support for removes
      : error(`Field '${field}' does not have a mapping or alias`)
    )
  },{})

  // Process linked
  let composites = Object.keys(linked).reduce((acc,attr) => {

    // Convert field to mapped field
    const field = (schema[attr] && schema[attr].map) || attr

    if (_data[field] !== undefined) return acc // if value exists, let override
    let values = linked[attr].map(f => {
      if (_data[f] === undefined) { return null }
      return transformAttr(schema[f],validateType(schema[f],f,_data[f],_data),_data)
    }).filter(x => x !== null)    

    // TODO: add required fields
    // if (values.length > 0 && values.length !== linked[field].length) {
    //   error(`${linked[field].join(', ')} are all required for composite key`)
    // } else  

    if (values.length === linked[attr].length) {
      return Object.assign(acc, { 
        //[field]: `${schema[attr].prefix || ''}${values.join(schema[attr].delimiter || '#')}${schema[attr].suffix || ''}`
        [field]: values.join(schema[attr].delimiter || '#')
      })
    } else {
      return acc
    }
  },{})

  // Return the merged data
  return Object.assign(composites,_data)

} // end normalizeData
