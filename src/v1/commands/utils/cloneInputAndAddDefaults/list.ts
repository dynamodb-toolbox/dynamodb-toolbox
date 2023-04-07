import cloneDeep from 'lodash.clonedeep'

import {
  PossiblyUndefinedResolvedAttribute,
  ListAttribute,
  ComputedDefault,
  AttributeDefaultsComputer
} from 'v1'
import { isArray, isFunction, isObject } from 'v1/utils/validation'

import { cloneAttributeInputAndAddDefaults } from './attribute'
import { DefaultsComputeOptions } from './types'

export const cloneListAttributeInputAndAddDefaults = (
  listAttribute: ListAttribute,
  input: PossiblyUndefinedResolvedAttribute,
  { computeDefaults, contextInputs }: DefaultsComputeOptions
): PossiblyUndefinedResolvedAttribute => {
  if (input === undefined) {
    if (listAttribute.default === ComputedDefault) {
      if (isFunction(computeDefaults)) {
        return computeDefaults(...contextInputs)
      }

      if (
        isObject(computeDefaults) &&
        '_list' in computeDefaults &&
        isFunction(computeDefaults._list)
      ) {
        return computeDefaults._list(...contextInputs)
      }
    }

    return undefined
  }

  if (!isArray(input)) {
    return cloneDeep(input)
  }

  let elementsComputeDefaults: AttributeDefaultsComputer
  if (isObject(computeDefaults) && '_elements' in computeDefaults) {
    switch (listAttribute.elements.type) {
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

  return input.map((elementInput, elementIndex) =>
    cloneAttributeInputAndAddDefaults(listAttribute.elements, elementInput, {
      computeDefaults: elementsComputeDefaults,
      contextInputs: [elementIndex, ...contextInputs]
    })
  )
}
