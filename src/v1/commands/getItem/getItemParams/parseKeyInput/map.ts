import { MapAttribute, PossiblyUndefinedResolvedAttribute, KeyInput } from 'v1'
import { isObject } from 'v1/utils/validation'

import { parseAttributeKeyInput } from './attribute'

export const parseMapAttributeKeyInput = <MAP_ATTRIBUTE extends MapAttribute>(
  mapAttribute: MAP_ATTRIBUTE,
  input: PossiblyUndefinedResolvedAttribute
): KeyInput<MAP_ATTRIBUTE> => {
  if (!isObject(input)) {
    // TODO
    throw new Error()
  }

  const parsedKeyInput: PossiblyUndefinedResolvedAttribute = {}

  // Check that keyInput entries match schema
  Object.entries(input).forEach(([attributeName, attributeInput]) => {
    const attribute = mapAttribute.attributes[attributeName]

    if (attribute !== undefined && attribute.key) {
      parsedKeyInput[attributeName] = parseAttributeKeyInput(attribute, attributeInput)
    } else {
      // TODO Add strict mode, and simply return if strict mode is off
      // TODO
      throw new Error()
    }
  })

  // Check that key schema attributes entries are matched by putItemInput
  mapAttribute.keyAttributesNames.forEach(attributeName => {
    const attribute = mapAttribute.attributes[attributeName]

    if (parsedKeyInput[attributeName] === undefined) {
      parsedKeyInput[attributeName] = parseAttributeKeyInput(attribute, undefined)
    }
  })

  return parsedKeyInput as KeyInput<MAP_ATTRIBUTE>
}
