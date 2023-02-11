import type { AnyOfAttribute, PossiblyUndefinedResolvedAttribute, KeyInput } from 'v1'

import { parseAttributeKeyInput } from './attribute'

export const parseAnyOfAttributeKeyInput = <ANY_OF_ATTRIBUTE extends AnyOfAttribute>(
  anyOfAttribute: ANY_OF_ATTRIBUTE,
  input: PossiblyUndefinedResolvedAttribute
): KeyInput<ANY_OF_ATTRIBUTE> => {
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
  return parsedKeyInput as KeyInput<ANY_OF_ATTRIBUTE>
}
