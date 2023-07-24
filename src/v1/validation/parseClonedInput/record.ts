import type { RecordAttribute, AttributeBasicValue, Extension } from 'v1/schema'
import { isObject } from 'v1/utils/validation'
import { DynamoDBToolboxError } from 'v1/errors'

import type { ParsingOptions, RecordAttributeParsedBasicValue } from './types'
import { parseAttributeClonedInput } from './attribute'

export const parseRecordAttributeClonedInput = <EXTENSION extends Extension>(
  recordAttribute: RecordAttribute,
  input: AttributeBasicValue<EXTENSION>,
  parsingOptions: ParsingOptions = {}
): RecordAttributeParsedBasicValue<EXTENSION> => {
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

  const parsedInput: RecordAttributeParsedBasicValue<EXTENSION> = {}

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
