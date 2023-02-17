import type { Attribute, PossiblyUndefinedResolvedAttribute } from 'v1'

import { clonePrimitiveAttributeInputAndAddDefaults } from './primitive'
import { cloneListAttributeInputAndAddDefaults } from './list'
import { cloneMapAttributeInputAndAddDefaults } from './map'
import { cloneRecordAttributeInputAndAddDefaults } from './record'
import type { DefaultsComputeOptions } from './types'

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
    case 'record':
      return cloneRecordAttributeInputAndAddDefaults(attribute, input, defaultsComputeOptions)
    case 'anyOf':
      // TODO
      return undefined
  }
}
