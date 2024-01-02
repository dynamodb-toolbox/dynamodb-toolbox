import type {
  SetAttribute,
  AttributeValue,
  AttributeBasicValue,
  SetAttributeBasicValue,
  Extension
} from 'v1/schema'
import { isSet } from 'v1/utils/validation/isSet'
import { DynamoDBToolboxError } from 'v1/errors'

import type { ParsingOptions } from './types'
import { parseAttributeClonedInput } from './attribute'

export function* parseSetAttributeClonedInput<EXTENSION extends Extension>(
  setAttribute: SetAttribute,
  input: AttributeBasicValue<EXTENSION>,
  parsingOptions: ParsingOptions<EXTENSION> = {} as ParsingOptions<EXTENSION>
): Generator<SetAttributeBasicValue<EXTENSION>, SetAttributeBasicValue<EXTENSION>> {
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

  const parsers: Generator<AttributeValue<EXTENSION>, AttributeValue<EXTENSION>>[] = []

  for (const element of input.values()) {
    parsers.push(parseAttributeClonedInput(setAttribute.elements, element, parsingOptions))
  }

  yield new Set(parsers.map(parser => parser.next().value))

  return new Set(parsers.map(parser => parser.next().value))
}
