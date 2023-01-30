import { isComputedDefault } from 'v1/item/utils/isComputedDefault'
import { isStaticDefault } from 'v1/item/utils/isStaticDefault'
import { validatorsByPrimitiveType } from 'v1/utils/validation'

import { validateAttributeProperties } from '../shared/validate'
import {
  $type,
  $required,
  $hidden,
  $key,
  $savedAs,
  $enum,
  $default,
  AttributeOptionNameSymbol
} from '../constants/attributeOptions'

import {
  _PrimitiveAttribute,
  PrimitiveAttribute,
  PrimitiveAttributeStateConstraint
} from './interface'
import type {
  PrimitiveAttributeType,
  PrimitiveAttributeEnumValues,
  PrimitiveAttributeDefaultValue
} from './types'

export type FreezePrimitiveAttribute<
  _PRIMITIVE_ATTRIBUTE extends _PrimitiveAttribute
> = PrimitiveAttribute<
  {
    [KEY in keyof PrimitiveAttributeStateConstraint]: _PRIMITIVE_ATTRIBUTE[AttributeOptionNameSymbol[KEY]]
  }
>

type PrimitiveAttributeFreezer = <_PRIMITIVE_ATTRIBUTE extends _PrimitiveAttribute>(
  _primitiveAttribute: _PRIMITIVE_ATTRIBUTE,
  path: string
) => FreezePrimitiveAttribute<_PRIMITIVE_ATTRIBUTE>

/**
 * Validates a primitive instance
 *
 * @param _primitiveAttribute Primitive
 * @param path _(optional)_ Path of the instance in the related item (string)
 * @return void
 */
export const freezePrimitiveAttribute: PrimitiveAttributeFreezer = <
  _PRIMITIVE_ATTRIBUTE extends _PrimitiveAttribute
>(
  _primitiveAttribute: _PRIMITIVE_ATTRIBUTE,
  path: string
) => {
  validateAttributeProperties(_primitiveAttribute, path)

  const primitiveType = _primitiveAttribute[$type]
  const typeValidator = validatorsByPrimitiveType[primitiveType]

  const enumValues = _primitiveAttribute[$enum]
  enumValues?.forEach(enumValue => {
    const isEnumValueValid = typeValidator(enumValue)
    if (!isEnumValueValid) {
      throw new InvalidEnumValueTypeError({ expectedType: primitiveType, enumValue, path })
    }
  })

  const defaultValue = _primitiveAttribute[$default]
  if (
    defaultValue !== undefined &&
    !isComputedDefault(defaultValue) &&
    isStaticDefault(defaultValue)
  ) {
    if (!typeValidator(defaultValue)) {
      throw new InvalidDefaultValueTypeError({ expectedType: primitiveType, defaultValue, path })
    }

    if (enumValues !== undefined && !enumValues.some(enumValue => enumValue === defaultValue)) {
      throw new InvalidDefaultValueRangeError({ enumValues, defaultValue, path })
    }
  }

  return {
    path,
    type: primitiveType,
    required: _primitiveAttribute[$required],
    hidden: _primitiveAttribute[$hidden],
    key: _primitiveAttribute[$key],
    savedAs: _primitiveAttribute[$savedAs],
    enum: enumValues as Extract<
      _PRIMITIVE_ATTRIBUTE[$enum],
      PrimitiveAttributeEnumValues<_PRIMITIVE_ATTRIBUTE[$type]>
    >,
    default: defaultValue as Extract<
      _PRIMITIVE_ATTRIBUTE[$default],
      PrimitiveAttributeDefaultValue<_PRIMITIVE_ATTRIBUTE[$type]>
    >
  }
}

export class InvalidEnumValueTypeError extends Error {
  constructor({
    expectedType,
    enumValue,
    path
  }: {
    expectedType: PrimitiveAttributeType
    enumValue: NonNullable<PrimitiveAttributeEnumValues<PrimitiveAttributeType>>[number]
    path: string
  }) {
    super(
      `Invalid enum value type at path${path}. Expected: ${expectedType}. Received: ${String(
        enumValue
      )}.`
    )
  }
}

export class InvalidDefaultValueTypeError extends Error {
  constructor({
    expectedType,
    defaultValue,
    path
  }: {
    expectedType: PrimitiveAttributeType
    defaultValue: NonNullable<PrimitiveAttributeDefaultValue<PrimitiveAttributeType>>
    path: string
  }) {
    super(
      `Invalid default value type at path${path}: Expected: ${expectedType}. Received: ${String(
        defaultValue
      )}.`
    )
  }
}

export class InvalidDefaultValueRangeError extends Error {
  constructor({
    enumValues,
    defaultValue,
    path
  }: {
    enumValues: NonNullable<PrimitiveAttributeEnumValues<PrimitiveAttributeType>>
    defaultValue: NonNullable<PrimitiveAttributeDefaultValue<PrimitiveAttributeType>>
    path: string
  }) {
    super(
      `Invalid default value at path ${path}: Expected one of: ${enumValues.join(
        ', '
      )}. Received: ${String(defaultValue)}.`
    )
  }
}
