import cloneDeep from 'lodash.clonedeep'

import { PossiblyUndefinedResolvedAttribute, ListAttribute } from 'v1'
import { isArray } from 'v1/utils/validation'

import { cloneAttributeInputAndAddInitialDefaults } from './attribute'

export const cloneListAttributeInputAndAddInitialDefaults = (
  attribute: ListAttribute,
  input: PossiblyUndefinedResolvedAttribute
): PossiblyUndefinedResolvedAttribute => {
  if (input === undefined) {
    return undefined
  }

  if (!isArray(input)) {
    return cloneDeep(input)
  }

  return input.map(elementInput =>
    cloneAttributeInputAndAddInitialDefaults(attribute.elements, elementInput)
  )
}
