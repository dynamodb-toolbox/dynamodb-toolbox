import { DynamoDBToolboxError } from '~/errors/index.js'
import { isStaticDefault } from '~/schema/utils/isStaticDefault.js'
import type { Update } from '~/types/update.js'
import { isString } from '~/utils/validation/isString.js'

import type { $state } from '../constants/attributeOptions.js'
import { validateAttributeProperties } from '../shared/validate.js'
import type { $StringAttributeState } from './interface.js'
import { StringAttribute } from './interface.js'
import type { StringAttributeState } from './types.js'

export type FreezeStringAttribute<$STRING_ATTRIBUTE extends $StringAttributeState> =
  // Applying void Update improves type display
  Update<StringAttribute<$STRING_ATTRIBUTE[$state]>, never, never>

type StringAttributeFreezer = <STATE extends StringAttributeState>(
  state: STATE,
  path?: string
) => FreezeStringAttribute<$StringAttributeState<STATE>>

/**
 * Freezes a warm `number` attribute
 *
 * @param type Attribute type
 * @param state Attribute options
 * @param path Path of the instance in the related schema (string)
 * @return void
 */
export const freezeNumberAttribute: StringAttributeFreezer = <STATE extends StringAttributeState>(
  state: STATE,
  path?: string
): FreezeStringAttribute<$StringAttributeState<STATE>> => {
  validateAttributeProperties(state, path)

  const { enum: enumValues } = state
  enumValues?.forEach(enumValue => {
    const isEnumValueValid = isString(enumValue)
    if (!isEnumValueValid) {
      throw new DynamoDBToolboxError('schema.primitiveAttribute.invalidEnumValueType', {
        message: `Invalid enum value type${
          path !== undefined ? ` at path '${path}'` : ''
        }. Expected: string. Received: ${String(enumValue)}.`,
        path,
        payload: { expectedType: 'string', enumValue }
      })
    }
  })

  for (const defaultValue of Object.values(state.defaults)) {
    if (defaultValue !== undefined && isStaticDefault(defaultValue)) {
      if (!isString(defaultValue)) {
        throw new DynamoDBToolboxError('schema.primitiveAttribute.invalidDefaultValueType', {
          message: `Invalid default value type${
            path !== undefined ? ` at path '${path}'` : ''
          }: Expected: string. Received: ${String(defaultValue)}.`,
          path,
          payload: { expectedType: 'string', defaultValue }
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

  return new StringAttribute({ path, ...state })
}
