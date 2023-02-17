import cloneDeep from 'lodash.clonedeep'

import {
  PossiblyUndefinedResolvedAttribute,
  RecordAttribute,
  ComputedDefault,
  AttributeDefaultsComputer
} from 'v1'
import { isObject, isFunction } from 'v1/utils/validation'

import { cloneAttributeInputAndAddDefaults } from './attribute'
import { DefaultsComputeOptions } from './types'

export const cloneRecordAttributeInputAndAddDefaults = (
  recordAttribute: RecordAttribute,
  input: PossiblyUndefinedResolvedAttribute,
  { computeDefaults, contextInputs }: DefaultsComputeOptions
): PossiblyUndefinedResolvedAttribute => {
  if (input === undefined) {
    if (recordAttribute.default === ComputedDefault) {
      if (!computeDefaults) {
        // TODO
        throw new Error()
      }

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
        computeDefaults: elementsComputeDefaults,
        contextInputs: [elementKey, ...contextInputs]
      })
    ])
  )
}
