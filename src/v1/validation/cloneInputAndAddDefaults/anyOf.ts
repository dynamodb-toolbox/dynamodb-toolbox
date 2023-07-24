import cloneDeep from 'lodash.clonedeep'

import type { AnyOfAttribute, ResolvedAttribute, Extension } from 'v1/schema'

import type {
  AnyOfAttributeClonedInputsWithDefaults,
  CloneInputAndAddDefaultsOptions
} from './types'
import { cloneAttributeInputAndAddDefaults } from './attribute'

export const cloneAnyOfAttributeInputAndAddDefaults = <EXTENSION extends Extension>(
  attribute: AnyOfAttribute,
  input: ResolvedAttribute<EXTENSION>,
  options: CloneInputAndAddDefaultsOptions = {}
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
