import { DynamoDBToolboxError } from '~/errors/index.js'
import { isStaticDefault } from '~/schema/utils/isStaticDefault.js'
import type { Update } from '~/types/update.js'
import { isBoolean } from '~/utils/validation/isBoolean.js'

import type { $state } from '../constants/attributeOptions.js'
import { validateAttributeProperties } from '../shared/validate.js'
import type { $BooleanAttributeState } from './interface.js'
import { BooleanAttribute } from './interface.js'
import type { BooleanAttributeState } from './types.js'

export type FreezeBooleanAttribute<$BOOLEAN_ATTRIBUTE extends $BooleanAttributeState> =
  // Applying void Update improves type display
  Update<BooleanAttribute<$BOOLEAN_ATTRIBUTE[$state]>, never, never>

type BooleanAttributeFreezer = <STATE extends BooleanAttributeState>(
  state: STATE,
  path?: string
) => FreezeBooleanAttribute<$BooleanAttributeState<STATE>>

/**
 * Freezes a warm `boolean` attribute
 *
 * @param state Attribute options
 * @param path Path of the instance in the related schema (string)
 * @return void
 */
export const freezeBooleanAttribute: BooleanAttributeFreezer = <
  STATE extends BooleanAttributeState
>(
  state: STATE,
  path?: string
): FreezeBooleanAttribute<$BooleanAttributeState<STATE>> => {
  validateAttributeProperties(state, path)

  const { enum: enumValues } = state
  enumValues?.forEach(enumValue => {
    const isEnumValueValid = isBoolean(enumValue)
    if (!isEnumValueValid) {
      throw new DynamoDBToolboxError('schema.primitiveAttribute.invalidEnumValueType', {
        message: `Invalid enum value type${
          path !== undefined ? ` at path '${path}'` : ''
        }. Expected: boolean. Received: ${String(enumValue)}.`,
        path,
        payload: { expectedType: 'boolean', enumValue }
      })
    }
  })

  for (const defaultValue of Object.values(state.defaults)) {
    if (defaultValue !== undefined && isStaticDefault(defaultValue)) {
      if (!isBoolean(defaultValue)) {
        throw new DynamoDBToolboxError('schema.primitiveAttribute.invalidDefaultValueType', {
          message: `Invalid default value type${
            path !== undefined ? ` at path '${path}'` : ''
          }: Expected: boolean. Received: ${String(defaultValue)}.`,
          path,
          payload: { expectedType: 'boolean', defaultValue }
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

  return new BooleanAttribute({ path, ...state })
}
