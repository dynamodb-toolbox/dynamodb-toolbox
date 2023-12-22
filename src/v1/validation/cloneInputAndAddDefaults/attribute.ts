import cloneDeep from 'lodash.clonedeep'

import type { Attribute, Extension, AttributeValue } from 'v1/schema'
import type { If } from 'v1/types'
import { isFunction } from 'v1/utils/validation'

import type { HasExtension } from '../types'
import type { AttributeCloningOptions, ExtensionCloner } from './types'
import { cloneListAttributeInputAndAddDefaults } from './list'
import { cloneMapAttributeInputAndAddDefaults } from './map'
import { cloneRecordAttributeInputAndAddDefaults } from './record'
import { cloneAnyOfAttributeInputAndAddDefaults } from './anyOf'
import { defaultCloneExtension, getCommandDefault } from './utils'

export const cloneAttributeInputAndAddDefaults = <
  EXTENSION extends Extension = never,
  CONTEXT_EXTENSION extends Extension = EXTENSION
>(
  attribute: Attribute,
  input: AttributeValue<EXTENSION> | undefined,
  ...[options = {} as AttributeCloningOptions<EXTENSION, CONTEXT_EXTENSION>]: If<
    HasExtension<EXTENSION>,
    [options: AttributeCloningOptions<EXTENSION, CONTEXT_EXTENSION>],
    [options?: AttributeCloningOptions<EXTENSION, CONTEXT_EXTENSION>]
  >
): AttributeValue<EXTENSION> | undefined => {
  const {
    /**
     * @debt type "Maybe there's a way not to have to cast here"
     */
    cloneExtension = (defaultCloneExtension as unknown) as ExtensionCloner<
      EXTENSION,
      CONTEXT_EXTENSION
    >
  } = options

  const { isExtension, clonedExtension, basicInput } = cloneExtension(attribute, input, options)
  if (isExtension) {
    return clonedExtension
  }

  if (basicInput === undefined) {
    const { operationName, originalInput } = options
    const commandDefault = getCommandDefault(attribute, { operationName })

    return isFunction(commandDefault)
      ? (commandDefault(originalInput) as AttributeValue<EXTENSION> | undefined)
      : (commandDefault as AttributeValue<EXTENSION> | undefined)
  }

  switch (attribute.type) {
    case 'any':
    case 'string':
    case 'number':
    case 'binary':
    case 'boolean':
    case 'set':
      return cloneDeep(basicInput)
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
