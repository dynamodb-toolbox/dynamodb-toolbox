import cloneDeep from 'lodash.clonedeep'

import {
  MapAttribute,
  PossiblyUndefinedResolvedAttribute,
  PossiblyUndefinedResolvedMapAttribute,
  ComputedDefault
} from 'v1/item'
import { isObject, isFunction } from 'v1/utils/validation'

import { cloneAttributeInputAndAddDefaults } from './attribute'
import { ComputeDefaultsContext } from './types'
import { canComputeDefaults as _canComputeDefaults } from './utils'

export const cloneMapAttributeInputAndAddDefaults = (
  mapAttribute: MapAttribute,
  input: PossiblyUndefinedResolvedAttribute,
  computeDefaultsContext?: ComputeDefaultsContext
): PossiblyUndefinedResolvedAttribute => {
  const canComputeDefaults = _canComputeDefaults(computeDefaultsContext)

  if (input === undefined) {
    if (mapAttribute.default === ComputedDefault) {
      if (!canComputeDefaults) {
        return undefined
      }

      const { computeDefaults, contextInputs } = computeDefaultsContext

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
    let attributeInputWithDefaults: PossiblyUndefinedResolvedAttribute = undefined

    if (!canComputeDefaults) {
      attributeInputWithDefaults = cloneAttributeInputAndAddDefaults(
        attribute,
        input[attributeName]
      )
    } else {
      const { computeDefaults, contextInputs } = computeDefaultsContext

      const attributeComputeDefaults =
        isObject(computeDefaults) && '_attributes' in computeDefaults
          ? computeDefaults._attributes[attributeName]
          : undefined

      attributeInputWithDefaults = cloneAttributeInputAndAddDefaults(
        attribute,
        input[attributeName],
        { computeDefaults: attributeComputeDefaults, contextInputs: [input, ...contextInputs] }
      )
    }

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