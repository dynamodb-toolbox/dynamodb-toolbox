import type { MapAttribute, AttributeBasicValue, Extension, Transformer } from 'v1/schema'
import { isPrimitiveAttribute } from 'v1/schema/utils/isPrimitiveAttribute'
import { $savedAs, $transform } from 'v1/schema/attributes/constants/attributeOptions'
import { DynamoDBToolboxError } from 'v1/errors'
import { isObject } from 'v1/utils/validation/isObject'

import type { MapAttributeParsedBasicValue } from '../types'
import type { ParsingOptions } from './types'
import { parseAttributeClonedInput } from './attribute'
import { doesAttributeMatchFilters } from './doesAttributeMatchFilter'

export const parseMapAttributeClonedInput = <EXTENSION extends Extension>(
  mapAttribute: MapAttribute,
  input: AttributeBasicValue<EXTENSION>,
  parsingOptions: ParsingOptions<EXTENSION> = {} as ParsingOptions<EXTENSION>
): MapAttributeParsedBasicValue<EXTENSION> => {
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

  // NOTE: We need to keep $savedAs to distinguish maps from records at transform time
  const parsedInput: MapAttributeParsedBasicValue<EXTENSION> = { [$savedAs]: {} }

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
          if (parsedInput[$savedAs] === undefined) {
            parsedInput[$savedAs] = { [attributeName]: attribute.savedAs }
          } else {
            parsedInput[$savedAs][attributeName] = attribute.savedAs
          }
        }

        if (isPrimitiveAttribute(attribute) && attribute.transform !== undefined) {
          if (parsedInput[$transform] === undefined) {
            parsedInput[$transform] = { [attributeName]: attribute.transform as Transformer }
          } else {
            parsedInput[$transform][attributeName] = attribute.transform as Transformer
          }
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
          if (parsedInput[$savedAs] === undefined) {
            parsedInput[$savedAs] = { [attributeName]: attribute.savedAs }
          } else {
            parsedInput[$savedAs][attributeName] = attribute.savedAs
          }
        }

        if (isPrimitiveAttribute(attribute) && attribute.transform !== undefined) {
          if (parsedInput[$transform] === undefined) {
            parsedInput[$transform] = { [attributeName]: attribute.transform as Transformer }
          } else {
            parsedInput[$transform][attributeName] = attribute.transform as Transformer
          }
        }
      }
    })

  return parsedInput
}
