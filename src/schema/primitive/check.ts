import { DynamoDBToolboxError } from '~/errors/index.js'
import { isStaticDefault } from '~/schema/utils/isStaticDefault.js'
import { isValidPrimitive } from '~/utils/validation/isValidPrimitive.js'

import { checkSchemaProps } from '../utils/checkSchemaProps.js'
import type { PrimitiveSchema } from './types.js'

export const checkPrimitiveSchema = (schema: PrimitiveSchema, path?: string): void => {
  checkSchemaProps(schema.props, path)

  const { type, props } = schema
  const { enum: enumValues } = props

  enumValues?.forEach(enumValue => {
    if (!isValidPrimitive(schema, enumValue)) {
      throw new DynamoDBToolboxError('schema.primitive.invalidEnumValueType', {
        message: `Invalid enum value type${
          path !== undefined ? ` at path '${path}'` : ''
        }. Expected: ${type}. Received: ${String(enumValue)}.`,
        path,
        payload: { expectedType: type, enumValue }
      })
    }
  })

  for (const defaultValue of [props.keyDefault, props.putDefault, props.updateDefault]) {
    if (defaultValue === undefined) {
      continue
    }

    if (isStaticDefault(defaultValue)) {
      if (!isValidPrimitive(schema, defaultValue)) {
        throw new DynamoDBToolboxError('schema.primitive.invalidDefaultValueType', {
          message: `Invalid default value type${
            path !== undefined ? ` at path '${path}'` : ''
          }: Expected: ${type}. Received: ${String(defaultValue)}.`,
          path,
          payload: { expectedType: type, defaultValue }
        })
      }

      if (enumValues !== undefined && !enumValues.some(enumValue => enumValue === defaultValue)) {
        throw new DynamoDBToolboxError('schema.primitive.invalidDefaultValueRange', {
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
