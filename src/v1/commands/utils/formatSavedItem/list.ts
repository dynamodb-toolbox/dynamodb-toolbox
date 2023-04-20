import type { PossiblyUndefinedResolvedAttribute, ListAttribute } from 'v1/item'
import { isArray } from 'v1/utils/validation'

import { parseSavedAttribute } from './attribute'

export const parseSavedListAttribute = (
  listAttribute: ListAttribute,
  input: PossiblyUndefinedResolvedAttribute
): PossiblyUndefinedResolvedAttribute => {
  if (!isArray(input)) {
    // TODO
    throw new Error()
  }

  return input.map(elementInput => parseSavedAttribute(listAttribute.elements, elementInput))
}
