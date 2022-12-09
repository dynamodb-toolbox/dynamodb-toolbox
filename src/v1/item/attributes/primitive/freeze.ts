import { isComputedDefault } from 'v1/item/utils/isComputedDefault'
import { isStaticDefault } from 'v1/item/utils/isStaticDefault'
import { validatorsByPrimitiveType } from 'v1/utils/validation'

import { validateAttributeProperties } from '../shared/validate'

import type { _PrimitiveAttribute, FreezePrimitiveAttribute } from './interface'
import type {
  PrimitiveAttributeType,
  PrimitiveAttributeEnumValues,
  PrimitiveAttributeDefaultValue
} from './types'

type PrimitiveAttributeFreezer = <_LEAF_ATTRIBUTE extends _PrimitiveAttribute>(
  attribute: _LEAF_ATTRIBUTE,
  path: string
) => FreezePrimitiveAttribute<_LEAF_ATTRIBUTE>

/**
 * Validates a primitive instance
 *
 * @param attribute Primitive
 * @param path _(optional)_ Path of the instance in the related item (string)
 * @return void
 */
export const freezePrimitiveAttribute: PrimitiveAttributeFreezer = <
  _LEAF_ATTRIBUTE extends _PrimitiveAttribute
>(
  attribute: _LEAF_ATTRIBUTE,
  path: string
): FreezePrimitiveAttribute<_LEAF_ATTRIBUTE> => {
  validateAttributeProperties(attribute, path)

  const {
    _type: primitiveType,
    _enum: enumValues,
    _default: defaultValue,
    ...primitiveInstance
  } = attribute

  const typeValidator = validatorsByPrimitiveType[primitiveType]

  enumValues?.forEach(enumValue => {
    const isEnumValueValid = typeValidator(enumValue)
    if (!isEnumValueValid) {
      throw new InvalidEnumValueTypeError({ expectedType: primitiveType, enumValue, path })
    }
  })

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

  const { _required: required, _hidden: hidden, _key: key, _savedAs: savedAs } = primitiveInstance

  return {
    type: primitiveType,
    path: path,
    required,
    hidden,
    key,
    savedAs,
    enum: enumValues as Extract<
      _LEAF_ATTRIBUTE['_enum'],
      PrimitiveAttributeEnumValues<_LEAF_ATTRIBUTE['_type']>
    >,
    default: defaultValue as Extract<
      _LEAF_ATTRIBUTE['_default'],
      PrimitiveAttributeDefaultValue<_LEAF_ATTRIBUTE['_type']>
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
