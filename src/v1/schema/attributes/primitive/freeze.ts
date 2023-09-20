import type { O } from 'ts-toolbelt'

import type { UpdateItemInputExtension } from 'v1/commands/updateItem/types'
import { DynamoDBToolboxError } from 'v1/errors'
import { isComputedDefault } from 'v1/schema/utils/isComputedDefault'
import { isStaticDefault } from 'v1/schema/utils/isStaticDefault'
import { validatorsByPrimitiveType } from 'v1/utils/validation'

import { validateAttributeProperties } from '../shared/validate'
import {
  $type,
  $required,
  $hidden,
  $key,
  $savedAs,
  $enum,
  $defaults
} from '../constants/attributeOptions'

import type { $PrimitiveAttribute, PrimitiveAttribute } from './interface'
import type { PrimitiveAttributeEnumValues, PrimitiveAttributeDefaultValue } from './types'

export type FreezePrimitiveAttribute<$PRIMITIVE_ATTRIBUTE extends $PrimitiveAttribute> =
  // Applying void O.Update improves type display
  O.Update<
    PrimitiveAttribute<
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
        defaults: {
          key: Extract<
            $PRIMITIVE_ATTRIBUTE[$defaults]['key'],
            PrimitiveAttributeDefaultValue<$PRIMITIVE_ATTRIBUTE[$type]>
          >
          put: Extract<
            $PRIMITIVE_ATTRIBUTE[$defaults]['put'],
            PrimitiveAttributeDefaultValue<$PRIMITIVE_ATTRIBUTE[$type]>
          >
          update: Extract<
            $PRIMITIVE_ATTRIBUTE[$defaults]['update'],
            PrimitiveAttributeDefaultValue<
              $PRIMITIVE_ATTRIBUTE[$type],
              PrimitiveAttributeEnumValues<$PRIMITIVE_ATTRIBUTE[$type]>,
              UpdateItemInputExtension
            >
          >
        }
      }
    >,
    never,
    never
  >

type PrimitiveAttributeFreezer = <$PRIMITIVE_ATTRIBUTE extends $PrimitiveAttribute>(
  $primitiveAttribute: $PRIMITIVE_ATTRIBUTE,
  path: string
) => FreezePrimitiveAttribute<$PRIMITIVE_ATTRIBUTE>

/**
 * Validates a primitive instance
 *
 * @param $primitiveAttribute Primitive
 * @param path Path of the instance in the related schema (string)
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
      throw new DynamoDBToolboxError('schema.primitiveAttribute.invalidEnumValueType', {
        message: `Invalid enum value type at path ${path}. Expected: ${primitiveType}. Received: ${String(
          enumValue
        )}.`,
        path,
        payload: { expectedType: primitiveType, enumValue }
      })
    }
  })

  const defaultValues = $primitiveAttribute[$defaults]

  for (const defaultValue of Object.values(defaultValues)) {
    if (
      defaultValue !== undefined &&
      !isComputedDefault(defaultValue) &&
      isStaticDefault(defaultValue)
    ) {
      if (!typeValidator(defaultValue)) {
        throw new DynamoDBToolboxError('schema.primitiveAttribute.invalidDefaultValueType', {
          message: `Invalid default value type at path ${path}: Expected: ${primitiveType}. Received: ${String(
            defaultValue
          )}.`,
          path,
          payload: { expectedType: primitiveType, defaultValue }
        })
      }

      if (enumValues !== undefined && !enumValues.some(enumValue => enumValue === defaultValue)) {
        throw new DynamoDBToolboxError('schema.primitiveAttribute.invalidDefaultValueRange', {
          message: `Invalid default value at path ${path}: Expected one of: ${enumValues.join(
            ', '
          )}. Received: ${String(defaultValue)}.`,
          path,
          payload: { enumValues, defaultValue }
        })
      }
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
    defaults: {
      key: defaultValues.key as Extract<
        $PRIMITIVE_ATTRIBUTE[$defaults]['key'],
        PrimitiveAttributeDefaultValue<$PRIMITIVE_ATTRIBUTE[$type]>
      >,
      put: defaultValues.put as Extract<
        $PRIMITIVE_ATTRIBUTE[$defaults]['put'],
        PrimitiveAttributeDefaultValue<$PRIMITIVE_ATTRIBUTE[$type]>
      >,
      update: defaultValues.update as Extract<
        $PRIMITIVE_ATTRIBUTE[$defaults]['update'],
        PrimitiveAttributeDefaultValue<$PRIMITIVE_ATTRIBUTE[$type]>
      >
    }
  }
}
