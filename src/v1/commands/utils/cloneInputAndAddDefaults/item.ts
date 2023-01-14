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

  const inputWithInitialDefaults: PossiblyUndefinedResolvedItem = {}

  const additionalAttributes: Set<string> = new Set(Object.keys(input))

  Object.entries(item.attributes).forEach(([attributeName, attribute]) => {
    const attributeInputWithInitialDefaults = cloneAttributeInputAndAddDefaults(
      attribute,
      input[attributeName],
      { computeDefaults: computeDefaults && computeDefaults[attributeName], contextInputs: [input] }
    )

    if (attributeInputWithInitialDefaults !== undefined) {
      inputWithInitialDefaults[attributeName] = attributeInputWithInitialDefaults
    }

    additionalAttributes.delete(attributeName)
  })

  additionalAttributes.forEach(attributeName => {
    inputWithInitialDefaults[attributeName] = cloneDeep(input[attributeName])
  })

  return inputWithInitialDefaults
}
