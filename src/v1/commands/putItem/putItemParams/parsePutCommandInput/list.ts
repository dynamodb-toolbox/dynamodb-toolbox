import { ListAttribute, PossiblyUndefinedResolvedAttribute } from 'v1'
import { isArray } from 'v1/utils/validation'

import { parseAttributePutCommandInput } from './attribute'

export const parseListAttributePutCommandInput = (
  listAttribute: ListAttribute,
  input: PossiblyUndefinedResolvedAttribute
): PossiblyUndefinedResolvedAttribute => {
  if (!isArray(input)) {
    // TODO
    throw new Error()
  }

  const parsedPutItemInput: PossiblyUndefinedResolvedAttribute[] = []

  input.forEach(element =>
    parsedPutItemInput.push(parseAttributePutCommandInput(listAttribute.elements, element))
  )

  return parsedPutItemInput
}
