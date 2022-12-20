import { Item, PossiblyUndefinedResolvedItem } from 'v1'

import { renameAttributeSavedAsAttributes } from './attribute'

export const renameSavedAsAttributes = (
  item: Item,
  input: PossiblyUndefinedResolvedItem
): PossiblyUndefinedResolvedItem => {
  Object.entries(item.attributes).forEach(([attributeName, attribute]) => {
    const attributeInput = input[attributeName]

    if (attributeInput !== undefined) {
      input[attributeName] = renameAttributeSavedAsAttributes(attribute, attributeInput)
    }

    if (attribute.savedAs !== undefined) {
      input[attribute.savedAs] = input[attributeName]
      delete input[attributeName]
    }
  })

  return input
}
