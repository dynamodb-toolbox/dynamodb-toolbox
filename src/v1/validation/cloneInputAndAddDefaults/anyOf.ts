import cloneDeep from 'lodash.clonedeep'

import type { AnyOfAttribute, AttributeValue, Extension } from 'v1/schema'

import type { AnyOfAttributeClonedInputsWithDefaults, AttributeCloningOptions } from './types'
import { cloneAttributeInputAndAddDefaults } from './attribute'

export const cloneAnyOfAttributeInputAndAddDefaults = <
  EXTENSION extends Extension,
  CONTEXT_EXTENSION extends Extension = EXTENSION
>(
  attribute: AnyOfAttribute,
  input: AttributeValue<EXTENSION>,
  options: AttributeCloningOptions<EXTENSION, CONTEXT_EXTENSION> = {} as AttributeCloningOptions<
    EXTENSION,
    CONTEXT_EXTENSION
  >
): AnyOfAttributeClonedInputsWithDefaults<EXTENSION> | undefined => {
  const clonedInputsWithDefaults = attribute.elements.map(element =>
    cloneAttributeInputAndAddDefaults(element, input, options)
  )

  return clonedInputsWithDefaults.every(clonedInput => clonedInput === undefined)
    ? undefined
    : {
        originalInput: cloneDeep(input),
        clonedInputsWithDefaults: attribute.elements.map(element =>
          cloneAttributeInputAndAddDefaults(element, input, options)
        )
      }
}
