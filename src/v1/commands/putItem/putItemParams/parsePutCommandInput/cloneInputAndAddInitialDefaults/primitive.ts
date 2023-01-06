import cloneDeep from 'lodash.clonedeep'

import {
  PossiblyUndefinedResolvedAttribute,
  PrimitiveAttribute,
  ComputedDefault,
  AnyAttribute
} from 'v1'
import { isFunction } from 'v1/utils/validation'

export const clonePrimitiveAttributeInputAndAddInitialDefaults = (
  attribute: PrimitiveAttribute | AnyAttribute,
  input: PossiblyUndefinedResolvedAttribute
): PossiblyUndefinedResolvedAttribute => {
  if (input !== undefined) {
    return cloneDeep(input)
  }

  if (attribute.default === undefined || attribute.default === ComputedDefault) {
    return undefined
  }

  return isFunction(attribute.default) ? attribute.default() : attribute.default
}
