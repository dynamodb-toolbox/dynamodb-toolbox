import cloneDeep from 'lodash.clonedeep'

import { Attribute, PossiblyUndefinedResolvedAttribute } from 'v1'

import { clonePrimitiveAttributeInputAndAddInitialDefaults } from './primitive'
import { cloneListAttributeInputAndAddInitialDefaults } from './list'
import { cloneMapAttributeInputAndAddInitialDefaults } from './map'

export const cloneAttributeInputAndAddInitialDefaults = (
  attribute: Attribute,
  input: PossiblyUndefinedResolvedAttribute
): PossiblyUndefinedResolvedAttribute => {
  switch (attribute.type) {
    case 'string':
    case 'number':
    case 'binary':
    case 'boolean':
    case 'any':
      return clonePrimitiveAttributeInputAndAddInitialDefaults(attribute, input)
    case 'set':
      return cloneDeep(input)
    case 'list':
      return cloneListAttributeInputAndAddInitialDefaults(attribute, input)
    case 'map':
      return cloneMapAttributeInputAndAddInitialDefaults(attribute, input)
  }
}
