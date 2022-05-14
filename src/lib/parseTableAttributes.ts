/**
 * DynamoDB Toolbox: A simple set of tools for working with Amazon DynamoDB
 * @author Jeremy Daly <jeremy@jeremydaly.com>
 * @license MIT
 */

import { TableAttributes, TableAttributeConfig, ParsedTableAttribute } from '../classes/Table'
import { error, typeError, keyTypeError, isDynamoDbType, isDynamoDbKeyType } from './utils'

// Parse the attributes and verify valid types
export default (attrs: TableAttributes, partitionKey: string, sortKey: string | null) =>
  Object.keys(attrs).reduce((acc, field) => {
    const attribute = attrs[field]

    if (typeof attribute === 'string') {
      // Error if invalid key type
      if ([partitionKey, sortKey].includes(field) && !isDynamoDbKeyType(attribute)) {
        keyTypeError(field)
      }

      // Error if invalid type
      if (!isDynamoDbType(attribute)) {
        typeError(field)
      }

      // Merge and return parsed attribute
      return Object.assign(acc, parseAttributeConfig(field, { type: attribute }))
    }

    // Error if invalid key type
    if ([partitionKey, sortKey].includes(field) && !isDynamoDbKeyType(attribute.type)) {
      keyTypeError(field)
    }

    // Error if invalid type
    if (!isDynamoDbType(attribute.type)) {
      typeError(field)
    }

    // Merge and return parsed attribute
    return Object.assign(acc, parseAttributeConfig(field, attribute))
  }, {})

// Parse and validate attributes config
const parseAttributeConfig = (
  field: string,
  config: TableAttributeConfig
): ParsedTableAttribute => {
  // Validate props
  Object.keys(config).forEach(prop => {
    switch (prop) {
      case 'type':
        break
      case 'setType':
        if (config.type !== 'set') error(`'setType' is only valid for type 'set'`)
        if (!['string', 'number', 'binary'].includes(config[prop]!))
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
