import cloneDeep from 'lodash.clonedeep'

import type {
  PossiblyUndefinedResolvedAttribute,
  AnyAttribute,
  PrimitiveAttribute,
  SetAttribute
} from 'v1/schema'
import { ComputedDefault } from 'v1/schema/attributes/constants/computedDefault'
import { isFunction } from 'v1/utils/validation'

import type { CloneInputAndAddDefaultsOptions } from './types'
import { canComputeDefaults as _canComputeDefaults } from './utils'

export const clonePrimitiveAttributeInputAndAddDefaults = (
  attribute: AnyAttribute | PrimitiveAttribute | SetAttribute,
  input: PossiblyUndefinedResolvedAttribute,
  { commandName, computeDefaultsContext }: CloneInputAndAddDefaultsOptions = {}
): PossiblyUndefinedResolvedAttribute => {
  const commandDefault = commandName && attribute.defaults[commandName]
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
