import type {
  RecordAttribute,
  RecordAttributeBasicValue,
  AttributeBasicValue,
  Extension,
  AttributeValue
} from 'v1/schema'
import { DynamoDBToolboxError } from 'v1/errors'
import { isObject } from 'v1/utils/validation/isObject'

import type { ParsingOptions } from './types'
import { parseAttributeClonedInput } from './attribute'
import { parsePrimitiveAttributeClonedInput } from './primitive'

export function* parseRecordAttributeClonedInput<EXTENSION extends Extension>(
  recordAttribute: RecordAttribute,
  input: AttributeBasicValue<EXTENSION>,
  parsingOptions: ParsingOptions<EXTENSION> = {} as ParsingOptions<EXTENSION>
): Generator<RecordAttributeBasicValue<EXTENSION>, RecordAttributeBasicValue<EXTENSION>> {
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

  const parsers: [
    Generator<AttributeValue<EXTENSION>, AttributeValue<EXTENSION>>,
    Generator<AttributeValue<EXTENSION>, AttributeValue<EXTENSION>>
  ][] = Object.entries(input).map(([key, element]) => [
    parsePrimitiveAttributeClonedInput(recordAttribute.keys, key, parsingOptions),
    parseAttributeClonedInput(recordAttribute.elements, element, parsingOptions)
  ])

  yield Object.fromEntries(
    parsers
      .map(([keyParser, elementParser]) => [keyParser.next().value, elementParser.next().value])
      .filter(([, element]) => element !== undefined)
  )

  return Object.fromEntries(
    parsers
      .map(([keyParser, elementParser]) => [keyParser.next().value, elementParser.next().value])
      .filter(([, element]) => element !== undefined)
  )
}
