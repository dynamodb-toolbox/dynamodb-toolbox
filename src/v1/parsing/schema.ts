import cloneDeep from 'lodash.clonedeep'

import type { Schema, Item, Extension, AttributeValue } from 'v1/schema'
import type { If } from 'v1/types'
import { isObject } from 'v1/utils/validation/isObject'
import { DynamoDBToolboxError } from 'v1/errors'

import type { HasExtension, ParsingOptions } from './types'
import { attributeParser } from './attribute'
import { doesAttributeMatchFilters } from './doesAttributeMatchFilter'

export function* schemaParser<SCHEMA_EXTENSION extends Extension = never>(
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
      .filter(([, attr]) => doesAttributeMatchFilters(attr, filters))
      .forEach(([attrName, attr]) => {
        parsers[attrName] = attributeParser(attr, inputValue[attrName], options)

        additionalAttributeNames.delete(attrName)
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
          .map(([attrName, attr]) => [attrName, attr.next().value])
          .filter(([, defaultedAttrValue]) => defaultedAttrValue !== undefined),
        ...restEntries
      ])
      yield defaultedValue

      const linkedValue = Object.fromEntries([
        ...Object.entries(parsers)
          .map(([attrName, parser]) => [attrName, parser.next(defaultedValue).value])
          .filter(([, linkedAttrValue]) => linkedAttrValue !== undefined),
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
      .map(([attrName, attr]) => [attrName, attr.next().value])
      .filter(([, attrValue]) => attrValue !== undefined)
  )
  yield parsedValue

  const transformedValue = Object.fromEntries(
    Object.entries(parsers)
      .map(([attrName, attr]) => [
        schema.attributes[attrName].savedAs ?? attrName,
        attr.next().value
      ])
      .filter(([, attrValue]) => attrValue !== undefined)
  )
  return transformedValue
}
