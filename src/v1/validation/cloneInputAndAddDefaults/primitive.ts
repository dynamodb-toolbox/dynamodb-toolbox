import cloneDeep from 'lodash.clonedeep'

import {
  PossiblyUndefinedResolvedAttribute,
  ComputedDefault,
  AnyAttribute,
  PrimitiveAttribute,
  SetAttribute
} from 'v1/item'
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

  if (attribute.default === ComputedDefault) {
    if (!canComputeDefaults) {
      return undefined
    }

    const { computeDefaults, contextInputs } = computeDefaultsContext

    if (!computeDefaults || !isFunction(computeDefaults)) {
      return undefined
    }

    return computeDefaults(...contextInputs)
  }

  return isFunction(attribute.default) ? attribute.default() : attribute.default
}
