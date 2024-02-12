import cloneDeep from 'lodash.clonedeep'

import type {
  SetAttribute,
  AttributeValue,
  AttributeBasicValue,
  SetAttributeBasicValue,
  Extension,
  Item
} from 'v1/schema'
import type { If } from 'v1/types'
import { isSet } from 'v1/utils/validation/isSet'
import { DynamoDBToolboxError } from 'v1/errors'

import type { HasExtension, ParsingOptions } from './types'
import { attributeParser } from './attribute'

export function* setAttributeParser<
  INPUT_EXTENSION extends Extension = never,
  SCHEMA_EXTENSION extends Extension = INPUT_EXTENSION
>(
  attribute: SetAttribute,
  inputValue: AttributeBasicValue<INPUT_EXTENSION>,
  ...[options = {} as ParsingOptions<INPUT_EXTENSION, SCHEMA_EXTENSION>]: If<
    HasExtension<INPUT_EXTENSION>,
    [options: ParsingOptions<INPUT_EXTENSION, SCHEMA_EXTENSION>],
    [options?: ParsingOptions<INPUT_EXTENSION, SCHEMA_EXTENSION>]
  >
): Generator<
  SetAttributeBasicValue<INPUT_EXTENSION>,
  SetAttributeBasicValue<INPUT_EXTENSION>,
  Item<SCHEMA_EXTENSION> | undefined
> {
  const { fill = true, transform = true } = options

  const parsers: Generator<AttributeValue<INPUT_EXTENSION>, AttributeValue<INPUT_EXTENSION>>[] = []

  const isInputValueSet = isSet(inputValue)
  if (isInputValueSet) {
    for (const element of inputValue.values()) {
      parsers.push(attributeParser(attribute.elements, element, options))
    }
  }

  if (fill) {
    if (isInputValueSet) {
      const defaultedValue = new Set(parsers.map(parser => parser.next().value))
      yield defaultedValue as SetAttributeBasicValue<INPUT_EXTENSION>

      const linkedValue = new Set(parsers.map(parser => parser.next().value))
      yield linkedValue
    } else {
      const defaultedValue = (cloneDeep(
        inputValue
      ) as unknown) as SetAttributeBasicValue<INPUT_EXTENSION>
      yield defaultedValue

      const linkedValue = defaultedValue
      yield linkedValue
    }
  }

  if (!isInputValueSet) {
    const { path, type } = attribute

    throw new DynamoDBToolboxError('parsing.invalidAttributeInput', {
      message: `Attribute ${path !== undefined ? `'${path}' ` : ''}should be a ${type}.`,
      path,
      payload: {
        received: inputValue,
        expected: type
      }
    })
  }

  const parsedValue = new Set(parsers.map(parser => parser.next().value))

  if (transform) {
    yield parsedValue
  } else {
    return parsedValue
  }

  const transformedValue = new Set(parsers.map(parser => parser.next().value))
  return transformedValue
}
