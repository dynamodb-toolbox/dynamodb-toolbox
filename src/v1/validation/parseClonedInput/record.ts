import type { RecordAttribute, PossiblyUndefinedResolvedAttribute } from 'v1/item'
import { isObject } from 'v1/utils/validation'
import { DynamoDBToolboxError } from 'v1/errors'

import { parseAttributeClonedInput } from './attribute'
import type { ParsingOptions } from './types'

export const parseRecordAttributeClonedInput = (
  recordAttribute: RecordAttribute,
  input: PossiblyUndefinedResolvedAttribute,
  parsingOptions: ParsingOptions
): PossiblyUndefinedResolvedAttribute => {
  if (!isObject(input)) {
    throw new DynamoDBToolboxError('parsing.invalidAttributeInput', {
      message: `Attribute ${recordAttribute.path} should be a ${recordAttribute.type}`,
      path: recordAttribute.path,
      payload: {
        received: input,
        expected: recordAttribute.type
      }
    })
  }

  const parsedInput: PossiblyUndefinedResolvedAttribute = {}

  Object.entries(input).forEach(([key, element]) => {
    const parsedElementInput = parseAttributeClonedInput(
      recordAttribute.elements,
      element,
      parsingOptions
    )

    if (parsedElementInput !== undefined) {
      parsedInput[
        parseAttributeClonedInput(recordAttribute.keys, key, parsingOptions) as string
      ] = parsedElementInput
    }
  })

  return parsedInput
}
