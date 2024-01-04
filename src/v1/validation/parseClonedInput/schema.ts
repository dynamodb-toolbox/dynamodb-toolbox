import type { Schema, Item, Extension, AttributeValue } from 'v1/schema'
import type { If } from 'v1/types'
import { isObject } from 'v1/utils/validation/isObject'
import { DynamoDBToolboxError } from 'v1/errors'

import type { HasExtension } from '../types'
import type { ParsingOptions } from './types'
import { parseAttributeClonedInput } from './attribute'
import { doesAttributeMatchFilters } from './doesAttributeMatchFilter'

export function* parseSchemaClonedInput<EXTENSION extends Extension = never>(
  schema: Schema,
  input: Item<EXTENSION>,
  ...[parsingOptions = {} as ParsingOptions<EXTENSION>]: If<
    HasExtension<EXTENSION>,
    [options: ParsingOptions<EXTENSION>],
    [options?: ParsingOptions<EXTENSION>]
  >
): Generator<Item<EXTENSION>, Item<EXTENSION>> {
  const { filters } = parsingOptions

  if (!isObject(input)) {
    throw new DynamoDBToolboxError('parsing.invalidItem', {
      message: 'Put command items should be objects',
      payload: {
        received: input,
        expected: 'object'
      }
    })
  }

  const parsers: Record<string, Generator<AttributeValue<EXTENSION>>> = {}

  // Keep attributes that match filtered schema
  Object.entries(input).forEach(([attributeName, attributeInput]) => {
    const attribute = schema.attributes[attributeName]

    if (attribute === undefined) return

    if (doesAttributeMatchFilters(attribute, filters)) {
      parsers[attributeName] = parseAttributeClonedInput(attribute, attributeInput, parsingOptions)
    }
  })

  // Add other attributes
  Object.entries(schema.attributes)
    .filter(
      ([attributeName, attribute]) =>
        parsers[attributeName] === undefined && doesAttributeMatchFilters(attribute, filters)
    )
    .forEach(([attributeName, attribute]) => {
      parsers[attributeName] = parseAttributeClonedInput(attribute, undefined, parsingOptions)
    })

  yield Object.fromEntries(
    Object.entries(parsers)
      .map(([attributeName, attribute]) => [attributeName, attribute.next().value])
      .filter(([, attributeValue]) => attributeValue !== undefined)
  )

  return Object.fromEntries(
    Object.entries(parsers)
      .map(([attributeName, attribute]) => [
        schema.attributes[attributeName].savedAs ?? attributeName,
        attribute.next().value
      ])
      .filter(([, attributeValue]) => attributeValue !== undefined)
  )
}
