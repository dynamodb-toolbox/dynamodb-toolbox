import cloneDeep from 'lodash.clonedeep'

import {
  PossiblyUndefinedResolvedAttribute,
  PrimitiveAttribute,
  ComputedDefault,
  AnyAttribute
} from 'v1'

import { isFunction } from 'v1/utils/validation'

export const addPrimitiveInitialDefault = (
  attribute: PrimitiveAttribute | AnyAttribute,
  putItemInput: PossiblyUndefinedResolvedAttribute
): PossiblyUndefinedResolvedAttribute => {
  if (putItemInput !== undefined) {
    // small risk to mute non valid input (like objects or arrays)
    return cloneDeep(putItemInput)
  }

  if (attribute.default === undefined || attribute.default === ComputedDefault) {
    return undefined
  }

  return isFunction(attribute.default) ? attribute.default() : attribute.default
}
