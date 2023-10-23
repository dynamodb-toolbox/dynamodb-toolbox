import cloneDeep from 'lodash.clonedeep'

import type { AttributeBasicValue, ListAttribute, Extension } from 'v1/schema'
import { isArray } from 'v1/utils/validation'

import type { AttributeCloningOptions } from './types'
import { cloneAttributeInputAndAddDefaults } from './attribute'

export const cloneListAttributeInputAndAddDefaults = <
  EXTENSION extends Extension,
  CONTEXT_EXTENSION extends Extension = EXTENSION
>(
  listAttribute: ListAttribute,
  input: AttributeBasicValue<EXTENSION>,
  options: AttributeCloningOptions<EXTENSION, CONTEXT_EXTENSION> = {} as AttributeCloningOptions<
    EXTENSION,
    CONTEXT_EXTENSION
  >
): AttributeBasicValue<EXTENSION> => {
  if (!isArray(input)) {
    return cloneDeep(input)
  }

  return input.map(elementInput =>
    cloneAttributeInputAndAddDefaults(listAttribute.elements, elementInput, options)
  )
}
