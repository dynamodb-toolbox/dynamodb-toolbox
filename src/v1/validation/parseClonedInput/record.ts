import cloneDeep from 'lodash.clonedeep'

import type {
  RecordAttribute,
  RecordAttributeBasicValue,
  AttributeBasicValue,
  Extension,
  AttributeValue
} from 'v1/schema'
import type { If } from 'v1/types'
import { DynamoDBToolboxError } from 'v1/errors'
import { isObject } from 'v1/utils/validation/isObject'

import type { HasExtension } from '../types'
import type { ParsingOptions } from './types'
import { parseAttributeClonedInput } from './attribute'

export function* parseRecordAttributeClonedInput<
  INPUT_EXTENSION extends Extension = never,
  SCHEMA_EXTENSION extends Extension = INPUT_EXTENSION
>(
  recordAttribute: RecordAttribute,
  inputValue: AttributeBasicValue<INPUT_EXTENSION>,
  ...[options = {} as ParsingOptions<INPUT_EXTENSION, SCHEMA_EXTENSION>]: If<
    HasExtension<INPUT_EXTENSION>,
    [options: ParsingOptions<INPUT_EXTENSION, SCHEMA_EXTENSION>],
    [options?: ParsingOptions<INPUT_EXTENSION, SCHEMA_EXTENSION>]
  >
): Generator<
  RecordAttributeBasicValue<INPUT_EXTENSION>,
  RecordAttributeBasicValue<INPUT_EXTENSION>
> {
  const parsers: [
    Generator<AttributeValue<INPUT_EXTENSION>, AttributeValue<INPUT_EXTENSION>>,
    Generator<AttributeValue<INPUT_EXTENSION>, AttributeValue<INPUT_EXTENSION>>
  ][] = []

  const isInputValueObject = isObject(inputValue)
  if (isInputValueObject) {
    for (const [key, element] of Object.entries(inputValue)) {
      parsers.push([
        parseAttributeClonedInput(recordAttribute.keys, key, options),
        parseAttributeClonedInput(recordAttribute.elements, element, options)
      ])
    }
  }

  const clonedValue = isInputValueObject
    ? Object.fromEntries(
        parsers
          .map(([keyParser, elementParser]) => [keyParser.next().value, elementParser.next().value])
          .filter(([, element]) => element !== undefined)
      )
    : cloneDeep(inputValue)
  yield clonedValue

  if (!isInputValueObject) {
    throw new DynamoDBToolboxError('parsing.invalidAttributeInput', {
      message: `Attribute ${recordAttribute.path} should be a ${recordAttribute.type}`,
      path: recordAttribute.path,
      payload: {
        received: inputValue,
        expected: recordAttribute.type
      }
    })
  }

  const parsedValue = Object.fromEntries(
    parsers
      .map(([keyParser, elementParser]) => [keyParser.next().value, elementParser.next().value])
      .filter(([, element]) => element !== undefined)
  )
  yield parsedValue

  const collapsedValue = Object.fromEntries(
    parsers
      .map(([keyParser, elementParser]) => [keyParser.next().value, elementParser.next().value])
      .filter(([, element]) => element !== undefined)
  )
  return collapsedValue
}
