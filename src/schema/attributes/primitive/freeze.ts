import type { O } from 'ts-toolbelt'

import { DynamoDBToolboxError } from '~/errors/index.js'
import { isStaticDefault } from '~/schema/utils/isStaticDefault.js'
import { validatorsByPrimitiveType } from '~/utils/validation/validatorsByPrimitiveType.js'

import {
  $defaults,
  $enum,
  $hidden,
  $key,
  $links,
  $required,
  $savedAs,
  $transform,
  $type
} from '../constants/attributeOptions.js'
import { validateAttributeProperties } from '../shared/validate.js'
import { $PrimitiveAttributeState, PrimitiveAttribute } from './interface.js'
import type {
  PrimitiveAttributeEnumValues,
  PrimitiveAttributeState,
  PrimitiveAttributeType
} from './types.js'

export type FreezePrimitiveAttribute<$PRIMITIVE_ATTRIBUTE extends $PrimitiveAttributeState> =
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
        defaults: $PRIMITIVE_ATTRIBUTE[$defaults]
        links: $PRIMITIVE_ATTRIBUTE[$links]
        transform: $PRIMITIVE_ATTRIBUTE[$transform]
      }
    >,
    never,
    never
  >

type PrimitiveAttributeFreezer = <
  TYPE extends PrimitiveAttributeType,
  STATE extends PrimitiveAttributeState<TYPE>
>(
  type: TYPE,
  primitiveAttribute: STATE,
  path?: string
) => FreezePrimitiveAttribute<$PrimitiveAttributeState<TYPE, STATE>>

/**
 * Freezes a warm `boolean`, `number`,  `string` or `binary` attribute
 *
 * @param type Attribute type
 * @param state Attribute options
 * @param path Path of the instance in the related schema (string)
 * @return void
 */
export const freezePrimitiveAttribute: PrimitiveAttributeFreezer = <
  TYPE extends PrimitiveAttributeType,
  STATE extends PrimitiveAttributeState
>(
  type: TYPE,
  state: STATE,
  path?: string
): FreezePrimitiveAttribute<$PrimitiveAttributeState<TYPE, STATE>> => {
  validateAttributeProperties(state, path)

  const typeValidator = validatorsByPrimitiveType[type]

  const { enum: enumValues, ...restState } = state
  enumValues?.forEach(enumValue => {
    const isEnumValueValid = typeValidator(enumValue)
    if (!isEnumValueValid) {
      throw new DynamoDBToolboxError('schema.primitiveAttribute.invalidEnumValueType', {
        message: `Invalid enum value type${
          path !== undefined ? ` at path '${path}'` : ''
        }. Expected: ${type}. Received: ${String(enumValue)}.`,
        path,
        payload: { expectedType: type, enumValue }
      })
    }
  })

  for (const defaultValue of Object.values(state.defaults)) {
    if (defaultValue !== undefined && isStaticDefault(defaultValue)) {
      if (!typeValidator(defaultValue)) {
        throw new DynamoDBToolboxError('schema.primitiveAttribute.invalidDefaultValueType', {
          message: `Invalid default value type${
            path !== undefined ? ` at path '${path}'` : ''
          }: Expected: ${type}. Received: ${String(defaultValue)}.`,
          path,
          payload: { expectedType: type, defaultValue }
        })
      }

      if (enumValues !== undefined && !enumValues.some(enumValue => enumValue === defaultValue)) {
        throw new DynamoDBToolboxError('schema.primitiveAttribute.invalidDefaultValueRange', {
          message: `Invalid default value${
            path !== undefined ? ` at path '${path}'` : ''
          }: Expected one of: ${enumValues.join(', ')}. Received: ${String(defaultValue)}.`,
          path,
          payload: { enumValues, defaultValue }
        })
      }
    }
  }

  return new PrimitiveAttribute({
    path,
    type,
    enum: state.enum as Extract<STATE['enum'], PrimitiveAttributeEnumValues<TYPE>>,
    ...restState
  })
}
