import { Item, PossiblyUndefinedResolvedItem } from 'v1'
import { isObject } from 'v1/utils/validation'

import { parseAttributePutCommandInput } from './attribute'

export const parseItemPutCommandInput = (
  item: Item,
  input: PossiblyUndefinedResolvedItem
): PossiblyUndefinedResolvedItem => {
  if (!isObject(input)) {
    // TODO
    throw new Error()
  }

  const parsedPutItemInput: PossiblyUndefinedResolvedItem = {}

  // Check that putItemInput entries match schema
  Object.entries(input).forEach(([attributeName, attributeInput]) => {
    const attribute = item.attributes[attributeName]

    if (attribute === undefined) return

    const parsedAttributePutCommandInput = parseAttributePutCommandInput(attribute, attributeInput)

    if (parsedAttributePutCommandInput !== undefined) {
      parsedPutItemInput[attributeName] = parsedAttributePutCommandInput
    }
  })

  // Check that schema attributes entries are matched by putItemInput
  Object.entries(item.attributes).forEach(([attributeName, attribute]) => {
    if (parsedPutItemInput[attributeName] === undefined) {
      const parsedAttributePutCommandInput = parseAttributePutCommandInput(attribute, undefined)

      if (parsedAttributePutCommandInput !== undefined) {
        parsedPutItemInput[attributeName] = parsedAttributePutCommandInput
      }
    }
  })

  return parsedPutItemInput
}
