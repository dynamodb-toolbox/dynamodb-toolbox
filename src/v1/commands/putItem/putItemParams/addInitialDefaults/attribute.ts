import cloneDeep from 'lodash.clonedeep'

import { Attribute, PossiblyUndefinedResolvedAttribute } from 'v1'

import { addListInitialDefaults } from './list'
import { addPrimitiveInitialDefault } from './primitive'
import { addMapInitialDefaults } from './map'

export const addAttributeInitialDefaults = (
  attribute: Attribute,
  putItemInput: PossiblyUndefinedResolvedAttribute
): PossiblyUndefinedResolvedAttribute => {
  switch (attribute.type) {
    case 'string':
    case 'number':
    case 'binary':
    case 'boolean':
    case 'any':
      return addPrimitiveInitialDefault(attribute, putItemInput)
    case 'set':
      return cloneDeep(putItemInput)
    case 'list':
      return addListInitialDefaults(attribute, putItemInput)
    case 'map':
      return addMapInitialDefaults(attribute, putItemInput)
  }
}
