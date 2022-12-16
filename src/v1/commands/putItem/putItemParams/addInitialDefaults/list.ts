import cloneDeep from 'lodash.clonedeep'

import { PossiblyUndefinedResolvedAttribute, ListAttribute } from 'v1'
import { isArray } from 'v1/utils/validation'

import { addAttributeInitialDefaults } from './attribute'

export const addListInitialDefaults = (
  attribute: ListAttribute,
  putItemInput: PossiblyUndefinedResolvedAttribute
): PossiblyUndefinedResolvedAttribute => {
  if (putItemInput === undefined) {
    return undefined
  }

  if (!isArray(putItemInput)) {
    return cloneDeep(putItemInput)
  }

  return putItemInput.map(elementInput =>
    addAttributeInitialDefaults(attribute.elements, elementInput)
  )
}
