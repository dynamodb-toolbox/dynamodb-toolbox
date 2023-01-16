import { Attribute, PossiblyUndefinedResolvedAttribute } from 'v1'

import { clonePrimitiveAttributeInputAndAddDefaults } from './primitive'
import { cloneListAttributeInputAndAddDefaults } from './list'
import { cloneMapAttributeInputAndAddDefaults } from './map'
import { DefaultsComputeOptions } from './types'

export const cloneAttributeInputAndAddDefaults = (
  attribute: Attribute,
  input: PossiblyUndefinedResolvedAttribute,
  defaultsComputeOptions: DefaultsComputeOptions
): PossiblyUndefinedResolvedAttribute => {
  switch (attribute.type) {
    case 'any':
    case 'constant':
    case 'string':
    case 'number':
    case 'binary':
    case 'boolean':
    case 'set':
      return clonePrimitiveAttributeInputAndAddDefaults(attribute, input, defaultsComputeOptions)
    case 'list':
      return cloneListAttributeInputAndAddDefaults(attribute, input, defaultsComputeOptions)
    case 'map':
      return cloneMapAttributeInputAndAddDefaults(attribute, input, defaultsComputeOptions)
  }
}
