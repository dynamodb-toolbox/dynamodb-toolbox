import type { AnyOfAttribute, PossiblyUndefinedResolvedAttribute } from 'v1'

import { parseAttributeKeyInput } from './attribute'

export const parseAnyOfAttributeKeyInput = (
  anyOfAttribute: AnyOfAttribute,
  input: PossiblyUndefinedResolvedAttribute
): PossiblyUndefinedResolvedAttribute => {
  let parsedKeyInput: PossiblyUndefinedResolvedAttribute = undefined
  let firstError: unknown = undefined

  for (const element of anyOfAttribute.elements) {
    try {
      parsedKeyInput = parseAttributeKeyInput(element, input)
      break
    } catch (error) {
      if (firstError === undefined) {
        firstError = error
      }
    }
  }

  if (parsedKeyInput === undefined) {
    if (firstError !== undefined) {
      throw firstError
    } else {
      // TODO
      throw new Error()
    }
  }
  return parsedKeyInput
}
