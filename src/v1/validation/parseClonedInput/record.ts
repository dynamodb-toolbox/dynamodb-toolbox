import type { RecordAttribute, ResolvedAttribute, AdditionalResolution } from 'v1/schema'
import { isObject } from 'v1/utils/validation'
import { DynamoDBToolboxError } from 'v1/errors'

import { parseAttributeClonedInput } from './attribute'
import type { ParsingOptions, ParsedRecordAttributeInput } from './types'

export const parseRecordAttributeClonedInput = <ADDITIONAL_RESOLUTION extends AdditionalResolution>(
  recordAttribute: RecordAttribute,
  input: ResolvedAttribute<ADDITIONAL_RESOLUTION>,
  parsingOptions: ParsingOptions = {}
): ParsedRecordAttributeInput<ADDITIONAL_RESOLUTION> => {
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

  const parsedInput: ParsedRecordAttributeInput<ADDITIONAL_RESOLUTION> = {}

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
