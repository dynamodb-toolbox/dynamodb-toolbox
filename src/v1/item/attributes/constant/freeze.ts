import isEqual from 'lodash.isequal'

import { isComputedDefault } from 'v1/item/utils/isComputedDefault'
import { isStaticDefault } from 'v1/item/utils/isStaticDefault'

import { validateAttributeProperties } from '../shared/validate'
import { ResolvedAttribute } from '../types'

import type { _ConstantAttribute, FreezeConstantAttribute } from './interface'

type ConstantAttributeFreezer = <_CONSTANT_ATTRIBUTE extends _ConstantAttribute>(
  attribute: _CONSTANT_ATTRIBUTE,
  path: string
) => FreezeConstantAttribute<_CONSTANT_ATTRIBUTE>

/**
 * Validates a constant instance
 *
 * @param attribute Primitive
 * @param path _(optional)_ Path of the instance in the related item (string)
 * @return void
 */
export const freezeConstantAttribute: ConstantAttributeFreezer = <
  _CONSTANT_ATTRIBUTE extends _ConstantAttribute
>(
  attribute: _CONSTANT_ATTRIBUTE,
  path: string
): FreezeConstantAttribute<_CONSTANT_ATTRIBUTE> => {
  validateAttributeProperties(attribute, path)

  const {
    _type: constType,
    _value: constValue,
    _default: defaultValue,
    ...constInstance
  } = attribute

  if (
    defaultValue !== undefined &&
    !isComputedDefault(defaultValue) &&
    isStaticDefault(defaultValue)
  ) {
    if (!isEqual(constValue, defaultValue)) {
      throw new InvalidDefaultValueError({ constValue, defaultValue, path })
    }
  }

  const { _required: required, _hidden: hidden, _key: key, _savedAs: savedAs } = constInstance

  return {
    type: constType,
    value: constValue,
    path,
    required,
    hidden,
    key,
    savedAs,
    default: defaultValue
  }
}

export class InvalidDefaultValueError extends Error {
  constructor({
    constValue,
    defaultValue,
    path
  }: {
    constValue: ResolvedAttribute
    defaultValue: ResolvedAttribute
    path: string
  }) {
    super(
      `Invalid default value at path ${path}: Expected: ${String(constValue)}. Received: ${String(
        defaultValue
      )}.`
    )
  }
}
