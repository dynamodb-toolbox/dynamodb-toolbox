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

  // Build and execute defaults dependency graph
  const dependsOn = (map,attr) => {  
    // If the default depends on other attributes
    if (schema[attr].dependsOn) {
      (Array.isArray(schema[attr].dependsOn) ? schema[attr].dependsOn : [schema[attr].dependsOn]).forEach(dependent => {
        // If the dependent is a valid attribute or alias
        if (schema[dependent]) {          
          // If the dependent is a function
          if (typeof map[dependent] === 'function') {   
            // Resolve the dependency graph
            map = dependsOn(map,dependent)
          }
        } else {
          error(`'${dependent}' is not a valid attribute or alias name`)
        }
      }) // end dependency loop

      map[attr] = map[attr](map)
      return map
    } else {
      map[attr] = map[attr](map)
      if (schema[attr].alias) map[schema[attr].alias] = map[attr]
      if (schema[attr].map) map[schema[attr].map] = map[attr]
      return map
    }
  } // end dependsOn
  
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

  // Create a combined data object for defaults
  let defaultMap = { ...dataMap.data, ...dataMap.aliases }
  const defaults = Object.keys(defaultMap).reduce((acc,attr) => {
    // If a function, resolve the dependency graph
    if (typeof defaultMap[attr] === 'function') { 
      let map = dependsOn(defaultMap,attr)
      defaultMap = map
    }
    return Object.assign(acc, { [attr]: defaultMap[attr] })
  },{})


  // Generate final data and evaluate function expressions
  let _data = Object.keys(dataMap.data).reduce((acc,field) => {
    return Object.assign(acc, { 
      [field]: defaults[field]
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





// Generate final data and evaluate function expressions
// let _data = Object.keys(dataMap.data).reduce((acc,field) => {
//   return Object.assign(acc, { 
//     [field]: typeof dataMap.data[field] === 'function' ? dataMap.data[field](defaults) : dataMap.data[field]
//   })
// },{})

// console.log(_data)



// map[schema[attr].dependsOn] = typeof map[schema[attr].dependsOn] === 'function' ? 
//   dependsOn(map,schema[attr].dependsOn) // map[schema[attr].dependsOn](map) 
//   : map[schema[attr].dependsOn]
// return { map, val: map[attr](map) }
// return dependsOn(map,attr)