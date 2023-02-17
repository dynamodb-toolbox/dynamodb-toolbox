import type { SetAttribute, PossiblyUndefinedResolvedAttribute } from 'v1'
import { isSet } from 'v1/utils/validation'

import { parseAttributeKeyInput } from './attribute'

export const parseSetAttributeKeyInput = (
  setAttribute: SetAttribute,
  input: PossiblyUndefinedResolvedAttribute
): PossiblyUndefinedResolvedAttribute => {
  if (!isSet(input)) {
    // TODO
    throw new Error()
  }

  const parsedKeyInput: PossiblyUndefinedResolvedAttribute = new Set()

  input.forEach(element =>
    parsedKeyInput.add(parseAttributeKeyInput(setAttribute.elements, element))
  )

  return parsedKeyInput
}
