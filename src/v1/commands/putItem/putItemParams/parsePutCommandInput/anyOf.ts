import type { AnyOfAttribute, PossiblyUndefinedResolvedAttribute } from 'v1/item'
import { DynamoDBToolboxError } from 'v1/errors'

import { parseAttributePutCommandInput } from './attribute'

export const parseAnyOfAttributePutCommandInput = (
  anyOfAttribute: AnyOfAttribute,
  input: PossiblyUndefinedResolvedAttribute
): PossiblyUndefinedResolvedAttribute => {
  let parsedPutItemInput: PossiblyUndefinedResolvedAttribute | undefined = undefined

  for (const element of anyOfAttribute.elements) {
    try {
      parsedPutItemInput = parseAttributePutCommandInput(element, input)
      break
    } catch {
      continue
    }
  }

  if (parsedPutItemInput === undefined) {
    throw new DynamoDBToolboxError('putItemCommand.invalidAttributeInput', {
      message: `Attribute ${anyOfAttribute.path} does not match any of the possible sub-types`,
      path: anyOfAttribute.path,
      payload: { received: input }
    })
  }

  return parsedPutItemInput
}
