import type { ListAttribute, PossiblyUndefinedResolvedAttribute } from 'v1/item'
import { isArray } from 'v1/utils/validation'
import { DynamoDBToolboxError } from 'v1/errors'

import { parseAttributeKeyInput } from './attribute'

export const parseListAttributeKeyInput = (
  listAttribute: ListAttribute,
  input: PossiblyUndefinedResolvedAttribute
): PossiblyUndefinedResolvedAttribute => {
  if (!isArray(input)) {
    throw new DynamoDBToolboxError('commands.parseKeyInput.invalidAttributeInput', {
      message: `Attribute ${listAttribute.path} should be an ${listAttribute.type}`,
      path: listAttribute.path,
      payload: {
        received: input,
        expected: listAttribute.type
      }
    })
  }

  const parsedKeyInput: PossiblyUndefinedResolvedAttribute[] = []

  input.forEach(element =>
    parsedKeyInput.push(parseAttributeKeyInput(listAttribute.elements, element))
  )

  return parsedKeyInput
}
