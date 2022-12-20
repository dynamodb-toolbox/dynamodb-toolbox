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

  const putItemInputWithInitialDefaults: PossiblyUndefinedResolvedItem = {}

  const additionalAttributes: Set<string> = new Set(Object.keys(input))

  Object.entries(item.attributes).forEach(([attributeName, attribute]) => {
    putItemInputWithInitialDefaults[attributeName] = cloneAttributeInputAndAddInitialDefaults(
      attribute,
      input[attributeName]
    )

    additionalAttributes.delete(attributeName)
  })

  additionalAttributes.forEach(attributeName => {
    putItemInputWithInitialDefaults[attributeName] = cloneDeep(input[attributeName])
  })

  return putItemInputWithInitialDefaults
}
