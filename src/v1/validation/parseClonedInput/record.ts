import type { RecordAttribute, ResolvedAttribute, Extension } from 'v1/schema'
import { isObject } from 'v1/utils/validation'
import { DynamoDBToolboxError } from 'v1/errors'

import { parseAttributeClonedInput } from './attribute'
import type { ParsingOptions, ParsedRecordAttributeInput } from './types'

export const parseRecordAttributeClonedInput = <EXTENSION extends Extension>(
  recordAttribute: RecordAttribute,
  input: ResolvedAttribute<EXTENSION>,
  parsingOptions: ParsingOptions = {}
): ParsedRecordAttributeInput<EXTENSION> => {
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

  const parsedInput: ParsedRecordAttributeInput<EXTENSION> = {}

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
