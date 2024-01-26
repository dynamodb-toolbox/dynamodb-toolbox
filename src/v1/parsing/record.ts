import cloneDeep from 'lodash.clonedeep'

import type {
  RecordAttribute,
  RecordAttributeBasicValue,
  AttributeBasicValue,
  Extension,
  AttributeValue,
  Item
} from 'v1/schema'
import type { If } from 'v1/types'
import { DynamoDBToolboxError } from 'v1/errors'
import { isObject } from 'v1/utils/validation/isObject'

import type { HasExtension, ParsingOptions } from './types'
import { attributeParser } from './attribute'

export function* recordAttributeParser<
  INPUT_EXTENSION extends Extension = never,
  SCHEMA_EXTENSION extends Extension = INPUT_EXTENSION
>(
  attribute: RecordAttribute,
  inputValue: AttributeBasicValue<INPUT_EXTENSION>,
  ...[options = {} as ParsingOptions<INPUT_EXTENSION, SCHEMA_EXTENSION>]: If<
    HasExtension<INPUT_EXTENSION>,
    [options: ParsingOptions<INPUT_EXTENSION, SCHEMA_EXTENSION>],
    [options?: ParsingOptions<INPUT_EXTENSION, SCHEMA_EXTENSION>]
  >
): Generator<
  RecordAttributeBasicValue<INPUT_EXTENSION>,
  RecordAttributeBasicValue<INPUT_EXTENSION>,
  Item<SCHEMA_EXTENSION> | undefined
> {
  const { fill = true } = options

  const parsers: [
    Generator<AttributeValue<INPUT_EXTENSION>, AttributeValue<INPUT_EXTENSION>>,
    Generator<AttributeValue<INPUT_EXTENSION>, AttributeValue<INPUT_EXTENSION>>
  ][] = []

  const isInputValueObject = isObject(inputValue)
  if (isInputValueObject) {
    for (const [key, element] of Object.entries(inputValue)) {
      parsers.push([
        attributeParser(attribute.keys, key, options),
        attributeParser(attribute.elements, element, options)
      ])
    }
  }

  if (fill) {
    if (isInputValueObject) {
      const defaultedValue = Object.fromEntries(
        parsers
          .map(([keyParser, elementParser]) => [keyParser.next().value, elementParser.next().value])
          .filter(([, element]) => element !== undefined)
      )
      const itemInput = yield defaultedValue

      const linkedValue = Object.fromEntries(
        parsers
          .map(([keyParser, elementParser]) => [
            keyParser.next().value,
            elementParser.next(itemInput).value
          ])
          .filter(([, element]) => element !== undefined)
      )
      yield linkedValue
    } else {
      const defaultedValue = (cloneDeep(
        inputValue
      ) as unknown) as RecordAttributeBasicValue<INPUT_EXTENSION>
      yield defaultedValue

      const linkedValue = defaultedValue
      yield linkedValue
    }
  }

  if (!isInputValueObject) {
    throw new DynamoDBToolboxError('parsing.invalidAttributeInput', {
      message: `Attribute ${attribute.path} should be a ${attribute.type}`,
      path: attribute.path,
      payload: {
        received: inputValue,
        expected: attribute.type
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
