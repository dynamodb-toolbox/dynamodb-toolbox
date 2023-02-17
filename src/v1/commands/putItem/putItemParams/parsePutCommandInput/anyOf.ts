import { AnyOfAttribute, PossiblyUndefinedResolvedAttribute } from 'v1'

import { parseAttributePutCommandInput } from './attribute'

export const parseAnyOfAttributePutCommandInput = (
  anyOfAttribute: AnyOfAttribute,
  input: PossiblyUndefinedResolvedAttribute
): PossiblyUndefinedResolvedAttribute => {
  let parsedPutItemInput: PossiblyUndefinedResolvedAttribute | undefined = undefined
  let firstError: unknown = undefined

  for (const element of anyOfAttribute.elements) {
    try {
      parsedPutItemInput = parseAttributePutCommandInput(element, input)
      break
    } catch (error) {
      if (firstError === undefined) {
        firstError = error
      }
    }
  }

  if (parsedPutItemInput === undefined) {
    if (firstError !== undefined) {
      throw firstError
    } else {
      // TODO
      throw new Error()
    }
  }

  return parsedPutItemInput
}
