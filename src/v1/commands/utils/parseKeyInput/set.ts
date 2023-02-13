import type { SetAttribute, PossiblyUndefinedResolvedAttribute, AttributeKeyInput } from 'v1'
import { isSet } from 'v1/utils/validation'

import { parseAttributeKeyInput } from './attribute'

export const parseSetAttributeKeyInput = <SET_ATTRIBUTE extends SetAttribute>(
  setAttribute: SET_ATTRIBUTE,
  input: PossiblyUndefinedResolvedAttribute
): AttributeKeyInput<SET_ATTRIBUTE> => {
  if (!isSet(input)) {
    // TODO
    throw new Error()
  }

  const parsedKeyInput: PossiblyUndefinedResolvedAttribute = new Set()

  input.forEach(element =>
    parsedKeyInput.add(parseAttributeKeyInput(setAttribute.elements, element))
  )

  return parsedKeyInput as AttributeKeyInput<SET_ATTRIBUTE>
}
