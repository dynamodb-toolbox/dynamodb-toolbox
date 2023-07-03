import type { ListAttribute, PossiblyUndefinedResolvedAttribute } from 'v1/schema'
import { isArray } from 'v1/utils/validation'
import { DynamoDBToolboxError } from 'v1/errors'

import { parseAttributeClonedInput } from './attribute'
import type { ParsingOptions, ParsedListAttributeInput } from './types'

export const parseListAttributeClonedInput = (
  listAttribute: ListAttribute,
  input: PossiblyUndefinedResolvedAttribute,
  parsingOptions: ParsingOptions = {}
): ParsedListAttributeInput => {
  if (!isArray(input)) {
    throw new DynamoDBToolboxError('parsing.invalidAttributeInput', {
      message: `Attribute ${listAttribute.path} should be a ${listAttribute.type}`,
      path: listAttribute.path,
      payload: {
        received: input,
        expected: listAttribute.type
      }
    })
  }

  const parsedInput: ParsedListAttributeInput = []

  input.forEach(element =>
    parsedInput.push(parseAttributeClonedInput(listAttribute.elements, element, parsingOptions))
  )

  return parsedInput
}
