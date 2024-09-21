import { DynamoDBToolboxError } from '~/errors/index.js'
import { isStaticDefault } from '~/schema/utils/isStaticDefault.js'
import type { Update } from '~/types/update.js'
import { isNull } from '~/utils/validation/isNull.js'

import type { $state } from '../constants/attributeOptions.js'
import { validateAttributeProperties } from '../shared/validate.js'
import type { $NullAttributeState } from './interface.js'
import { NullAttribute } from './interface.js'
import type { NullAttributeState } from './types.js'

export type FreezeNullAttribute<$NULL_ATTRIBUTE extends $NullAttributeState> =
  // Applying void Update improves type display
  Update<NullAttribute<$NULL_ATTRIBUTE[$state]>, never, never>

type NullAttributeFreezer = <STATE extends NullAttributeState>(
  state: STATE,
  path?: string
) => FreezeNullAttribute<$NullAttributeState<STATE>>

/**
 * Freezes a warm `null` attribute
 *
 * @param state Attribute options
 * @param path Path of the instance in the related schema (string)
 * @return void
 */
export const freezeNullAttribute: NullAttributeFreezer = <STATE extends NullAttributeState>(
  state: STATE,
  path?: string
): FreezeNullAttribute<$NullAttributeState<STATE>> => {
  validateAttributeProperties(state, path)

  const { enum: enumValues } = state
  enumValues?.forEach(enumValue => {
    const isEnumValueValid = isNull(enumValue)
    if (!isEnumValueValid) {
      throw new DynamoDBToolboxError('schema.primitiveAttribute.invalidEnumValueType', {
        message: `Invalid enum value type${
          path !== undefined ? ` at path '${path}'` : ''
        }. Expected: null. Received: ${String(enumValue)}.`,
        path,
        payload: { expectedType: 'null', enumValue }
      })
    }
  })

  for (const defaultValue of Object.values(state.defaults)) {
    if (defaultValue !== undefined && isStaticDefault(defaultValue)) {
      if (!isNull(defaultValue)) {
        throw new DynamoDBToolboxError('schema.primitiveAttribute.invalidDefaultValueType', {
          message: `Invalid default value type${
            path !== undefined ? ` at path '${path}'` : ''
          }: Expected: null. Received: ${String(defaultValue)}.`,
          path,
          payload: { expectedType: 'null', defaultValue }
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

  return new NullAttribute({ path, ...state })
}
