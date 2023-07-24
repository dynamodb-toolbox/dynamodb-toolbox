import type { SetAttribute, AttributeBasicValue, Extension } from 'v1/schema'
import { isSet } from 'v1/utils/validation'
import { DynamoDBToolboxError } from 'v1/errors'

import type { ParsingOptions, SetAttributeParsedBasicValue } from './types'
import { parseAttributeClonedInput } from './attribute'

export const parseSetAttributeClonedInput = <EXTENSION extends Extension>(
  setAttribute: SetAttribute,
  input: AttributeBasicValue<EXTENSION>,
  parsingOptions: ParsingOptions = {}
): SetAttributeParsedBasicValue<EXTENSION> => {
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

  const parsedInput: SetAttributeParsedBasicValue<EXTENSION> = new Set()

  input.forEach(element =>
    parsedInput.add(parseAttributeClonedInput(setAttribute.elements, element, parsingOptions))
  )

  return parsedInput
}
