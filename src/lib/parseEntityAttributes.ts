/**
 * DynamoDB Toolbox: A simple set of tools for working with Amazon DynamoDB
 * @author Jeremy Daly <jeremy@jeremydaly.com>
 * @license MIT
 */

 
import { EntityAttributes, EntityAttributeConfig, EntityCompositeAttributes, EntityAttributeConfiguration } from '../classes/Entity'
import { TrackingInfo } from './parseEntity'
import parseMapping from './parseMapping'
import parseCompositeKey from './parseCompositeKey'
import { error, typeError, validTypes } from './utils'

export default (attributes: EntityAttributes, track: TrackingInfo) => {
  // Parse attributes into standard format
  attributes = Object.keys(attributes).reduce((acc,field) => {
    // If a string value
    if (typeof attributes[field] === 'string') {
      // If invalid type, throw error
      if (!validTypes.includes(attributes[field].toString())) { typeError(field) }
      // Merge and return mapping
      return Object.assign(acc,parseMapping(field,{ type: attributes[field] } as EntityAttributeConfig,track))
    // If an array
    } else if (Array.isArray(attributes[field])) {
      return Object.assign(acc,parseCompositeKey(field,attributes[field] as EntityCompositeAttributes,track,attributes))
    // Else if complex mapping
    } else {
      // TODO: Is there a better way to do this without casting this value?
      const fieldVal = attributes[field] as EntityAttributeConfig
      // Default field to 'string'
      fieldVal.type = !fieldVal.type ? 'string' : fieldVal.type
      if (!validTypes.includes(fieldVal.type)) { typeError(field) }
      return Object.assign(acc,parseMapping(field,fieldVal,track))
    }
  },{})

  // Check that a partitionKey was defined (additional checks done when adding table)
  if (!track.keys.partitionKey) error('Entity requires a partitionKey attribute')

  // Return keys and attributes
  return { 
    keys: track.keys,
    attributes: attributes as EntityAttributeConfiguration
  }
    
} // end parseEntityAttrbutes