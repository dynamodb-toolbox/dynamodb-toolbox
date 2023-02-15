import { MapAttribute, PossiblyUndefinedResolvedAttribute, AttributePutItem } from 'v1'
import { isObject } from 'v1/utils/validation'

import { parseAttributePutCommandInput } from './attribute'

export const parseMapAttributePutCommandInput = <MAP_ATTRIBUTE extends MapAttribute>(
  mapAttribute: MAP_ATTRIBUTE,
  input: PossiblyUndefinedResolvedAttribute
): AttributePutItem<MAP_ATTRIBUTE> => {
  if (!isObject(input)) {
    // TODO
    throw new Error()
  }

  const parsedPutItemInput: PossiblyUndefinedResolvedAttribute = {}

  // Check that putItemInput entries match schema
  Object.entries(input).forEach(([attributeName, attributeInput]) => {
    const attribute = mapAttribute.attributes[attributeName]

    if (attribute === undefined) return

    const parsedAttributePutCommandInput = parseAttributePutCommandInput(attribute, attributeInput)

    if (parsedAttributePutCommandInput !== undefined) {
      parsedPutItemInput[attributeName] = parsedAttributePutCommandInput
    }
  })

  // Check that schema attributes entries are matched by putItemInput
  Object.entries(mapAttribute.attributes).forEach(([attributeName, attribute]) => {
    if (parsedPutItemInput[attributeName] === undefined) {
      const parsedAttributePutCommandInput = parseAttributePutCommandInput(attribute, undefined)

      if (parsedAttributePutCommandInput !== undefined) {
        parsedPutItemInput[attributeName] = parsedAttributePutCommandInput
      }
    }
  })

  return parsedPutItemInput as AttributePutItem<MAP_ATTRIBUTE>
}
