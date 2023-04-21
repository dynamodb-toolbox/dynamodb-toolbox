import type { SetAttribute, PossiblyUndefinedResolvedAttribute } from 'v1/item'
import { isSet } from 'v1/utils/validation'
import { DynamoDBToolboxError } from 'v1/errors'

import { parseAttributeKeyInput } from './attribute'

export const parseSetAttributeKeyInput = (
  setAttribute: SetAttribute,
  input: PossiblyUndefinedResolvedAttribute
): PossiblyUndefinedResolvedAttribute => {
  if (!isSet(input)) {
    throw new DynamoDBToolboxError('commands.parseKeyInput.invalidAttributeInput', {
      message: `Attribute ${setAttribute.path} should be an ${setAttribute.type}`,
      path: setAttribute.path,
      payload: {
        received: input,
        expected: setAttribute.type
      }
    })
  }

  const parsedKeyInput: PossiblyUndefinedResolvedAttribute = new Set()

  input.forEach(element =>
    parsedKeyInput.add(parseAttributeKeyInput(setAttribute.elements, element))
  )

  return parsedKeyInput
}
