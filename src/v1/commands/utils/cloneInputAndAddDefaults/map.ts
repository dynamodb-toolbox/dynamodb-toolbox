import cloneDeep from 'lodash.clonedeep'

import {
  MapAttribute,
  PossiblyUndefinedResolvedAttribute,
  PossiblyUndefinedResolvedMapAttribute,
  ComputedDefault
} from 'v1'
import { isObject, isFunction } from 'v1/utils/validation'

import { cloneAttributeInputAndAddDefaults } from './attribute'
import { DefaultsComputeOptions } from './types'

export const cloneMapAttributeInputAndAddDefaults = (
  mapAttribute: MapAttribute,
  input: PossiblyUndefinedResolvedAttribute,
  { computeDefaults, contextInputs }: DefaultsComputeOptions
): PossiblyUndefinedResolvedAttribute => {
  if (input === undefined) {
    if (mapAttribute.default === ComputedDefault) {
      if (isFunction(computeDefaults)) {
        return computeDefaults(...contextInputs)
      }

      if (
        isObject(computeDefaults) &&
        '_map' in computeDefaults &&
        isFunction(computeDefaults._map)
      ) {
        return computeDefaults._map(...contextInputs)
      }
    }

    return undefined
  }

  if (!isObject(input)) {
    return cloneDeep(input)
  }

  const inputWithDefaults: PossiblyUndefinedResolvedMapAttribute = {}

  const additionalAttributes: Set<string> = new Set(Object.keys(input))

  Object.entries(mapAttribute.attributes).forEach(([attributeName, attribute]) => {
    const attributeComputeDefaults =
      isObject(computeDefaults) && '_attributes' in computeDefaults
        ? computeDefaults._attributes[attributeName]
        : undefined

    const attributeInputWithDefaults = cloneAttributeInputAndAddDefaults(
      attribute,
      input[attributeName],
      { computeDefaults: attributeComputeDefaults, contextInputs: [input, ...contextInputs] }
    )

    if (attributeInputWithDefaults !== undefined) {
      inputWithDefaults[attributeName] = attributeInputWithDefaults
    }

    additionalAttributes.delete(attributeName)
  })

  additionalAttributes.forEach(attributeName => {
    inputWithDefaults[attributeName] = cloneDeep(input[attributeName])
  })

  return inputWithDefaults
}
