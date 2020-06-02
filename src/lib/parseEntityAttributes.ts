/**
 * DynamoDB Toolbox: A simple set of tools for working with Amazon DynamoDB
 * @author Jeremy Daly <jeremy@jeremydaly.com>
 * @license MIT
 */

import parseMapping from './parseMapping';

import parseCompositeKey from './parseCompositeKey';
import { error, typeError, validTypes } from './utils';

export default (attributes,track,nested) => {
  attributes = Object.keys(attributes).reduce((acc,field) => {
    if (typeof attributes[field] === 'string') {
      return validTypes.includes(attributes[field]) ?
        Object.assign(acc,parseMapping(field,{ type: attributes[field] },track))
        : typeError(field)
    } else if (Array.isArray(attributes[field])) {
      return Object.assign(acc,parseCompositeKey(field,attributes[field],track,attributes))
    } else {
      return !attributes[field].type || validTypes.includes(attributes[field].type) ?
        Object.assign(acc,parseMapping(field,attributes[field],track,nested))
        : typeError(field)
    }
  },{})

  // Check that a partitionKey was defined (additional checks done when adding table)
  if (!track.keys.partitionKey) error('Entity requires a partitionKey attribute')

  // Return keys and attributes
  return { 
    keys: track.keys,
    attributes
  }
    
}; // end parseEntityAttrbutes