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
  $default
} from '../constants/attributeOptions'

import { $PrimitiveAttribute, PrimitiveAttribute } from './interface'
import type {
  PrimitiveAttributeType,
  PrimitiveAttributeEnumValues,
  PrimitiveAttributeDefaultValue
} from './types'

export type FreezePrimitiveAttribute<
  $PRIMITIVE_ATTRIBUTE extends $PrimitiveAttribute
> = PrimitiveAttribute<
  $PRIMITIVE_ATTRIBUTE[$type],
  {
    required: $PRIMITIVE_ATTRIBUTE[$required]
    hidden: $PRIMITIVE_ATTRIBUTE[$hidden]
    key: $PRIMITIVE_ATTRIBUTE[$key]
    savedAs: $PRIMITIVE_ATTRIBUTE[$savedAs]
    enum: Extract<
      $PRIMITIVE_ATTRIBUTE[$enum],
      PrimitiveAttributeEnumValues<$PRIMITIVE_ATTRIBUTE[$type]>
    >
    default: Extract<
      $PRIMITIVE_ATTRIBUTE[$default],
      PrimitiveAttributeDefaultValue<$PRIMITIVE_ATTRIBUTE[$type]>
    >
  }
>

type PrimitiveAttributeFreezer = <$PRIMITIVE_ATTRIBUTE extends $PrimitiveAttribute>(
  $primitiveAttribute: $PRIMITIVE_ATTRIBUTE,
  path: string
) => FreezePrimitiveAttribute<$PRIMITIVE_ATTRIBUTE>

/**
 * Validates a primitive instance
 *
 * @param $primitiveAttribute Primitive
 * @param path _(optional)_ Path of the instance in the related item (string)
 * @return void
 */
export const freezePrimitiveAttribute: PrimitiveAttributeFreezer = <
  $PRIMITIVE_ATTRIBUTE extends $PrimitiveAttribute
>(
  $primitiveAttribute: $PRIMITIVE_ATTRIBUTE,
  path: string
): FreezePrimitiveAttribute<$PRIMITIVE_ATTRIBUTE> => {
  validateAttributeProperties($primitiveAttribute, path)

  const primitiveType = $primitiveAttribute[$type]
  const typeValidator = validatorsByPrimitiveType[primitiveType]

  const enumValues = $primitiveAttribute[$enum]
  enumValues?.forEach(enumValue => {
    const isEnumValueValid = typeValidator(enumValue)
    if (!isEnumValueValid) {
      throw new InvalidEnumValueTypeError({ expectedType: primitiveType, enumValue, path })
    }
  })

  const defaultValue = $primitiveAttribute[$default]
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
    required: $primitiveAttribute[$required],
    hidden: $primitiveAttribute[$hidden],
    key: $primitiveAttribute[$key],
    savedAs: $primitiveAttribute[$savedAs],
    enum: enumValues as Extract<
      $PRIMITIVE_ATTRIBUTE[$enum],
      PrimitiveAttributeEnumValues<$PRIMITIVE_ATTRIBUTE[$type]>
    >,
    default: defaultValue as Extract<
      $PRIMITIVE_ATTRIBUTE[$default],
      PrimitiveAttributeDefaultValue<$PRIMITIVE_ATTRIBUTE[$type]>
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
