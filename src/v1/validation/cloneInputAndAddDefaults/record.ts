import cloneDeep from 'lodash.clonedeep'

import type { AttributeBasicValue, RecordAttribute, Extension } from 'v1'
import { isObject } from 'v1/utils/validation'

import type { AttributeCloningOptions } from './types'
import { cloneAttributeInputAndAddDefaults } from './attribute'

export const cloneRecordAttributeInputAndAddDefaults = <
  EXTENSION extends Extension,
  CONTEXT_EXTENSION extends Extension = EXTENSION
>(
  recordAttribute: RecordAttribute,
  input: AttributeBasicValue<EXTENSION>,
  options: AttributeCloningOptions<EXTENSION, CONTEXT_EXTENSION> = {} as AttributeCloningOptions<
    EXTENSION,
    CONTEXT_EXTENSION
  >
): AttributeBasicValue<EXTENSION> => {
  if (!isObject(input)) {
    return cloneDeep(input)
  }

  return Object.fromEntries(
    Object.entries(input).map(([elementKey, elementInput]) => [
      elementKey,
      cloneAttributeInputAndAddDefaults(recordAttribute.elements, elementInput, options)
    ])
  )
}
