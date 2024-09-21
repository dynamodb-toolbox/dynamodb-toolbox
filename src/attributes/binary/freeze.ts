import { DynamoDBToolboxError } from '~/errors/index.js'
import { isStaticDefault } from '~/schema/utils/isStaticDefault.js'
import type { Update } from '~/types/update.js'
import { isBinary } from '~/utils/validation/isBinary.js'

import type { $state } from '../constants/attributeOptions.js'
import { validateAttributeProperties } from '../shared/validate.js'
import type { $BinaryAttributeState } from './interface.js'
import { BinaryAttribute } from './interface.js'
import type { BinaryAttributeState } from './types.js'

export type FreezeBinaryAttribute<$BINARY_ATTRIBUTE extends $BinaryAttributeState> =
  // Applying void Update improves type display
  Update<BinaryAttribute<$BINARY_ATTRIBUTE[$state]>, never, never>

type BinaryAttributeFreezer = <STATE extends BinaryAttributeState>(
  state: STATE,
  path?: string
) => FreezeBinaryAttribute<$BinaryAttributeState<STATE>>

/**
 * Freezes a warm `number` attribute
 *
 * @param state Attribute options
 * @param path Path of the instance in the related schema (string)
 * @return void
 */
export const freezeBinaryAttribute: BinaryAttributeFreezer = <STATE extends BinaryAttributeState>(
  state: STATE,
  path?: string
): FreezeBinaryAttribute<$BinaryAttributeState<STATE>> => {
  validateAttributeProperties(state, path)

  const { enum: enumValues } = state
  enumValues?.forEach(enumValue => {
    const isEnumValueValid = isBinary(enumValue)
    if (!isEnumValueValid) {
      throw new DynamoDBToolboxError('schema.primitiveAttribute.invalidEnumValueType', {
        message: `Invalid enum value type${
          path !== undefined ? ` at path '${path}'` : ''
        }. Expected: binary. Received: ${String(enumValue)}.`,
        path,
        payload: { expectedType: 'binary', enumValue }
      })
    }
  })

  for (const defaultValue of Object.values(state.defaults)) {
    if (defaultValue !== undefined && isStaticDefault(defaultValue)) {
      if (!isBinary(defaultValue)) {
        throw new DynamoDBToolboxError('schema.primitiveAttribute.invalidDefaultValueType', {
          message: `Invalid default value type${
            path !== undefined ? ` at path '${path}'` : ''
          }: Expected: binary. Received: ${String(defaultValue)}.`,
          path,
          payload: { expectedType: 'binary', defaultValue }
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

  return new BinaryAttribute({ path, ...state })
}
