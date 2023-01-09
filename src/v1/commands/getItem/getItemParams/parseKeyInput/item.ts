import { Item, PossiblyUndefinedResolvedItem, PutItem } from 'v1'
import { isObject } from 'v1/utils/validation'

import { parseAttributeKeyInput } from './attribute'

export const parseItemKeyInput = <ITEM extends Item>(
  item: Item,
  input: PossiblyUndefinedResolvedItem
): PutItem<ITEM> => {
  if (!isObject(input)) {
    // TODO
    throw new Error()
  }

  const parsedKeyInput: PossiblyUndefinedResolvedItem = {}

  // Check that keyInput entries match schema
  Object.entries(input).forEach(([attributeName, attributeInput]) => {
    const attribute = item.attributes[attributeName]

    if (attribute !== undefined && attribute.key) {
      parsedKeyInput[attributeName] = parseAttributeKeyInput(attribute, attributeInput)
    } else {
      // TODO Add strict mode, and simply return if strict mode is off
      // TODO
      throw new Error()
    }
  })

  // Check that key schema attributes entries are matched by putItemInput
  item.keyAttributesNames.forEach(attributeName => {
    const attribute = item.attributes[attributeName]

    if (parsedKeyInput[attributeName] === undefined) {
      parsedKeyInput[attributeName] = parseAttributeKeyInput(attribute, undefined)
    }
  })

  return parsedKeyInput as PutItem<ITEM>
}
