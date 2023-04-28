import type { Item, PossiblyUndefinedResolvedItem } from 'v1/item'
import { isObject } from 'v1/utils/validation'
import { DynamoDBToolboxError } from 'v1/errors'

import { parseAttributeClonedInput } from './attribute'
import { doesAttributeMatchFilters } from './doesAttributeMatchFilter'
import type { ParsingOptions } from './types'

// TODO: Factorize with map
export const parseItemClonedInput = (
  item: Item,
  input: PossiblyUndefinedResolvedItem,
  parsingOptions: ParsingOptions
): PossiblyUndefinedResolvedItem => {
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

  const parsedInput: PossiblyUndefinedResolvedItem = {}

  // Check that entries match filtered schema
  Object.entries(input).forEach(([attributeName, attributeInput]) => {
    const attribute = item.attributes[attributeName]

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
  Object.entries(item.attributes)
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
