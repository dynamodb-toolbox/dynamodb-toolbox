import cloneDeep from 'lodash.clonedeep'

import {
  PossiblyUndefinedResolvedAttribute,
  ComputedDefault,
  AnyAttribute,
  ConstantAttribute,
  PrimitiveAttribute,
  SetAttribute
} from 'v1'
import { isFunction } from 'v1/utils/validation'

import { DefaultsComputeOptions } from './types'

export const clonePrimitiveAttributeInputAndAddDefaults = (
  attribute: AnyAttribute | ConstantAttribute | PrimitiveAttribute | SetAttribute,
  input: PossiblyUndefinedResolvedAttribute,
  { computeDefaults, contextInputs }: DefaultsComputeOptions
): PossiblyUndefinedResolvedAttribute => {
  if (input !== undefined) {
    return cloneDeep(input)
  }

  if (attribute.default === ComputedDefault) {
    if (!computeDefaults || !isFunction(computeDefaults)) {
      // TODO
      throw new Error()
    }

    return computeDefaults(...contextInputs)
  }

  return isFunction(attribute.default) ? attribute.default() : attribute.default
}
