import cloneDeep from 'lodash.clonedeep'

import { ResolvedAttribute, ListAttribute } from 'v1'
import { isArray } from 'v1/utils/validation'

import { parseSavedAttribute } from './attribute'

export const parseSavedListAttribute = (
  attribute: ListAttribute,
  input: ResolvedAttribute
): ResolvedAttribute => {
  if (!isArray(input)) {
    return cloneDeep(input)
  }

  return input.map(elementInput => parseSavedAttribute(attribute.elements, elementInput))
}
