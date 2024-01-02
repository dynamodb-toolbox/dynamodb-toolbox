import {
  MapAttribute,
  MapAttributeBasicValue,
  AttributeBasicValue,
  Extension,
  AttributeValue
} from 'v1/schema'
import { DynamoDBToolboxError } from 'v1/errors'
import { isObject } from 'v1/utils/validation/isObject'

import type { ParsingOptions } from './types'
import { parseAttributeClonedInput } from './attribute'
import { doesAttributeMatchFilters } from './doesAttributeMatchFilter'

export function* parseMapAttributeClonedInput<EXTENSION extends Extension>(
  mapAttribute: MapAttribute,
  input: AttributeBasicValue<EXTENSION>,
  parsingOptions: ParsingOptions<EXTENSION> = {} as ParsingOptions<EXTENSION>
): Generator<MapAttributeBasicValue<EXTENSION>, MapAttributeBasicValue<EXTENSION>> {
  const { filters } = parsingOptions

  if (!isObject(input)) {
    throw new DynamoDBToolboxError('parsing.invalidAttributeInput', {
      message: `Attribute ${mapAttribute.path} should be a ${mapAttribute.type}`,
      path: mapAttribute.path,
      payload: {
        received: input,
        expected: mapAttribute.type
      }
    })
  }

  const parsers: Record<string, Generator<AttributeValue<EXTENSION>>> = {}

  // Keep attributes that match filtered schema
  Object.entries(input).forEach(([attributeName, attributeInput]) => {
    const attribute = mapAttribute.attributes[attributeName]

    if (attribute === undefined) return

    if (doesAttributeMatchFilters(attribute, filters)) {
      parsers[attributeName] = parseAttributeClonedInput(attribute, attributeInput, parsingOptions)
    }
  })

  // Add other attributes
  Object.entries(mapAttribute.attributes)
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
        mapAttribute.attributes[attributeName].savedAs ?? attributeName,
        attribute.next().value
      ])
      .filter(([, attributeValue]) => attributeValue !== undefined)
  )
}
