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

import type { AttributeCloningOptions } from './types'
import { getCommandDefault, canComputeDefaults as _canComputeDefaults } from './utils'

export const clonePrimitiveAttributeInputAndAddDefaults = <EXTENSION extends Extension>(
  attribute: AnyAttribute | PrimitiveAttribute | SetAttribute,
  input: AttributeBasicValue<EXTENSION> | undefined,
  options: AttributeCloningOptions<EXTENSION> = {} as AttributeCloningOptions<EXTENSION>
): AttributeBasicValue<EXTENSION> | undefined => {
  const { commandName, computeDefaultsContext } = options
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

  return isFunction(commandDefault)
    ? (commandDefault() as AttributeBasicValue<EXTENSION>)
    : commandDefault
}
