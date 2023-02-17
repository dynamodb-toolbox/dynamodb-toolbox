import { SetAttribute, PossiblyUndefinedResolvedAttribute } from 'v1'
import { isSet } from 'v1/utils/validation'

import { parseAttributePutCommandInput } from './attribute'

export const parseSetAttributePutCommandInput = (
  setAttribute: SetAttribute,
  input: PossiblyUndefinedResolvedAttribute
): PossiblyUndefinedResolvedAttribute => {
  if (!isSet(input)) {
    // TODO
    throw new Error()
  }

  const parsedPutItemInput: PossiblyUndefinedResolvedAttribute = new Set()

  input.forEach(element =>
    parsedPutItemInput.add(parseAttributePutCommandInput(setAttribute.elements, element))
  )

  return parsedPutItemInput
}
