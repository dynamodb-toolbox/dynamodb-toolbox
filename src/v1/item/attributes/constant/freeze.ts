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
  $ConstantAttribute,
  ConstantAttributeStateConstraint,
  ConstantAttribute
} from './interface'

export type FreezeConstantAttribute<
  $CONSTANT_ATTRIBUTE extends $ConstantAttribute
> = ConstantAttribute<
  $CONSTANT_ATTRIBUTE[$value],
  {
    [KEY in keyof ConstantAttributeStateConstraint]: $CONSTANT_ATTRIBUTE[AttributeOptionNameSymbol[KEY]]
  }
>

type ConstantAttributeFreezer = <$CONSTANT_ATTRIBUTE extends $ConstantAttribute>(
  $constantAttribute: $CONSTANT_ATTRIBUTE,
  path: string
) => FreezeConstantAttribute<$CONSTANT_ATTRIBUTE>

/**
 * Validates a constant instance
 *
 * @param $constantAttribute Primitive
 * @param path _(optional)_ Path of the instance in the related item (string)
 * @return void
 */
export const freezeConstantAttribute: ConstantAttributeFreezer = ($constantAttribute, path) => {
  validateAttributeProperties($constantAttribute, path)

  const constValue = $constantAttribute[$value]
  const defaultValue = $constantAttribute[$default]
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
    type: $constantAttribute[$type],
    value: constValue,
    required: $constantAttribute[$required],
    hidden: $constantAttribute[$hidden],
    key: $constantAttribute[$key],
    savedAs: $constantAttribute[$savedAs],
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
