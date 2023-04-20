import type { SetAttribute, PossiblyUndefinedResolvedAttribute } from 'v1/item'
import { isSet } from 'v1/utils/validation'

import { parseSavedAttribute } from './attribute'

export const parseSavedSetAttribute = (
  setAttribute: SetAttribute,
  input: PossiblyUndefinedResolvedAttribute
): PossiblyUndefinedResolvedAttribute => {
  if (!isSet(input)) {
    // TODO
    throw new Error()
    // throw new DynamoDBToolboxError('putItemCommand.invalidAttributeInput', {
    //   message: `Attribute ${setAttribute.path} should be an ${setAttribute.type}`,
    //   path: setAttribute.path,
    //   payload: {
    //     received: input,
    //     expected: setAttribute.type
    //   }
    // })
  }

  const parsedPutItemInput: PossiblyUndefinedResolvedAttribute = new Set()

  input.forEach(element =>
    parsedPutItemInput.add(parseSavedAttribute(setAttribute.elements, element))
  )

  return parsedPutItemInput
}
