import type { SetAttribute, PossiblyUndefinedResolvedAttribute } from 'v1/schema'
import { isSet } from 'v1/utils/validation'
import { DynamoDBToolboxError } from 'v1/errors'

import { parseAttributeClonedInput } from './attribute'
import type { ParsingOptions, ParsedSetAttributeInput } from './types'

export const parseSetAttributeClonedInput = (
  setAttribute: SetAttribute,
  input: PossiblyUndefinedResolvedAttribute,
  parsingOptions: ParsingOptions = {}
): ParsedSetAttributeInput => {
  if (!isSet(input)) {
    throw new DynamoDBToolboxError('parsing.invalidAttributeInput', {
      message: `Attribute ${setAttribute.path} should be a ${setAttribute.type}`,
      path: setAttribute.path,
      payload: {
        received: input,
        expected: setAttribute.type
      }
    })
  }

  const parsedInput: ParsedSetAttributeInput = new Set()

  input.forEach(element =>
    parsedInput.add(parseAttributeClonedInput(setAttribute.elements, element, parsingOptions))
  )

  return parsedInput
}
