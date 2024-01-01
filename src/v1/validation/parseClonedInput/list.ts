import type {
  Extension,
  ListAttribute,
  ListAttributeBasicValue,
  AttributeBasicValue
} from 'v1/schema'
import { isArray } from 'v1/utils/validation/isArray'
import { DynamoDBToolboxError } from 'v1/errors'

import type { ParsingOptions } from './types'
import { parseAttributeClonedInput } from './attribute'

export const parseListAttributeClonedInput = <EXTENSION extends Extension>(
  listAttribute: ListAttribute,
  input: AttributeBasicValue<EXTENSION>,
  parsingOptions: ParsingOptions<EXTENSION> = {} as ParsingOptions<EXTENSION>
): ListAttributeBasicValue<EXTENSION> => {
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

  const parsedInput: ListAttributeBasicValue<EXTENSION> = []

  input.forEach(element =>
    parsedInput.push(parseAttributeClonedInput(listAttribute.elements, element, parsingOptions))
  )

  return parsedInput
}
