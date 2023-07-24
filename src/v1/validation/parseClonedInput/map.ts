import type { MapAttribute, AttributeValue, Extension } from 'v1'
import { isObject } from 'v1/utils/validation'
import { DynamoDBToolboxError } from 'v1/errors'
import { $savedAs } from 'v1/schema/attributes/constants/attributeOptions'

import { parseAttributeClonedInput } from './attribute'
import { doesAttributeMatchFilters } from './doesAttributeMatchFilter'
import type { ParsingOptions, ParsedMapAttributeInput } from './types'

export const parseMapAttributeClonedInput = <EXTENSION extends Extension>(
  mapAttribute: MapAttribute,
  input: AttributeValue<EXTENSION>,
  parsingOptions: ParsingOptions = {}
): ParsedMapAttributeInput<EXTENSION> => {
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

  const parsedInput: ParsedMapAttributeInput<EXTENSION> = { [$savedAs]: {} }

  // Check that entries match filtered schema
  Object.entries(input).forEach(([attributeName, attributeInput]) => {
    const attribute = mapAttribute.attributes[attributeName]

    if (attribute === undefined) return

    if (doesAttributeMatchFilters(attribute, filters)) {
      const parsedAttributeInput = parseAttributeClonedInput(
        attribute,
        attributeInput,
        parsingOptions
      )

      if (parsedAttributeInput !== undefined) {
        parsedInput[attributeName] = parsedAttributeInput

        if (attribute.savedAs !== undefined) {
          parsedInput[$savedAs][attributeName] = attribute.savedAs
        }
      }
    }
  })

  // Check that rest of filtered schema attributes are matched by input
  Object.entries(mapAttribute.attributes)
    .filter(
      ([attributeName, attribute]) =>
        parsedInput[attributeName] === undefined && doesAttributeMatchFilters(attribute, filters)
    )
    .forEach(([attributeName, attribute]) => {
      const parsedAttributeInput = parseAttributeClonedInput<EXTENSION>(
        attribute,
        undefined,
        parsingOptions
      )

      if (parsedAttributeInput !== undefined) {
        parsedInput[attributeName] = parsedAttributeInput

        if (attribute.savedAs !== undefined) {
          parsedInput[$savedAs][attributeName] = attribute.savedAs
        }
      }
    })

  return parsedInput
}
