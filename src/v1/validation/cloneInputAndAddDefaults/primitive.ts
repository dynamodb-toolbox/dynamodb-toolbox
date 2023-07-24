import cloneDeep from 'lodash.clonedeep'

import type {
  AnyAttribute,
  PrimitiveAttribute,
  SetAttribute,
  AttributeBasicValue,
  Extension
} from 'v1/schema'
import { ComputedDefault } from 'v1/schema/attributes/constants/computedDefault'
import { isFunction } from 'v1/utils/validation'

import type { CloneInputAndAddDefaultsOptions } from './types'
import { getCommandDefault, canComputeDefaults as _canComputeDefaults } from './utils'

export const clonePrimitiveAttributeInputAndAddDefaults = <EXTENSION extends Extension>(
  attribute: AnyAttribute | PrimitiveAttribute | SetAttribute,
  input: AttributeBasicValue<EXTENSION> | undefined,
  { commandName, computeDefaultsContext }: CloneInputAndAddDefaultsOptions = {}
): AttributeBasicValue<EXTENSION> | undefined => {
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
