import cloneDeep from 'lodash.clonedeep'

import type { AnyOfAttribute, ResolvedAttribute, AdditionalResolution } from 'v1/schema'

import type {
  AnyOfAttributeClonedInputsWithDefaults,
  CloneInputAndAddDefaultsOptions
} from './types'
import { cloneAttributeInputAndAddDefaults } from './attribute'

export const cloneAnyOfAttributeInputAndAddDefaults = <
  ADDITIONAL_RESOLUTION extends AdditionalResolution
>(
  attribute: AnyOfAttribute,
  input: ResolvedAttribute<ADDITIONAL_RESOLUTION>,
  options: CloneInputAndAddDefaultsOptions = {}
): AnyOfAttributeClonedInputsWithDefaults<ADDITIONAL_RESOLUTION> | undefined => {
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
