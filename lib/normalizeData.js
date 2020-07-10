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
  
  // Generate normalized data object
  let dataMap = Object.keys(data).reduce((acc,field) => {

    // Return a map with normalized data and alias references
    return Object.assign(acc,
      schema[field] ? { 
        data: { ...acc.data, [schema[field].map || field] : data[field] },
        aliases: { ...acc.aliases, [schema[field].alias || field] : data[field] }
      }
      : filter ? {} // this will filter out non-mapped fields
      : field === '$remove' ? { data: { ...acc.data, $remove: data[field] } } // support for removes
      : error(`Field '${field}' does not have a mapping or alias`)
    )
    
  },{ data: {}, aliases: {} })

  
  // Generate final data and evaluate function expressions
  let _data = Object.keys(dataMap.data).reduce((acc,field) => {
    return Object.assign(acc, { 
      [field]: typeof dataMap.data[field] === 'function' ? dataMap.data[field]({ ...dataMap.data, ...dataMap.aliases }) : dataMap.data[field]
    })
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
