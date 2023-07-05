import cloneDeep from 'lodash.clonedeep'

import type {
  PossiblyUndefinedResolvedAttribute,
  RecordAttribute,
  AttributeDefaultsComputer
} from 'v1'
import { ComputedDefault } from 'v1/schema/attributes/constants/computedDefault'
import { isObject, isFunction } from 'v1/utils/validation'

import type { CloneInputAndAddDefaultsOptions } from './types'
import { cloneAttributeInputAndAddDefaults } from './attribute'
import { canComputeDefaults as _canComputeDefaults } from './utils'

export const cloneRecordAttributeInputAndAddDefaults = (
  recordAttribute: RecordAttribute,
  input: PossiblyUndefinedResolvedAttribute,
  { commandName, computeDefaultsContext }: CloneInputAndAddDefaultsOptions = {}
): PossiblyUndefinedResolvedAttribute => {
  const commandDefault = commandName && recordAttribute.defaults[commandName]
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
        cloneAttributeInputAndAddDefaults(recordAttribute.elements, elementInput, { commandName })
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
        commandName,
        computeDefaultsContext: {
          computeDefaults: elementsComputeDefaults,
          contextInputs: [elementKey, ...contextInputs]
        }
      })
    ])
  )
}
