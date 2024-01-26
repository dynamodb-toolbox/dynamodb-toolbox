import cloneDeep from 'lodash.clonedeep'

import type { Schema, Item, Extension, AttributeValue } from 'v1/schema'
import type { If } from 'v1/types'
import { isObject } from 'v1/utils/validation/isObject'
import { DynamoDBToolboxError } from 'v1/errors'

import type { HasExtension } from '../types'
import type { ParsingOptions } from './types'
import { parseAttributeClonedInput } from './attribute'
import { doesAttributeMatchFilters } from './doesAttributeMatchFilter'

export function* parseSchemaClonedInput<SCHEMA_EXTENSION extends Extension = never>(
  schema: Schema,
  inputValue: Item<SCHEMA_EXTENSION>,
  ...[options = {} as ParsingOptions<SCHEMA_EXTENSION, SCHEMA_EXTENSION>]: If<
    HasExtension<SCHEMA_EXTENSION>,
    [options: ParsingOptions<SCHEMA_EXTENSION, SCHEMA_EXTENSION>],
    [options?: ParsingOptions<SCHEMA_EXTENSION, SCHEMA_EXTENSION>]
  >
): Generator<Item<SCHEMA_EXTENSION>, Item<SCHEMA_EXTENSION>> {
  const { filters, fill = true } = options
  const parsers: Record<string, Generator<AttributeValue<SCHEMA_EXTENSION>>> = {}
  let restEntries: [string, AttributeValue<SCHEMA_EXTENSION>][] = []

  const isInputValueObject = isObject(inputValue)

  if (isInputValueObject) {
    const additionalAttributeNames = new Set(Object.keys(inputValue))

    Object.entries(schema.attributes)
      .filter(([, attribute]) => doesAttributeMatchFilters(attribute, filters))
      .forEach(([attributeName, attribute]) => {
        parsers[attributeName] = parseAttributeClonedInput(
          attribute,
          inputValue[attributeName],
          options
        )

        additionalAttributeNames.delete(attributeName)
      })

    restEntries = [...additionalAttributeNames.values()].map(attributeName => [
      attributeName,
      cloneDeep(inputValue[attributeName])
    ])
  }

  if (fill) {
    if (isInputValueObject) {
      const defaultedValue = Object.fromEntries([
        ...Object.entries(parsers)
          .map(([attributeName, attribute]) => [attributeName, attribute.next().value])
          .filter(([, defaultedAttributeValue]) => defaultedAttributeValue !== undefined),
        ...restEntries
      ])
      yield defaultedValue

      const linkedValue = Object.fromEntries([
        ...Object.entries(parsers)
          .map(([attributeName, parser]) => [attributeName, parser.next(defaultedValue).value])
          .filter(([, linkedAttributeValue]) => linkedAttributeValue !== undefined),
        ...restEntries
      ])
      yield linkedValue
    } else {
      const defaultedValue = cloneDeep(inputValue)
      yield defaultedValue

      const linkedValue = defaultedValue
      yield linkedValue
    }
  }

  if (!isInputValueObject) {
    throw new DynamoDBToolboxError('parsing.invalidItem', {
      message: 'Items should be objects',
      payload: {
        received: inputValue,
        expected: 'object'
      }
    })
  }

  const parsedValue = Object.fromEntries(
    Object.entries(parsers)
      .map(([attributeName, attribute]) => [attributeName, attribute.next().value])
      .filter(([, attributeValue]) => attributeValue !== undefined)
  )
  yield parsedValue

  const collapsedValue = Object.fromEntries(
    Object.entries(parsers)
      .map(([attributeName, attribute]) => [
        schema.attributes[attributeName].savedAs ?? attributeName,
        attribute.next().value
      ])
      .filter(([, attributeValue]) => attributeValue !== undefined)
  )
  return collapsedValue
}
