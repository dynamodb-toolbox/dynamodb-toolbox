import cloneDeep from 'lodash.clonedeep'

import type { AttributeBasicValue, RecordAttribute, AttributeDefaultsComputer, Extension } from 'v1'
import { ComputedDefault } from 'v1/schema/attributes/constants/computedDefault'
import { isObject, isFunction } from 'v1/utils/validation'

import type { AttributeOptions } from './types'
import { cloneAttributeInputAndAddDefaults } from './attribute'
import { getCommandDefault, canComputeDefaults as _canComputeDefaults } from './utils'

export const cloneRecordAttributeInputAndAddDefaults = <EXTENSION extends Extension>(
  recordAttribute: RecordAttribute,
  input: AttributeBasicValue<EXTENSION> | undefined,
  options: AttributeOptions<EXTENSION> = {} as AttributeOptions<EXTENSION>
): AttributeBasicValue<EXTENSION> | undefined => {
  const { commandName, computeDefaultsContext } = options
  const commandDefault = getCommandDefault(recordAttribute, { commandName })
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
        '_record' in computeDefaults &&
        isFunction(computeDefaults._record)
      ) {
        return computeDefaults._record(...contextInputs)
      }
    }

    return undefined
  }

  if (!isObject(input)) {
    return cloneDeep(input)
  }

  if (!canComputeDefaults) {
    return Object.fromEntries(
      Object.entries(input).map(([elementKey, elementInput]) => [
        elementKey,
        cloneAttributeInputAndAddDefaults(recordAttribute.elements, elementInput, options)
      ])
    )
  }

  const { computeDefaults, contextInputs } = computeDefaultsContext

  let elementsComputeDefaults: AttributeDefaultsComputer
  if (isObject(computeDefaults) && '_elements' in computeDefaults) {
    switch (recordAttribute.elements.type) {
      case 'map':
        elementsComputeDefaults = {
          _attributes: computeDefaults._elements as Record<string, AttributeDefaultsComputer>
        }
        break
      case 'record':
      case 'list':
        elementsComputeDefaults = { _elements: computeDefaults._elements }
        break
      default:
    }
  }

  return Object.fromEntries(
    Object.entries(input).map(([elementKey, elementInput]) => [
      elementKey,
      cloneAttributeInputAndAddDefaults(recordAttribute.elements, elementInput, {
        ...options,
        computeDefaultsContext: {
          computeDefaults: elementsComputeDefaults,
          contextInputs: [elementKey, ...contextInputs]
        }
      })
    ])
  )
}
