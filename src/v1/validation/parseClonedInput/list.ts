import type { Extension, ListAttribute, AttributeBasicValue } from 'v1/schema'
import { isArray } from 'v1/utils/validation'
import { DynamoDBToolboxError } from 'v1/errors'

import type { ParsingOptions, ListAttributeParsedBasicValue } from './types'
import { parseAttributeClonedInput } from './attribute'

export const parseListAttributeClonedInput = <EXTENSION extends Extension>(
  listAttribute: ListAttribute,
  input: AttributeBasicValue<EXTENSION>,
  parsingOptions: ParsingOptions<EXTENSION> = {} as ParsingOptions<EXTENSION>
): ListAttributeParsedBasicValue<EXTENSION> => {
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

  const parsedInput: ListAttributeParsedBasicValue<EXTENSION> = []

  input.forEach(element =>
    parsedInput.push(parseAttributeClonedInput(listAttribute.elements, element, parsingOptions))
  )

  return parsedInput
}
