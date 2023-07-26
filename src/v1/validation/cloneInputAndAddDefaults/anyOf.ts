import cloneDeep from 'lodash.clonedeep'

import type { AnyOfAttribute, AttributeValue, Extension } from 'v1/schema'

import type { AnyOfAttributeClonedInputsWithDefaults, AttributeOptions } from './types'
import { cloneAttributeInputAndAddDefaults } from './attribute'

export const cloneAnyOfAttributeInputAndAddDefaults = <EXTENSION extends Extension>(
  attribute: AnyOfAttribute,
  input: AttributeValue<EXTENSION>,
  options: AttributeOptions<EXTENSION> = {} as AttributeOptions<EXTENSION>
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
