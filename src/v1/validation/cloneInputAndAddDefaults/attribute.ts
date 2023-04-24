import type { Attribute, PossiblyUndefinedResolvedAttribute } from 'v1/item'

import { clonePrimitiveAttributeInputAndAddDefaults } from './primitive'
import { cloneListAttributeInputAndAddDefaults } from './list'
import { cloneMapAttributeInputAndAddDefaults } from './map'
import { cloneRecordAttributeInputAndAddDefaults } from './record'
import { cloneAnyOfAttributeInputAndAddDefaults } from './anyOf'
import type { ComputeDefaultsContext } from './types'

export const cloneAttributeInputAndAddDefaults = (
  attribute: Attribute,
  input: PossiblyUndefinedResolvedAttribute,
  computeDefaultsContext?: ComputeDefaultsContext
): PossiblyUndefinedResolvedAttribute => {
  switch (attribute.type) {
    case 'any':
    case 'string':
    case 'number':
    case 'binary':
    case 'boolean':
    case 'set':
      return clonePrimitiveAttributeInputAndAddDefaults(attribute, input, computeDefaultsContext)
    case 'list':
      return cloneListAttributeInputAndAddDefaults(attribute, input, computeDefaultsContext)
    case 'map':
      return cloneMapAttributeInputAndAddDefaults(attribute, input, computeDefaultsContext)
    case 'record':
      return cloneRecordAttributeInputAndAddDefaults(attribute, input, computeDefaultsContext)
    case 'anyOf':
      return cloneAnyOfAttributeInputAndAddDefaults(attribute, input, computeDefaultsContext)
  }
}
