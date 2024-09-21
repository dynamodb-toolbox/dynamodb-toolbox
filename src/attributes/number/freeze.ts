import { DynamoDBToolboxError } from '~/errors/index.js'
import { isStaticDefault } from '~/schema/utils/isStaticDefault.js'
import type { Update } from '~/types/update.js'
import { isNumber } from '~/utils/validation/isNumber.js'

import type { $state } from '../constants/attributeOptions.js'
import { validateAttributeProperties } from '../shared/validate.js'
import type { $NumberAttributeState } from './interface.js'
import { NumberAttribute } from './interface.js'
import type { NumberAttributeState } from './types.js'

export type FreezeNumberAttribute<$NUMBER_ATTRIBUTE extends $NumberAttributeState> =
  // Applying void Update improves type display
  Update<NumberAttribute<$NUMBER_ATTRIBUTE[$state]>, never, never>

type NumberAttributeFreezer = <STATE extends NumberAttributeState>(
  state: STATE,
  path?: string
) => FreezeNumberAttribute<$NumberAttributeState<STATE>>

/**
 * Freezes a warm `number` attribute
 *
 * @param state Attribute options
 * @param path Path of the instance in the related schema (string)
 * @return void
 */
export const freezeNumberAttribute: NumberAttributeFreezer = <STATE extends NumberAttributeState>(
  state: STATE,
  path?: string
): FreezeNumberAttribute<$NumberAttributeState<STATE>> => {
  validateAttributeProperties(state, path)

  const { enum: enumValues } = state
  enumValues?.forEach(enumValue => {
    const isEnumValueValid = isNumber(enumValue)
    if (!isEnumValueValid) {
      throw new DynamoDBToolboxError('schema.primitiveAttribute.invalidEnumValueType', {
        message: `Invalid enum value type${
          path !== undefined ? ` at path '${path}'` : ''
        }. Expected: number. Received: ${String(enumValue)}.`,
        path,
        payload: { expectedType: 'number', enumValue }
      })
    }
  })

  for (const defaultValue of Object.values(state.defaults)) {
    if (defaultValue !== undefined && isStaticDefault(defaultValue)) {
      if (!isNumber(defaultValue)) {
        throw new DynamoDBToolboxError('schema.primitiveAttribute.invalidDefaultValueType', {
          message: `Invalid default value type${
            path !== undefined ? ` at path '${path}'` : ''
          }: Expected: number. Received: ${String(defaultValue)}.`,
          path,
          payload: { expectedType: 'number', defaultValue }
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

  return new NumberAttribute({ path, ...state })
}
