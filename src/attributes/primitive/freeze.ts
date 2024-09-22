import { DynamoDBToolboxError } from '~/errors/index.js'
import { isStaticDefault } from '~/schema/utils/isStaticDefault.js'
import { isValidPrimitive } from '~/utils/validation/isValidPrimitive.js'

import type { BinaryAttributeState } from '../binary/types.js'
import type { BooleanAttributeState } from '../boolean/types.js'
import type { NullAttributeState } from '../null/types.js'
import type { NumberAttributeState } from '../number/types.js'
import { validateAttributeProperties } from '../shared/validate.js'
import type { StringAttributeState } from '../string/types.js'

export const validatePrimitiveAttribute = (
  state:
    | ({ type: 'null' } & NullAttributeState)
    | ({ type: 'boolean' } & BooleanAttributeState)
    | ({ type: 'number' } & NumberAttributeState)
    | ({ type: 'string' } & StringAttributeState)
    | ({ type: 'binary' } & BinaryAttributeState),
  path?: string
): void => {
  validateAttributeProperties(state, path)

  const { type, enum: enumValues } = state
  enumValues?.forEach(enumValue => {
    if (!isValidPrimitive(state, enumValue)) {
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
      if (!isValidPrimitive(state, defaultValue)) {
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
}
