import cloneDeep from 'lodash.clonedeep'

import type {
  SetAttribute,
  AttributeValue,
  AttributeBasicValue,
  SetAttributeBasicValue,
  Extension
} from 'v1/schema'
import type { If } from 'v1/types'
import { isSet } from 'v1/utils/validation/isSet'
import { DynamoDBToolboxError } from 'v1/errors'

import type { HasExtension } from '../types'
import type { ParsingOptions } from './types'
import { parseAttributeClonedInput } from './attribute'

export function* parseSetAttributeClonedInput<
  INPUT_EXTENSION extends Extension = never,
  SCHEMA_EXTENSION extends Extension = INPUT_EXTENSION
>(
  setAttribute: SetAttribute,
  inputValue: AttributeBasicValue<INPUT_EXTENSION>,
  ...[options = {} as ParsingOptions<INPUT_EXTENSION, SCHEMA_EXTENSION>]: If<
    HasExtension<INPUT_EXTENSION>,
    [options: ParsingOptions<INPUT_EXTENSION, SCHEMA_EXTENSION>],
    [options?: ParsingOptions<INPUT_EXTENSION, SCHEMA_EXTENSION>]
  >
): Generator<SetAttributeBasicValue<INPUT_EXTENSION>, SetAttributeBasicValue<INPUT_EXTENSION>> {
  const parsers: Generator<AttributeValue<INPUT_EXTENSION>, AttributeValue<INPUT_EXTENSION>>[] = []

  const isInputValueSet = isSet(inputValue)
  if (isInputValueSet) {
    for (const element of inputValue.values()) {
      parsers.push(parseAttributeClonedInput(setAttribute.elements, element, options))
    }
  }

  const clonedValue = isInputValueSet
    ? new Set(parsers.map(parser => parser.next().value))
    : cloneDeep(inputValue)
  yield clonedValue as SetAttributeBasicValue<INPUT_EXTENSION>

  if (!isInputValueSet) {
    throw new DynamoDBToolboxError('parsing.invalidAttributeInput', {
      message: `Attribute ${setAttribute.path} should be a ${setAttribute.type}`,
      path: setAttribute.path,
      payload: {
        received: inputValue,
        expected: setAttribute.type
      }
    })
  }

  const parsedValue = new Set(parsers.map(parser => parser.next().value))
  yield parsedValue

  const collapsedValue = new Set(parsers.map(parser => parser.next().value))
  return collapsedValue
}
