import { isComputedDefault } from 'v1/item/utils/isComputedDefault'
import { isStaticDefault } from 'v1/item/utils/isStaticDefault'
import { validatorsByLeafType } from 'v1/utils/validation'

import { validateAttributeProperties } from '../shared/validate'

import type { _LeafAttribute, FreezeLeafAttribute } from './interface'
import type { LeafAttributeType, LeafAttributeEnumValues, LeafAttributeDefaultValue } from './types'

type LeafAttributeFreezer = <_LEAF_ATTRIBUTE extends _LeafAttribute>(
  attribute: _LEAF_ATTRIBUTE,
  path: string
) => FreezeLeafAttribute<_LEAF_ATTRIBUTE>

/**
 * Validates a leaf instance
 *
 * @param attribute Leaf
 * @param path _(optional)_ Path of the instance in the related item (string)
 * @return void
 */
export const freezeLeafAttribute: LeafAttributeFreezer = <_LEAF_ATTRIBUTE extends _LeafAttribute>(
  attribute: _LEAF_ATTRIBUTE,
  path: string
): FreezeLeafAttribute<_LEAF_ATTRIBUTE> => {
  validateAttributeProperties(attribute, path)

  const { _type: leafType, _enum: enumValues, _default: defaultValue, ...leafInstance } = attribute

  const typeValidator = validatorsByLeafType[leafType]

  enumValues?.forEach(enumValue => {
    const isEnumValueValid = typeValidator(enumValue)
    if (!isEnumValueValid) {
      throw new InvalidEnumValueTypeError({ expectedType: leafType, enumValue, path })
    }
  })

  if (
    defaultValue !== undefined &&
    !isComputedDefault(defaultValue) &&
    isStaticDefault(defaultValue)
  ) {
    if (!typeValidator(defaultValue)) {
      throw new InvalidDefaultValueTypeError({ expectedType: leafType, defaultValue, path })
    }

    if (enumValues !== undefined && !enumValues.some(enumValue => enumValue === defaultValue)) {
      throw new InvalidDefaultValueRangeError({ enumValues, defaultValue, path })
    }
  }

  const { _required: required, _hidden: hidden, _key: key, _savedAs: savedAs } = leafInstance

  return {
    type: leafType,
    path: path,
    required,
    hidden,
    key,
    savedAs,
    enum: enumValues as Extract<
      _LEAF_ATTRIBUTE['_enum'],
      LeafAttributeEnumValues<_LEAF_ATTRIBUTE['_type']>
    >,
    default: defaultValue as Extract<
      _LEAF_ATTRIBUTE['_default'],
      LeafAttributeDefaultValue<_LEAF_ATTRIBUTE['_type']>
    >
  }
}

export class InvalidEnumValueTypeError extends Error {
  constructor({
    expectedType,
    enumValue,
    path
  }: {
    expectedType: LeafAttributeType
    enumValue: NonNullable<LeafAttributeEnumValues<LeafAttributeType>>[number]
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
    expectedType: LeafAttributeType
    defaultValue: NonNullable<LeafAttributeDefaultValue<LeafAttributeType>>
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
    enumValues: NonNullable<LeafAttributeEnumValues<LeafAttributeType>>
    defaultValue: NonNullable<LeafAttributeDefaultValue<LeafAttributeType>>
    path: string
  }) {
    super(
      `Invalid default value at path ${path}: Expected one of: ${enumValues.join(
        ', '
      )}. Received: ${String(defaultValue)}.`
    )
  }
}
