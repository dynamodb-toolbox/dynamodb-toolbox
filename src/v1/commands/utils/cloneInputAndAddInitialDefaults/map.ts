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

  const inputWithInitialDefaults: PossiblyUndefinedResolvedMapAttribute = {}

  const additionalAttributes: Set<string> = new Set(Object.keys(input))

  Object.entries(mapAttribute.attributes).forEach(([attributeName, attribute]) => {
    inputWithInitialDefaults[attributeName] = cloneAttributeInputAndAddInitialDefaults(
      attribute,
      input[attributeName]
    )

    additionalAttributes.delete(attributeName)
  })

  additionalAttributes.forEach(attributeName => {
    inputWithInitialDefaults[attributeName] = cloneDeep(input[attributeName])
  })

  return inputWithInitialDefaults
}
