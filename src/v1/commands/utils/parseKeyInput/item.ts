import type { Item, PossiblyUndefinedResolvedItem } from 'v1'
import { isObject } from 'v1/utils/validation'

import { parseAttributeKeyInput } from './attribute'

export const parseItemKeyInput = (
  item: Item,
  input: PossiblyUndefinedResolvedItem
): PossiblyUndefinedResolvedItem => {
  if (!isObject(input)) {
    // TODO
    throw new Error()
  }

  const parsedKeyInput: PossiblyUndefinedResolvedItem = {}

  // Check that keyInput entries match schema
  Object.entries(input).forEach(([attributeName, attributeInput]) => {
    const attribute = item.attributes[attributeName]

    if (attribute !== undefined && attribute.key) {
      const parsedAttributeKeyInput = parseAttributeKeyInput(attribute, attributeInput)

      if (parsedAttributeKeyInput !== undefined) {
        parsedKeyInput[attributeName] = parsedAttributeKeyInput
      }
    }
  })

  // Check that key schema attributes entries are matched by putItemInput
  item.keyAttributesNames.forEach(attributeName => {
    const attribute = item.attributes[attributeName]

    if (parsedKeyInput[attributeName] === undefined) {
      const parsedAttributeKeyInput = parseAttributeKeyInput(attribute, undefined)

      if (parsedAttributeKeyInput !== undefined) {
        parsedKeyInput[attributeName] = parsedAttributeKeyInput
      }
    }
  })

  return parsedKeyInput
}
