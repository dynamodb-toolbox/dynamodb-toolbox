import type { ListAttribute, PossiblyUndefinedResolvedAttribute } from 'v1'
import { isArray } from 'v1/utils/validation'

import { parseAttributeKeyInput } from './attribute'

export const parseListAttributeKeyInput = (
  listAttribute: ListAttribute,
  input: PossiblyUndefinedResolvedAttribute
): PossiblyUndefinedResolvedAttribute => {
  if (!isArray(input)) {
    // TODO
    throw new Error()
  }

  const parsedKeyInput: PossiblyUndefinedResolvedAttribute[] = []

  input.forEach(element =>
    parsedKeyInput.push(parseAttributeKeyInput(listAttribute.elements, element))
  )

  return parsedKeyInput
}
