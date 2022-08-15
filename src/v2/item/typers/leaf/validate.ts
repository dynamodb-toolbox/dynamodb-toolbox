import { ComputedDefault } from '../constants/computedDefault'
import { errorMessagePathSuffix } from '../validate'

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
      `Invalid enum value type${errorMessagePathSuffix(
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
      `Invalid default value type${errorMessagePathSuffix(
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
      `Invalid default value${errorMessagePathSuffix(path)}: Expected one of: ${enumValues.join(
        ', '
      )}. Received: ${String(defaultValue)}.`
    )
  }
}

export const validateLeaf = <L extends Leaf>(
  { _type: expectedType, _enum: enumValues, _default: defaultValue }: L,
  path?: string
): boolean => {
  // TODO: Validate common attributes (_required, _key etc...)

  enumValues?.forEach(enumValue => {
    if (typeof enumValue !== expectedType) {
      throw new InvalidEnumValueTypeError({ expectedType, enumValue, path })
    }
  })

  if (
    defaultValue !== undefined &&
    defaultValue !== ComputedDefault &&
    typeof defaultValue !== 'function'
  ) {
    if (typeof defaultValue !== expectedType) {
      throw new InvalidDefaultValueTypeError({ expectedType, defaultValue, path })
    }

    if (enumValues !== undefined && !enumValues.some(enumValue => enumValue === defaultValue)) {
      throw new InvalidDefaultValueRangeError({ enumValues, defaultValue, path })
    }
  }

  return true
}
