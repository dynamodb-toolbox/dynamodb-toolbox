import cloneDeep from 'lodash.clonedeep'

import { Item, PossiblyUndefinedResolvedItem } from 'v1'
import { isObject } from 'v1/utils/validation'

import { cloneAttributeInputAndAddInitialDefaults } from './attribute'

export const cloneInputAndAddInitialDefaults = (
  item: Item,
  input: PossiblyUndefinedResolvedItem
): PossiblyUndefinedResolvedItem => {
  if (!isObject(input)) {
    return cloneDeep(input)
  }

  const inputWithInitialDefaults: PossiblyUndefinedResolvedItem = {}

  const additionalAttributes: Set<string> = new Set(Object.keys(input))

  Object.entries(item.attributes).forEach(([attributeName, attribute]) => {
    const attributeInputWithInitialDefaults = cloneAttributeInputAndAddInitialDefaults(
      attribute,
      input[attributeName]
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
