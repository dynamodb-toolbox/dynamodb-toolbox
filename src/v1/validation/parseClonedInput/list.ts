import cloneDeep from 'lodash.clonedeep'

import type {
  Extension,
  AttributeValue,
  ListAttribute,
  ListAttributeBasicValue,
  AttributeBasicValue
} from 'v1/schema'
import type { If } from 'v1/types'
import { isArray } from 'v1/utils/validation/isArray'
import { DynamoDBToolboxError } from 'v1/errors'

import type { HasExtension } from '../types'
import type { ParsingOptions } from './types'
import { parseAttributeClonedInput } from './attribute'

export function* parseListAttributeClonedInput<
  INPUT_EXTENSION extends Extension = never,
  SCHEMA_EXTENSION extends Extension = INPUT_EXTENSION
>(
  listAttribute: ListAttribute,
  inputValue: AttributeBasicValue<INPUT_EXTENSION>,
  ...[options = {} as ParsingOptions<INPUT_EXTENSION, SCHEMA_EXTENSION>]: If<
    HasExtension<INPUT_EXTENSION>,
    [options: ParsingOptions<INPUT_EXTENSION, SCHEMA_EXTENSION>],
    [options?: ParsingOptions<INPUT_EXTENSION, SCHEMA_EXTENSION>]
  >
): Generator<ListAttributeBasicValue<INPUT_EXTENSION>, ListAttributeBasicValue<INPUT_EXTENSION>> {
  const parsers: Generator<AttributeValue<INPUT_EXTENSION>, AttributeValue<INPUT_EXTENSION>>[] = []

  const isInputValueArray = isArray(inputValue)
  if (isInputValueArray) {
    for (const element of inputValue) {
      parsers.push(parseAttributeClonedInput(listAttribute.elements, element, options))
    }
  }

  const clonedValue = isInputValueArray
    ? parsers.map(parser => parser.next().value)
    : cloneDeep(inputValue)
  yield clonedValue as ListAttributeBasicValue<INPUT_EXTENSION>

  if (!isInputValueArray) {
    throw new DynamoDBToolboxError('parsing.invalidAttributeInput', {
      message: `Attribute ${listAttribute.path} should be a ${listAttribute.type}`,
      path: listAttribute.path,
      payload: {
        received: inputValue,
        expected: listAttribute.type
      }
    })
  }

  const parsedValue = parsers.map(parser => parser.next().value)
  yield parsedValue

  const collapsedValue = parsers.map(parser => parser.next().value)
  return collapsedValue
}
