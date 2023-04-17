import type { ListAttribute, PossiblyUndefinedResolvedAttribute } from 'v1/item'
import { isArray } from 'v1/utils/validation'
import { DynamoDBToolboxError } from 'v1/errors'

import { parseAttributePutCommandInput } from './attribute'

export const parseListAttributePutCommandInput = (
  listAttribute: ListAttribute,
  input: PossiblyUndefinedResolvedAttribute
): PossiblyUndefinedResolvedAttribute => {
  if (!isArray(input)) {
    throw new DynamoDBToolboxError('putItemCommand.invalidAttributeInput', {
      message: `Attribute ${listAttribute.path} should be an ${listAttribute.type}`,
      path: listAttribute.path,
      payload: {
        received: input,
        expected: listAttribute.type
      }
    })
  }

  const parsedPutItemInput: PossiblyUndefinedResolvedAttribute[] = []

  input.forEach(element =>
    parsedPutItemInput.push(parseAttributePutCommandInput(listAttribute.elements, element))
  )

  return parsedPutItemInput
}
