import { AnyOfAttribute, PossiblyUndefinedResolvedAttribute, PutItem } from 'v1'

import { parseAttributePutCommandInput } from './attribute'

export const parseAnyOfAttributePutCommandInput = <ANY_OF_ATTRIBUTE extends AnyOfAttribute>(
  anyOfAttribute: ANY_OF_ATTRIBUTE,
  input: PossiblyUndefinedResolvedAttribute
): PutItem<ANY_OF_ATTRIBUTE> => {
  let parsedPutItemInput: PossiblyUndefinedResolvedAttribute = undefined
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

  return parsedPutItemInput as PutItem<ANY_OF_ATTRIBUTE>
}
