import type { ListAttribute, AttributeValue, ListAttributeValue } from 'v1/schema'
import { isArray } from 'v1/utils/validation'
import { DynamoDBToolboxError } from 'v1/errors'

import type { FormatSavedAttributeOptions } from './types'
import { formatSavedAttribute } from './attribute'
import { matchProjection, getItemKey } from './utils'

export const formatSavedListAttribute = (
  listAttribute: ListAttribute,
  savedValue: AttributeValue,
  { projectedAttributes, ...restOptions }: FormatSavedAttributeOptions = {}
): ListAttributeValue => {
  if (!isArray(savedValue)) {
    const { partitionKey, sortKey } = restOptions

    throw new DynamoDBToolboxError('operations.formatSavedItem.invalidSavedAttribute', {
      message: [
        `Invalid attribute in saved item: ${listAttribute.path}. Should be a ${listAttribute.type}.`,
        getItemKey({ partitionKey, sortKey })
      ]
        .filter(Boolean)
        .join(' '),
      path: listAttribute.path,
      payload: {
        received: savedValue,
        expected: listAttribute.type,
        partitionKey,
        sortKey
      }
    })
  }

  // We don't need isProjected:
  // - Either whole list is projected and we already know => projectedAttributes undefined
  // - Either some elements are projected => childrenAttributes undefined
  // - Either projection is nested => childrenAttributes defined
  const { childrenAttributes } = matchProjection(/\[\d+\]/, projectedAttributes)

  const parsedValues: ListAttributeValue = []
  for (const savedElement of savedValue) {
    const parsedElement = formatSavedAttribute(listAttribute.elements, savedElement, {
      projectedAttributes: childrenAttributes,
      ...restOptions
    })

    if (parsedElement !== undefined) {
      parsedValues.push(parsedElement)
    }
  }

  return parsedValues
}
