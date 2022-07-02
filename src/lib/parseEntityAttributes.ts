/**
 * DynamoDB Toolbox: A simple set of tools for working with Amazon DynamoDB
 * @author Jeremy Daly <jeremy@jeremydaly.com>
 * @license MIT
 */
import { A, O } from 'ts-toolbelt'

import {
  AttributeDefinitions,
  PureAttributeDefinition,
  CompositeAttributeDefinition
} from '../classes/Entity/Entity'
import { TrackingInfo } from './parseEntity'
import parseMapping from './parseMapping'
import parseCompositeKey from './parseCompositeKey'
import { error, typeError, validTypes, isDynamoDbType } from './utils'

const parseEntityAttributes = <
  ReadonlyAttributeDefinitions extends
    | AttributeDefinitions
    | O.Readonly<AttributeDefinitions, A.Key, 'deep'>
>(
  attributes: ReadonlyAttributeDefinitions,
  track: TrackingInfo
) => {
  // Parse attributes into standard format
  const parsedAttributes = Object.keys(attributes).reduce((acc, field: string) => {
    const attributeDefinition = attributes[field]

    // If a string value
    if (typeof attributeDefinition === 'string') {
      if (isDynamoDbType(attributeDefinition)) {
        // Merge and return mapping
        return Object.assign(acc, parseMapping(field, { type: attributeDefinition }, track))
      } else {
        // If invalid type, throw error
        typeError(field)
      }
    }

    // If an array
    if (Array.isArray(attributeDefinition)) {
      return Object.assign(
        acc,
        parseCompositeKey<ReadonlyAttributeDefinitions>(
          field,
          // 🔨 TOIMPROVE: Use typeguard
          attributes[field] as CompositeAttributeDefinition,
          track,
          attributes
        )
      )
    }

    // If complex mapping
    // 🔨 TOIMPROVE: Use typeguard
    const fieldVal = attributes[field] as PureAttributeDefinition
    // Default field to 'string'
    fieldVal.type = fieldVal.type || 'string'

    // If invalid type, throw error
    if (!validTypes.includes(fieldVal.type)) {
      typeError(field)
    }

    return Object.assign(acc, parseMapping(field, fieldVal, track))
  }, {} as Record<string, PureAttributeDefinition>)

  // Check that a partitionKey was defined (additional checks done when adding table)
  if (!track.keys.partitionKey) error('Entity requires a partitionKey attribute')

  // Return keys and attributes
  return {
    keys: track.keys,
    attributes: parsedAttributes
  }
} // end parseEntityAttrbutes

export default parseEntityAttributes
