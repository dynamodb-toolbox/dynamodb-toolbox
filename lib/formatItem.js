'use strict'

/**
 * DynamoDB Toolbox: A simple set of tools for working with Amazon DynamoDB
 * @author Jeremy Daly <jeremy@jeremydaly.com>
 * @license MIT
 */

const validateTypes = require('./validateTypes')

// Format item based on attribute defnition
module.exports = (DocumentClient) => (attributes,linked,item,include=[]) => {
  
  // TODO: Support nested maps?

  // Intialize validate type
  const validateType = validateTypes(DocumentClient)

  return Object.keys(item).reduce((acc,field) => {

    if (linked[field]) {
      Object.assign(acc, linked[field].reduce((acc,f,i) => {
        if (attributes[f].save || attributes[f].hidden || (include.length > 0 && !include.includes(f))) return acc
        return Object.assign(acc,{
          [attributes[f].alias || f]: validateType(attributes[f],f,item[field].split('#')[i])
        })
      },{}))
    }

    if ((attributes[field] && attributes[field].hidden) || (include.length > 0 && !include.includes(field))) return acc
    return Object.assign(acc,{
      [(attributes[field] && attributes[field].alias) || field]: item[field]
    })
  },{})
}
