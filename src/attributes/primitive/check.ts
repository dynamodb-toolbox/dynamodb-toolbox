import { DynamoDBToolboxError } from '~/errors/index.js'
import { isStaticDefault } from '~/schema/utils/isStaticDefault.js'
import { isValidPrimitive } from '~/utils/validation/isValidPrimitive.js'

import { checkAttributeProperties } from '../shared/check.js'
import type { PrimitiveSchema } from './types.js'

export const checkPrimitiveAttribute = (schema: PrimitiveSchema, path?: string): void => {
  checkAttributeProperties(schema.state, path)

  const { type, state } = schema
  const { enum: enumValues } = state

  enumValues?.forEach(enumValue => {
    if (!isValidPrimitive(schema, enumValue)) {
      throw new DynamoDBToolboxError('schema.primitiveAttribute.invalidEnumValueType', {
        message: `Invalid enum value type${
          path !== undefined ? ` at path '${path}'` : ''
        }. Expected: ${type}. Received: ${String(enumValue)}.`,
        path,
        payload: { expectedType: type, enumValue }
      })
    }
  })

  for (const defaultValue of [state.keyDefault, state.putDefault, state.updateDefault]) {
    if (defaultValue === undefined) {
      continue
    }

    if (isStaticDefault(defaultValue)) {
      if (!isValidPrimitive(schema, defaultValue)) {
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
