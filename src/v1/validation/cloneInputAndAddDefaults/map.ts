import cloneDeep from 'lodash.clonedeep'

import type {
  MapAttribute,
  AttributeValue,
  AttributeBasicValue,
  MapAttributeBasicValue,
  Extension
} from 'v1/schema'
import { ComputedDefault } from 'v1/schema/attributes/constants/computedDefault'
import { isObject, isFunction } from 'v1/utils/validation'

import type { AttributeOptions } from './types'
import { cloneAttributeInputAndAddDefaults } from './attribute'
import { getCommandDefault, canComputeDefaults as _canComputeDefaults } from './utils'

export const cloneMapAttributeInputAndAddDefaults = <EXTENSION extends Extension>(
  mapAttribute: MapAttribute,
  input: AttributeBasicValue<EXTENSION> | undefined,
  options: AttributeOptions<EXTENSION> = {} as AttributeOptions<EXTENSION>
): AttributeBasicValue<EXTENSION> | undefined => {
  const { commandName, computeDefaultsContext } = options
  const commandDefault = getCommandDefault(mapAttribute, { commandName })
  const canComputeDefaults = _canComputeDefaults(computeDefaultsContext)

  if (input === undefined) {
    if (commandDefault === ComputedDefault) {
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

  const inputWithDefaults: MapAttributeBasicValue<EXTENSION> = {}

  const additionalAttributes: Set<string> = new Set(Object.keys(input))

  Object.entries(mapAttribute.attributes).forEach(([attributeName, attribute]) => {
    let attributeInputWithDefaults: AttributeValue<EXTENSION> | undefined = undefined

    if (!canComputeDefaults) {
      attributeInputWithDefaults = cloneAttributeInputAndAddDefaults(
        attribute,
        input[attributeName],
        options
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
        {
          ...options,
          computeDefaultsContext: {
            computeDefaults: attributeComputeDefaults,
            contextInputs: [input, ...contextInputs]
          }
        }
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
