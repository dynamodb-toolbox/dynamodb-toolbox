import cloneDeep from 'lodash.clonedeep'

import { PossiblyUndefinedResolvedAttribute, ListAttribute, ComputedDefault } from 'v1/schema'
import type { AttributeDefaultsComputer } from 'v1/entity'
import { isArray, isFunction, isObject } from 'v1/utils/validation'

import { cloneAttributeInputAndAddDefaults } from './attribute'
import type { ComputeDefaultsContext } from './types'
import { canComputeDefaults as _canComputeDefaults } from './utils'

export const cloneListAttributeInputAndAddDefaults = (
  listAttribute: ListAttribute,
  input: PossiblyUndefinedResolvedAttribute,
  computeDefaultsContext?: ComputeDefaultsContext
): PossiblyUndefinedResolvedAttribute => {
  const canComputeDefaults = _canComputeDefaults(computeDefaultsContext)

  if (input === undefined) {
    // TODO: Use defaults from get/update etc...
    if (listAttribute.defaults.put === ComputedDefault) {
      if (!canComputeDefaults) {
        return undefined
      }

      const { computeDefaults, contextInputs } = computeDefaultsContext

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

  if (!canComputeDefaults) {
    return input.map(elementInput =>
      cloneAttributeInputAndAddDefaults(listAttribute.elements, elementInput)
    )
  }

  const { computeDefaults, contextInputs } = computeDefaultsContext

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
