import { getPathMessage } from 'v1/errors/getPathMessage'
import { isFunction, validatorsByLeafType } from 'v1/utils/validation'

import { ComputedDefault } from '../constants/computedDefault'
import { validatePropertyState } from '../property/validate'

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
      `Invalid enum value type${getPathMessage(
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
      `Invalid default value type${getPathMessage(
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
      `Invalid default value${getPathMessage(path)}: Expected one of: ${enumValues.join(
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
export const validateLeaf = <L extends Leaf>(
  { _type: expectedType, _enum: enumValues, _default: defaultValue, ...leafInstance }: L,
  path?: string
): void => {
  validatePropertyState(leafInstance, path)

  const typeValidator = validatorsByLeafType[expectedType]

  enumValues?.forEach(enumValue => {
    if (!typeValidator(enumValue)) {
      throw new InvalidEnumValueTypeError({ expectedType, enumValue, path })
    }
  })

  if (defaultValue !== undefined && defaultValue !== ComputedDefault && !isFunction(defaultValue)) {
    if (!typeValidator(defaultValue)) {
      throw new InvalidDefaultValueTypeError({ expectedType, defaultValue, path })
    }

    if (enumValues !== undefined && !enumValues.some(enumValue => enumValue === defaultValue)) {
      throw new InvalidDefaultValueRangeError({ enumValues, defaultValue, path })
    }
  }
}
