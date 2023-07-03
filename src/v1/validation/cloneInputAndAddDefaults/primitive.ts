import cloneDeep from 'lodash.clonedeep'

import {
  PossiblyUndefinedResolvedAttribute,
  ComputedDefault,
  AnyAttribute,
  PrimitiveAttribute,
  SetAttribute
} from 'v1/schema'
import { isFunction } from 'v1/utils/validation'

import { ComputeDefaultsContext } from './types'
import { canComputeDefaults as _canComputeDefaults } from './utils'

export const clonePrimitiveAttributeInputAndAddDefaults = (
  attribute: AnyAttribute | PrimitiveAttribute | SetAttribute,
  input: PossiblyUndefinedResolvedAttribute,
  computeDefaultsContext?: ComputeDefaultsContext
): PossiblyUndefinedResolvedAttribute => {
  const canComputeDefaults = _canComputeDefaults(computeDefaultsContext)

  if (input !== undefined) {
    return cloneDeep(input)
  }

  // TODO: Use defaults from get/update etc...
  if (attribute.defaults.put === ComputedDefault) {
    if (!canComputeDefaults) {
      return undefined
    }

    const { computeDefaults, contextInputs } = computeDefaultsContext

    if (!computeDefaults || !isFunction(computeDefaults)) {
      return undefined
    }

    return computeDefaults(...contextInputs)
  }

  // TODO: Use defaults from get/update etc...
  return isFunction(attribute.defaults.put) ? attribute.defaults.put() : attribute.defaults.put
}
