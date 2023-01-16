import cloneDeep from 'lodash.clonedeep'

import { Item, PossiblyUndefinedResolvedItem, ItemDefaultsComputer } from 'v1'
import { isObject } from 'v1/utils/validation'

import { cloneAttributeInputAndAddDefaults } from './attribute'

export const cloneInputAndAddDefaults = (
  item: Item,
  input: PossiblyUndefinedResolvedItem,
  { computeDefaults }: { computeDefaults: ItemDefaultsComputer }
): PossiblyUndefinedResolvedItem => {
  if (!isObject(input)) {
    return cloneDeep(input)
  }

  const inputWithDefaults: PossiblyUndefinedResolvedItem = {}

  const additionalAttributes: Set<string> = new Set(Object.keys(input))

  Object.entries(item.attributes).forEach(([attributeName, attribute]) => {
    const attributeInputWithDefaults = cloneAttributeInputAndAddDefaults(
      attribute,
      input[attributeName],
      { computeDefaults: computeDefaults && computeDefaults[attributeName], contextInputs: [input] }
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
