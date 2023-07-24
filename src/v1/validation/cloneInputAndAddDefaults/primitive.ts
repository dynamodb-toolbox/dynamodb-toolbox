import cloneDeep from 'lodash.clonedeep'

import type {
  AnyAttribute,
  PrimitiveAttribute,
  SetAttribute,
  AttributeValue,
  Extension
} from 'v1/schema'
import { ComputedDefault } from 'v1/schema/attributes/constants/computedDefault'
import { isFunction } from 'v1/utils/validation'

import type { CloneInputAndAddDefaultsOptions } from './types'
import { getCommandDefault, canComputeDefaults as _canComputeDefaults } from './utils'

export const clonePrimitiveAttributeInputAndAddDefaults = <EXTENSION extends Extension>(
  attribute: AnyAttribute | PrimitiveAttribute | SetAttribute,
  input: AttributeValue<EXTENSION>,
  { commandName, computeDefaultsContext }: CloneInputAndAddDefaultsOptions = {}
): AttributeValue<EXTENSION> => {
  const commandDefault = getCommandDefault(attribute, { commandName })
  const canComputeDefaults = _canComputeDefaults(computeDefaultsContext)

  if (input !== undefined) {
    return cloneDeep(input)
  }

  if (commandDefault === ComputedDefault) {
    if (!canComputeDefaults) {
      return undefined
    }

    const { computeDefaults, contextInputs } = computeDefaultsContext

    if (!computeDefaults || !isFunction(computeDefaults)) {
      return undefined
    }

    return computeDefaults(...contextInputs)
  }

  return isFunction(commandDefault) ? commandDefault() : commandDefault
}
