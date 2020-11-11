/**
 * DynamoDB Toolbox: A simple set of tools for working with Amazon DynamoDB
 * @author Jeremy Daly <jeremy@jeremydaly.com>
 * @license MIT
 */

import { TableAttributes, TableAttributeConfig, ParsedTableAttribute, DynamoDBTypes } from '../classes/Table'

import { error, typeError, keyTypeError, validTypes, validKeyTypes } from './utils'

// Parse the attributes and verify valid types
export default (attrs: TableAttributes, partitionKey: string, sortKey: string | null) => 
  Object.keys(attrs).reduce((acc,field) => {

    if (typeof attrs[field] === 'string') {
      // TODO: Calling .toString() to satisfy TS even though I'm type checking
      // Error if invalid key type
      if ([partitionKey,sortKey].includes(field) && !validKeyTypes.includes(attrs[field].toString())) { keyTypeError(field) }
      // Error if invalid type
      if (!validTypes.includes(attrs[field].toString())) { typeError(field) }
      // Merge and return parsed attribute
      return Object.assign(acc,parseAttributeConfig(field ,{ type: attrs[field] } as TableAttributeConfig))
    } else {
      // TODO: Is there a better way to do this without casting this value?
      const fieldVal = attrs[field] as TableAttributeConfig
      // Error if invalid key type
      if ([partitionKey,sortKey].includes(field) && !validKeyTypes.includes(fieldVal.type)) { keyTypeError(field) }
      // Error if invalid type
      if (!validTypes.includes(fieldVal.type)) { typeError(field) }
      // Merge and return parsed attribute
      return Object.assign(acc,parseAttributeConfig(field,fieldVal))
    } // end else
  },{})

// Parse and validate attributes config
const parseAttributeConfig = (field: string, config: TableAttributeConfig): ParsedTableAttribute => {

  // Validate props
  Object.keys(config).forEach(prop => {
    switch(prop) {
      case 'type':
        break
      case 'setType':
        if (config.type !== 'set') error(`'setType' is only valid for type 'set'`)
        if (!['string','number','binary'].includes(config[prop]!))
          error(`Invalid 'setType', must be 'string', 'number', or 'binary'`)
        break
      default:
        error(`'${prop}' is not a valid property type`)
    }
  })

  return {
    [field]: { ...config, mappings: {} }
  }
}
