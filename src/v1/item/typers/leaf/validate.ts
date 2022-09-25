import { getInfoTextForItemPath } from 'v1/errors/getInfoTextForItemPath'
import { isComputedDefault } from 'v1/item/utils/isComputedDefault'
import { isStaticDefault } from 'v1/item/utils/isStaticDefault'
import { validatorsByLeafType } from 'v1/utils/validation'

import { validateAttributeState } from '../attribute/validate'

import type { Leaf } from './interface'
import type { LeafType, EnumValues, LeafDefaultValue } from './types'

export class InvalidEnumValueTypeError extends Error {
  constructor({
    expectedType,
    enumValue,
    path
  }: {
    expectedType: LeafType
    enumValue: NonNullable<EnumValues<LeafType>>[number]
    path?: string
  }) {
    super(
      `Invalid enum value type${getInfoTextForItemPath(
        path
      )}. Expected: ${expectedType}. Received: ${String(enumValue)}.`
    )
  }
}

export class InvalidDefaultValueTypeError extends Error {
  constructor({
    expectedType,
    defaultValue,
    path
  }: {
    expectedType: LeafType
    defaultValue: NonNullable<LeafDefaultValue<LeafType>>
    path?: string
  }) {
    super(
      `Invalid default value type${getInfoTextForItemPath(
        path
      )}: Expected: ${expectedType}. Received: ${String(defaultValue)}.`
    )
  }
}

export class InvalidDefaultValueRangeError extends Error {
  constructor({
    enumValues,
    defaultValue,
    path
  }: {
    enumValues: NonNullable<EnumValues<LeafType>>
    defaultValue: NonNullable<LeafDefaultValue<LeafType>>
    path?: string
  }) {
    super(
      `Invalid default value${getInfoTextForItemPath(path)}: Expected one of: ${enumValues.join(
        ', '
      )}. Received: ${String(defaultValue)}.`
    )
  }
}

/**
 * Validates a leaf instance
 *
 * @param leafInstance Leaf
 * @param path _(optional)_ Path of the instance in the related item (string)
 * @return void
 */
export const validateLeaf = <LeafInput extends Leaf>(
  { _type: leafType, _enum: enumValues, _default: defaultValue, ...leafInstance }: LeafInput,
  path?: string
): void => {
  validateAttributeState(leafInstance, path)

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
}
