import isEqual from 'lodash.isequal'

import { isComputedDefault } from 'v1/item/utils/isComputedDefault'
import { isStaticDefault } from 'v1/item/utils/isStaticDefault'

import { $type, $value, $required, $hidden, $key, $savedAs, $default } from '../constants/symbols'
import { validateAttributeProperties } from '../shared/validate'
import { ResolvedAttribute } from '../types'

import type { _ConstantAttribute, FreezeConstantAttribute } from './interface'

type ConstantAttributeFreezer = <_CONSTANT_ATTRIBUTE extends _ConstantAttribute>(
  _constantAttribute: _CONSTANT_ATTRIBUTE,
  path: string
) => FreezeConstantAttribute<_CONSTANT_ATTRIBUTE>

/**
 * Validates a constant instance
 *
 * @param _constantAttribute Primitive
 * @param path _(optional)_ Path of the instance in the related item (string)
 * @return void
 */
export const freezeConstantAttribute: ConstantAttributeFreezer = <
  _CONSTANT_ATTRIBUTE extends _ConstantAttribute
>(
  _constantAttribute: _CONSTANT_ATTRIBUTE,
  path: string
): FreezeConstantAttribute<_CONSTANT_ATTRIBUTE> => {
  validateAttributeProperties(_constantAttribute, path)

  const constValue = _constantAttribute[$value]
  const defaultValue = _constantAttribute[$default]
  if (
    defaultValue !== undefined &&
    !isComputedDefault(defaultValue) &&
    isStaticDefault(defaultValue)
  ) {
    if (!isEqual(constValue, defaultValue)) {
      throw new InvalidDefaultValueError({ constValue, defaultValue, path })
    }
  }

  return {
    path,
    type: _constantAttribute[$type],
    value: constValue,
    required: _constantAttribute[$required],
    hidden: _constantAttribute[$hidden],
    key: _constantAttribute[$key],
    savedAs: _constantAttribute[$savedAs],
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
