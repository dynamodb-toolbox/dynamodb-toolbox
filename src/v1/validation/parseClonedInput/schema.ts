import type { Schema, ResolvedItem, AdditionalResolution } from 'v1/schema'
import { isObject } from 'v1/utils/validation/isObject'
import { DynamoDBToolboxError } from 'v1/errors'
import { $savedAs } from 'v1/schema/attributes/constants/attributeOptions'

import { parseAttributeClonedInput } from './attribute'
import { doesAttributeMatchFilters } from './doesAttributeMatchFilter'
import type { ParsingOptions, ParsedSchemaInput } from './types'

// TODO: Factorize with map
export const parseSchemaClonedInput = <ADDITIONAL_RESOLUTION extends AdditionalResolution>(
  schema: Schema,
  input: ResolvedItem<ADDITIONAL_RESOLUTION>,
  parsingOptions: ParsingOptions = {}
): ParsedSchemaInput<ADDITIONAL_RESOLUTION> => {
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

  const parsedInput: ParsedSchemaInput<ADDITIONAL_RESOLUTION> = { [$savedAs]: {} }

  // Check that entries match filtered schema
  Object.entries(input).forEach(([attributeName, attributeInput]) => {
    const attribute = schema.attributes[attributeName]

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
  Object.entries(schema.attributes)
    .filter(
      ([attributeName, attribute]) =>
        parsedInput[attributeName] === undefined && doesAttributeMatchFilters(attribute, filters)
    )
    .forEach(([attributeName, attribute]) => {
      const parsedAttributeInput = parseAttributeClonedInput<ADDITIONAL_RESOLUTION>(
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
