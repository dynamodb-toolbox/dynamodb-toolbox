import cloneDeep from 'lodash.clonedeep'

import type {
  Item,
  PossiblyUndefinedResolvedItem,
  PossiblyUndefinedResolvedAttribute
} from 'v1/item'
import type { ItemDefaultsComputer } from 'v1/entity'
import { isObject } from 'v1/utils/validation'

import { cloneAttributeInputAndAddDefaults } from './attribute'

export const cloneItemInputAndAddDefaults = (
  item: Item,
  input: PossiblyUndefinedResolvedItem,
  computeDefaultsContext?: { computeDefaults: ItemDefaultsComputer }
): PossiblyUndefinedResolvedItem => {
  if (!isObject(input)) {
    return cloneDeep(input)
  }

  const inputWithDefaults: PossiblyUndefinedResolvedItem = {}

  const additionalAttributes: Set<string> = new Set(Object.keys(input))

  const canComputeDefaults = computeDefaultsContext !== undefined

  Object.entries(item.attributes).forEach(([attributeName, attribute]) => {
    let attributeInputWithDefaults: PossiblyUndefinedResolvedAttribute = undefined

    if (canComputeDefaults) {
      const { computeDefaults } = computeDefaultsContext

      attributeInputWithDefaults = cloneAttributeInputAndAddDefaults(
        attribute,
        input[attributeName],
        {
          computeDefaults: computeDefaults && computeDefaults[attributeName],
          contextInputs: [input]
        }
      )
    } else {
      attributeInputWithDefaults = cloneAttributeInputAndAddDefaults(
        attribute,
        input[attributeName]
      )
    }

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
