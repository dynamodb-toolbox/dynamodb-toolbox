import type { PossiblyUndefinedResolvedAttribute, ListAttribute } from 'v1/item'
import { isArray } from 'v1/utils/validation'
import { DynamoDBToolboxError } from 'v1/errors'

import { parseSavedAttribute } from './attribute'

export const parseSavedListAttribute = (
  listAttribute: ListAttribute,
  value: PossiblyUndefinedResolvedAttribute
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

  return value.map(elementInput => parseSavedAttribute(listAttribute.elements, elementInput))
}
