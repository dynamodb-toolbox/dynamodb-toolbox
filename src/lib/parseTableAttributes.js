'use strict'

/**
 * DynamoDB Toolbox: A simple set of tools for working with Amazon DynamoDB
 * @author Jeremy Daly <jeremy@jeremydaly.com>
 * @license MIT
 */

const { error, typeError, keyTypeError, validTypes, validKeyTypes } = require('./utils')

// Parse the attributes and verify valid types
module.exports = (attrs,partitionKey,sortKey) => Object.keys(attrs).reduce((acc,field) => {
  if (typeof attrs[field] === 'string') {
    return [partitionKey,sortKey].includes(field) && !validKeyTypes.includes(attrs[field]) ?
      keyTypeError(field)
      : validTypes.includes(attrs[field]) ?
        Object.assign(acc,parseAttributeConfig(field,{ type: attrs[field] }))
        : typeError(field)
  } else {  
    return [partitionKey,sortKey].includes(field) && !validKeyTypes.includes(attrs[field].type) ?
      keyTypeError(field)
      : (validTypes.includes(attrs[field].type) || !attrs[field].type) ?
        Object.assign(acc,parseAttributeConfig(field,attrs[field]))
        : typeError(field)
  }
},{})

// Parse and validate attributes config
const parseAttributeConfig = (field,config) => {

  // Validate props
  Object.keys(config).forEach(prop => {
    switch(prop) {
      case 'type':
        break
      case 'setType':
        if (config.type !== 'set') error(`'setType' is only valid for type 'set'`)
        if (!['string','number','binary'].includes(config[prop]))
          error(`Invalid 'setType', must be 'string', 'number', or 'binary'`)
        break
      default:
        error(`'${prop}' is not a valid property type`)
    }
  })

  // // Default the type // Table attributes must specify type?
  // if (!config.type) config.type = 'string'

  return {
    [field]: { ...config, mappings: {} }
  }
}
