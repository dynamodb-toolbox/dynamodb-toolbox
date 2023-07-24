import type { Attribute, Extension, AttributeValue, AttributeBasicValue } from 'v1/schema'

import type { CloneInputAndAddDefaultsOptions } from './types'
import { clonePrimitiveAttributeInputAndAddDefaults } from './primitive'
import { cloneListAttributeInputAndAddDefaults } from './list'
import { cloneMapAttributeInputAndAddDefaults } from './map'
import { cloneRecordAttributeInputAndAddDefaults } from './record'
import { cloneAnyOfAttributeInputAndAddDefaults } from './anyOf'

export const cloneAttributeInputAndAddDefaults = <EXTENSION extends Extension>(
  attribute: Attribute,
  _input: AttributeValue<EXTENSION> | undefined,
  options: CloneInputAndAddDefaultsOptions = {}
): AttributeValue<EXTENSION> | undefined => {
  /**
   * @debt extensions "Support extensions"
   */
  const input = _input as AttributeBasicValue<EXTENSION> | undefined

  switch (attribute.type) {
    case 'any':
    case 'string':
    case 'number':
    case 'binary':
    case 'boolean':
    case 'set':
      return clonePrimitiveAttributeInputAndAddDefaults(attribute, input, options)
    case 'list':
      return cloneListAttributeInputAndAddDefaults(attribute, input, options)
    case 'map':
      return cloneMapAttributeInputAndAddDefaults(attribute, input, options)
    case 'record':
      return cloneRecordAttributeInputAndAddDefaults(attribute, input, options)
    case 'anyOf':
      return cloneAnyOfAttributeInputAndAddDefaults(attribute, input, options)
  }
}
