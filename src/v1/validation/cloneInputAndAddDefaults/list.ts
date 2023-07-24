import cloneDeep from 'lodash.clonedeep'

import type { AttributeDefaultsComputer } from 'v1/entity'
import type { AttributeValue, ListAttribute, Extension } from 'v1/schema'
import { ComputedDefault } from 'v1/schema/attributes/constants/computedDefault'
import { isArray, isFunction, isObject } from 'v1/utils/validation'

import type { CloneInputAndAddDefaultsOptions } from './types'
import { cloneAttributeInputAndAddDefaults } from './attribute'
import { getCommandDefault, canComputeDefaults as _canComputeDefaults } from './utils'

export const cloneListAttributeInputAndAddDefaults = <EXTENSION extends Extension>(
  listAttribute: ListAttribute,
  input: AttributeValue<EXTENSION>,
  { commandName, computeDefaultsContext }: CloneInputAndAddDefaultsOptions = {}
): AttributeValue<EXTENSION> => {
  const commandDefault = getCommandDefault(listAttribute, { commandName })
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
      cloneAttributeInputAndAddDefaults(listAttribute.elements, elementInput, { commandName })
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
      commandName,
      computeDefaultsContext: {
        computeDefaults: elementsComputeDefaults,
        contextInputs: [elementIndex, ...contextInputs]
      }
    })
  )
}
