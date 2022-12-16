import cloneDeep from 'lodash.clonedeep'

import { Item, PossiblyUndefinedResolvedAttribute } from 'v1'

import { addAttributeInitialDefaults } from './attribute'
import { isObject } from 'v1/utils/validation'

export const addItemInitialDefaults = (
  item: Item,
  putItemInput: { [key: string]: PossiblyUndefinedResolvedAttribute }
): { [key: string]: PossiblyUndefinedResolvedAttribute } => {
  if (!isObject(putItemInput)) {
    return cloneDeep(putItemInput)
  }

  const putItemInputWithInitialDefaults: { [key: string]: PossiblyUndefinedResolvedAttribute } = {}

  const additionalAttributes: Set<string> = new Set(Object.keys(putItemInput))

  Object.entries(item.attributes).forEach(([attributeName, attribute]) => {
    putItemInputWithInitialDefaults[attributeName] = addAttributeInitialDefaults(
      attribute,
      putItemInput[attributeName]
    )

    additionalAttributes.delete(attributeName)
  })

  additionalAttributes.forEach(attributeName => {
    putItemInputWithInitialDefaults[attributeName] = cloneDeep(putItemInput[attributeName])
  })

  return putItemInputWithInitialDefaults
}
