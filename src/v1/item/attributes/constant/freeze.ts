import isEqual from 'lodash.isequal'

import { isComputedDefault } from 'v1/item/utils/isComputedDefault'
import { isStaticDefault } from 'v1/item/utils/isStaticDefault'

import {
  $type,
  $value,
  $required,
  $hidden,
  $key,
  $savedAs,
  $default,
  AttributeOptionNameSymbol
} from '../constants/attributeOptions'
import { validateAttributeProperties } from '../shared/validate'
import { ResolvedAttribute } from '../types'

import {
  _ConstantAttribute,
  ConstantAttributeStateConstraint,
  ConstantAttribute
} from './interface'

export type FreezeConstantAttribute<
  _CONSTANT_ATTRIBUTE extends _ConstantAttribute
> = ConstantAttribute<
  _CONSTANT_ATTRIBUTE[$value],
  {
    [KEY in keyof ConstantAttributeStateConstraint]: _CONSTANT_ATTRIBUTE[AttributeOptionNameSymbol[KEY]]
  }
>

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
export const freezeConstantAttribute: ConstantAttributeFreezer = (_constantAttribute, path) => {
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
