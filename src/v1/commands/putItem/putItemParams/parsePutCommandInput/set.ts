import type { SetAttribute, PossiblyUndefinedResolvedAttribute } from 'v1'
import { isSet } from 'v1/utils/validation'
import { DynamoDBToolboxError } from 'v1/errors'

import { parseAttributePutCommandInput } from './attribute'

export const parseSetAttributePutCommandInput = (
  setAttribute: SetAttribute,
  input: PossiblyUndefinedResolvedAttribute
): PossiblyUndefinedResolvedAttribute => {
  if (!isSet(input)) {
    throw new DynamoDBToolboxError('putItemCommand.invalidAttributeInput', {
      message: `Attribute ${setAttribute.path} should be an ${setAttribute.type}`,
      path: setAttribute.path,
      payload: {
        received: input,
        expected: setAttribute.type
      }
    })
  }

  const parsedPutItemInput: PossiblyUndefinedResolvedAttribute = new Set()

  input.forEach(element =>
    parsedPutItemInput.add(parseAttributePutCommandInput(setAttribute.elements, element))
  )

  return parsedPutItemInput
}
