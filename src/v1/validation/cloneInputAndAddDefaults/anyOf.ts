import cloneDeep from 'lodash.clonedeep'

import type { AnyOfAttribute, PossiblyUndefinedResolvedAttribute } from 'v1/item'
import type { AnyOfAttributeClonedInputsWithDefaults } from 'v1/commands/types/intermediaryAnyOfAttributeState'

import type { ComputeDefaultsContext } from './types'
import { cloneAttributeInputAndAddDefaults } from './attribute'

export const cloneAnyOfAttributeInputAndAddDefaults = (
  attribute: AnyOfAttribute,
  input: PossiblyUndefinedResolvedAttribute,
  computeDefaultsContext?: ComputeDefaultsContext
): AnyOfAttributeClonedInputsWithDefaults | undefined => {
  const clonedInputsWithDefaults = attribute.elements.map(element =>
    cloneAttributeInputAndAddDefaults(element, input, computeDefaultsContext)
  )

  return clonedInputsWithDefaults.every(clonedInput => clonedInput === undefined)
    ? undefined
    : // TODO: Maybe we could use proxies instead ? https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy
      {
        originalInput: cloneDeep(input),
        clonedInputsWithDefaults: attribute.elements.map(element =>
          cloneAttributeInputAndAddDefaults(element, input, computeDefaultsContext)
        )
      }
}
