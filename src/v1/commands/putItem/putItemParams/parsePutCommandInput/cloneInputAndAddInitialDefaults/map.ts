import cloneDeep from 'lodash.clonedeep'

import {
  MapAttribute,
  PossiblyUndefinedResolvedAttribute,
  PossiblyUndefinedResolvedMapAttribute
} from 'v1'
import { isObject } from 'v1/utils/validation'

import { cloneAttributeInputAndAddInitialDefaults } from './attribute'

export const cloneMapAttributeInputAndAddInitialDefaults = (
  mapAttribute: MapAttribute,
  input: PossiblyUndefinedResolvedAttribute
): PossiblyUndefinedResolvedAttribute => {
  if (input === undefined) {
    return undefined
  }

  if (!isObject(input)) {
    return cloneDeep(input)
  }

  const putItemInputWithInitialDefaults: PossiblyUndefinedResolvedMapAttribute = {}

  const additionalAttributes: Set<string> = new Set(Object.keys(input))

  Object.entries(mapAttribute.attributes).forEach(([attributeName, attribute]) => {
    putItemInputWithInitialDefaults[attributeName] = cloneAttributeInputAndAddInitialDefaults(
      attribute,
      input[attributeName]
    )

    additionalAttributes.delete(attributeName)
  })

  additionalAttributes.forEach(attributeName => {
    putItemInputWithInitialDefaults[attributeName] = cloneDeep(input[attributeName])
  })

  return putItemInputWithInitialDefaults
}
