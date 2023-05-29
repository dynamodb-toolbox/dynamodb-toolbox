import type { Schema, PossiblyUndefinedResolvedItem } from 'v1/schema'

import { renameAttributeSavedAsAttributes } from './attribute'

export const renameSavedAsAttributes = (
  schema: Schema,
  input: PossiblyUndefinedResolvedItem
): PossiblyUndefinedResolvedItem => {
  Object.entries(schema.attributes).forEach(([attributeName, attribute]) => {
    const attributeInput = input[attributeName]

    if (attributeInput !== undefined) {
      input[attributeName] = renameAttributeSavedAsAttributes(attribute, attributeInput)
    }

    if (attribute.savedAs !== undefined && input[attributeName] !== undefined) {
      input[attribute.savedAs] = input[attributeName]
      delete input[attributeName]
    }
  })

  return input
}
