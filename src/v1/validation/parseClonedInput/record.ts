import type {
  RecordAttribute,
  RecordAttributeBasicValue,
  AttributeBasicValue,
  Extension
} from 'v1/schema'
import { DynamoDBToolboxError } from 'v1/errors'
import { isObject } from 'v1/utils/validation/isObject'

import type { ParsingOptions } from './types'
import { parseAttributeClonedInput } from './attribute'
import { parsePrimitiveAttributeClonedInput } from './primitive'

export const parseRecordAttributeClonedInput = <EXTENSION extends Extension>(
  recordAttribute: RecordAttribute,
  input: AttributeBasicValue<EXTENSION>,
  parsingOptions: ParsingOptions<EXTENSION> = {} as ParsingOptions<EXTENSION>
): RecordAttributeBasicValue<EXTENSION> => {
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

  const parsedInput: RecordAttributeBasicValue<EXTENSION> = {}

  Object.entries(input).forEach(([key, element]) => {
    const parsedElementInput = parseAttributeClonedInput(
      recordAttribute.elements,
      element,
      parsingOptions
    )

    if (parsedElementInput !== undefined) {
      parsedInput[
        parsePrimitiveAttributeClonedInput(recordAttribute.keys, key) as string
      ] = parsedElementInput
    }
  })

  return parsedInput
}
