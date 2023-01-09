import { Item, PossiblyUndefinedResolvedItem, PutItem } from 'v1'
import { isObject } from 'v1/utils/validation'
import { isClosed } from 'v1/item/utils'

import { parseAttributePutCommandInput } from './attribute'

export const parseItemPutCommandInput = <ITEM extends Item>(
  item: Item,
  input: PossiblyUndefinedResolvedItem
): PutItem<ITEM> => {
  if (!isObject(input)) {
    // TODO
    throw new Error()
  }

  const parsedPutItemInput: PossiblyUndefinedResolvedItem = {}

  // Check that putItemInput entries match schema
  Object.entries(input).forEach(([attributeName, attributeInput]) => {
    const attribute = item.attributes[attributeName]

    if (attribute !== undefined) {
      parsedPutItemInput[attributeName] = parseAttributePutCommandInput(attribute, attributeInput)
    } else {
      if (isClosed(item)) {
        // TODO Add strict mode, and simply return if strict mode is off
        // TODO
        throw new Error()
      } else {
        parsedPutItemInput[attributeName] = attributeInput
      }
    }
  })

  // Check that schema attributes entries are matched by putItemInput
  Object.entries(item.attributes).forEach(([attributeName, attribute]) => {
    if (parsedPutItemInput[attributeName] === undefined) {
      parsedPutItemInput[attributeName] = parseAttributePutCommandInput(attribute, undefined)
    }
  })

  return parsedPutItemInput as PutItem<ITEM>
}
