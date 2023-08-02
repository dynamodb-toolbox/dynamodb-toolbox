import type { Attribute, Extension, AttributeValue } from 'v1/schema'
import type { If } from 'v1/types'

import type { HasExtension } from '../types'
import type { AttributeCloningOptions, ExtensionCloner } from './types'
import { clonePrimitiveAttributeInputAndAddDefaults } from './primitive'
import { cloneListAttributeInputAndAddDefaults } from './list'
import { cloneMapAttributeInputAndAddDefaults } from './map'
import { cloneRecordAttributeInputAndAddDefaults } from './record'
import { cloneAnyOfAttributeInputAndAddDefaults } from './anyOf'
import { defaultCloneExtension } from './utils'

export const cloneAttributeInputAndAddDefaults = <EXTENSION extends Extension = never>(
  attribute: Attribute,
  input: AttributeValue<EXTENSION> | undefined,
  ...[options = {} as AttributeCloningOptions<EXTENSION>]: If<
    HasExtension<EXTENSION>,
    [options: AttributeCloningOptions<EXTENSION>],
    [options?: AttributeCloningOptions<EXTENSION>]
  >
): AttributeValue<EXTENSION> | undefined => {
  const {
    /**
     * @debt type "Maybe there's a way not to have to cast here"
     */
    cloneExtension = (defaultCloneExtension as unknown) as ExtensionCloner<EXTENSION>
  } = options

  const { isExtension, clonedExtension, basicInput } = cloneExtension(attribute, input, options)
  if (isExtension) {
    return clonedExtension
  }

  switch (attribute.type) {
    case 'any':
    case 'string':
    case 'number':
    case 'binary':
    case 'boolean':
    case 'set':
      return clonePrimitiveAttributeInputAndAddDefaults(attribute, basicInput, options)
    case 'list':
      return cloneListAttributeInputAndAddDefaults(attribute, basicInput, options)
    case 'map':
      return cloneMapAttributeInputAndAddDefaults(attribute, basicInput, options)
    case 'record':
      return cloneRecordAttributeInputAndAddDefaults(attribute, basicInput, options)
    case 'anyOf':
      return cloneAnyOfAttributeInputAndAddDefaults(attribute, basicInput, options)
  }
}
