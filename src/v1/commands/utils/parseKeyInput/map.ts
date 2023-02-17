import type { MapAttribute, PossiblyUndefinedResolvedAttribute } from 'v1'
import { isObject } from 'v1/utils/validation'

import { parseAttributeKeyInput } from './attribute'

export const parseMapAttributeKeyInput = (
  mapAttribute: MapAttribute,
  input: PossiblyUndefinedResolvedAttribute
): PossiblyUndefinedResolvedAttribute => {
  if (!isObject(input)) {
    // TODO
    throw new Error()
  }

  const parsedKeyInput: PossiblyUndefinedResolvedAttribute = {}

  // Check that keyInput entries match schema
  Object.entries(input).forEach(([attributeName, attributeInput]) => {
    const attribute = mapAttribute.attributes[attributeName]

    if (attribute !== undefined && attribute.key) {
      const parsedAttributeKeyInput = parseAttributeKeyInput(attribute, attributeInput)

      if (parsedAttributeKeyInput !== undefined) {
        parsedKeyInput[attributeName] = parsedAttributeKeyInput
      }
    }
  })

  // Check that key schema attributes entries are matched by putItemInput
  mapAttribute.keyAttributesNames.forEach(attributeName => {
    const attribute = mapAttribute.attributes[attributeName]

    if (parsedKeyInput[attributeName] === undefined) {
      const parsedAttributeKeyInput = parseAttributeKeyInput(attribute, undefined)

      if (parsedAttributeKeyInput !== undefined) {
        parsedKeyInput[attributeName] = parsedAttributeKeyInput
      }
    }
  })

  return parsedKeyInput
}
