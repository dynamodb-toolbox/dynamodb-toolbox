import { ResolvedAttribute, ListAttribute } from 'v1'
import { isArray } from 'v1/utils/validation'

import { parseSavedAttribute } from './attribute'

export const parseSavedListAttribute = (
  attribute: ListAttribute,
  input: ResolvedAttribute
): ResolvedAttribute => {
  if (!isArray(input)) {
    // TODO
    throw new Error()
  }

  return input.map(elementInput => parseSavedAttribute(attribute.elements, elementInput))
}
