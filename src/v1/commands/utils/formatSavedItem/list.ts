import type { PossiblyUndefinedResolvedAttribute, ListAttribute } from 'v1/schema'
import { isArray } from 'v1/utils/validation'
import { DynamoDBToolboxError } from 'v1/errors'

import type { FormatSavedAttributeOptions } from './types'
import { parseSavedAttribute } from './attribute'
import { matchProjection } from './utils'

export const parseSavedListAttribute = (
  listAttribute: ListAttribute,
  value: PossiblyUndefinedResolvedAttribute,
  { projectedAttributes }: FormatSavedAttributeOptions
): PossiblyUndefinedResolvedAttribute => {
  if (!isArray(value)) {
    throw new DynamoDBToolboxError('commands.formatSavedItem.invalidSavedAttribute', {
      message: `Invalid attribute in saved item: ${listAttribute.path}. Should be a ${listAttribute.type}`,
      path: listAttribute.path,
      payload: {
        received: value,
        expected: listAttribute.type
      }
    })
  }

  // We don't need isProjected:
  // - Either whole list is projected and we already know => projectedAttributes undefined
  // - Either some elements are projected => childrenAttributes undefined
  // - Either projection is nested => childrenAttributes defined
  const { childrenAttributes } = matchProjection(/\[\d+\]/, projectedAttributes)

  const parsedValues: PossiblyUndefinedResolvedAttribute = []
  for (const valueElement of value) {
    parsedValues.push(
      parseSavedAttribute(listAttribute.elements, valueElement, {
        projectedAttributes: childrenAttributes
      })
    )
  }

  return parsedValues
}
