import type { MapAttribute, PossiblyUndefinedResolvedAttribute } from 'v1'
import { isObject } from 'v1/utils/validation'
import { DynamoDBToolboxError } from 'v1/errors'

import { parseAttributeClonedInput } from './attribute'
import { doesAttributeMatchFilters } from './doesAttributeMatchFilter'
import type { ParsingOptions } from './types'

export const parseMapAttributeClonedInput = (
  mapAttribute: MapAttribute,
  input: PossiblyUndefinedResolvedAttribute,
  parsingOptions: ParsingOptions = {}
): PossiblyUndefinedResolvedAttribute => {
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

  const parsedInput: PossiblyUndefinedResolvedAttribute = {}

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
      }
    }
  })

  // Check that rest of filtered schema attributes are matched by input
  Object.entries(mapAttribute.attributes)
    .filter(
      ([attributeName, attribute]) =>
        doesAttributeMatchFilters(attribute, filters) && parsedInput[attributeName] === undefined
    )
    .forEach(([attributeName, attribute]) => {
      const parsedAttributeInput = parseAttributeClonedInput(attribute, undefined, parsingOptions)

      if (parsedAttributeInput !== undefined) {
        parsedInput[attributeName] = parsedAttributeInput
      }
    })

  return parsedInput
}
