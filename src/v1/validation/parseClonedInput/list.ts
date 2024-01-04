import type {
  Extension,
  AttributeValue,
  ListAttribute,
  ListAttributeBasicValue,
  AttributeBasicValue
} from 'v1/schema'
import { isArray } from 'v1/utils/validation/isArray'
import { DynamoDBToolboxError } from 'v1/errors'

import type { ParsingOptions } from './types'
import { parseAttributeClonedInput } from './attribute'

export function* parseListAttributeClonedInput<EXTENSION extends Extension>(
  listAttribute: ListAttribute,
  input: AttributeBasicValue<EXTENSION>,
  parsingOptions: ParsingOptions<EXTENSION> = {} as ParsingOptions<EXTENSION>
): Generator<ListAttributeBasicValue<EXTENSION>, ListAttributeBasicValue<EXTENSION>> {
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

  const parsers: Generator<AttributeValue<EXTENSION>, AttributeValue<EXTENSION>>[] = []

  for (const element of input.values()) {
    parsers.push(parseAttributeClonedInput(listAttribute.elements, element, parsingOptions))
  }

  yield parsers.map(parser => parser.next().value)

  return parsers.map(parser => parser.next().value)
}
