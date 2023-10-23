import cloneDeep from 'lodash.clonedeep'

import type {
  MapAttribute,
  AttributeValue,
  AttributeBasicValue,
  MapAttributeBasicValue,
  Extension
} from 'v1/schema'
import { isObject } from 'v1/utils/validation'

import type { AttributeCloningOptions } from './types'
import { cloneAttributeInputAndAddDefaults } from './attribute'

export const cloneMapAttributeInputAndAddDefaults = <
  EXTENSION extends Extension,
  CONTEXT_EXTENSION extends Extension = EXTENSION
>(
  mapAttribute: MapAttribute,
  input: AttributeBasicValue<EXTENSION>,
  options: AttributeCloningOptions<EXTENSION, CONTEXT_EXTENSION> = {} as AttributeCloningOptions<
    EXTENSION,
    CONTEXT_EXTENSION
  >
): AttributeBasicValue<EXTENSION> => {
  if (!isObject(input)) {
    return cloneDeep(input)
  }

  const inputWithDefaults: MapAttributeBasicValue<EXTENSION> = {}

  const additionalAttributes: Set<string> = new Set(Object.keys(input))

  Object.entries(mapAttribute.attributes).forEach(([attributeName, attribute]) => {
    let attributeInputWithDefaults: AttributeValue<EXTENSION> | undefined = undefined

    attributeInputWithDefaults = cloneAttributeInputAndAddDefaults(
      attribute,
      input[attributeName],
      options
    )

    if (attributeInputWithDefaults !== undefined) {
      inputWithDefaults[attributeName] = attributeInputWithDefaults
    }

    additionalAttributes.delete(attributeName)
  })

  additionalAttributes.forEach(attributeName => {
    inputWithDefaults[attributeName] = cloneDeep(input[attributeName])
  })

  return inputWithDefaults
}
