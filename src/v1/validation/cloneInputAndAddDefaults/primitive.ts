import cloneDeep from 'lodash.clonedeep'

import type {
  AnyAttribute,
  PrimitiveAttribute,
  SetAttribute,
  ResolvedAttribute,
  AdditionalResolution
} from 'v1/schema'
import { ComputedDefault } from 'v1/schema/attributes/constants/computedDefault'
import { isFunction } from 'v1/utils/validation'

import type { CloneInputAndAddDefaultsOptions } from './types'
import { getCommandDefault, canComputeDefaults as _canComputeDefaults } from './utils'

export const clonePrimitiveAttributeInputAndAddDefaults = <
  ADDITIONAL_RESOLUTION extends AdditionalResolution
>(
  attribute: AnyAttribute | PrimitiveAttribute | SetAttribute,
  input: ResolvedAttribute<ADDITIONAL_RESOLUTION>,
  { commandName, computeDefaultsContext }: CloneInputAndAddDefaultsOptions = {}
): ResolvedAttribute<ADDITIONAL_RESOLUTION> => {
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
