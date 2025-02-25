import { DynamoDBToolboxError } from '~/errors/index.js'
import { isStaticDefault } from '~/schema/utils/isStaticDefault.js'
import { isValidPrimitive } from '~/utils/validation/isValidPrimitive.js'

import type { BinaryAttributeStateConstraint } from '../binary/types.js'
import type { BooleanAttributeStateConstraint } from '../boolean/types.js'
import type { NullAttributeStateConstraint } from '../null/types.js'
import type { NumberAttributeStateConstraint } from '../number/types.js'
import { validateAttributeProperties } from '../shared/validate.js'
import type { StringAttributeStateConstraint } from '../string/types.js'

export const validatePrimitiveAttribute = (
  attribute:
    | ({ type: 'null' } & { state: NullAttributeStateConstraint })
    | ({ type: 'boolean' } & { state: BooleanAttributeStateConstraint })
    | ({ type: 'number' } & { state: NumberAttributeStateConstraint })
    | ({ type: 'string' } & { state: StringAttributeStateConstraint })
    | ({ type: 'binary' } & { state: BinaryAttributeStateConstraint }),
  path?: string
): void => {
  validateAttributeProperties(attribute.state, path)

  const { type, state } = attribute
  const { enum: enumValues } = state

  enumValues?.forEach(enumValue => {
    if (!isValidPrimitive(attribute, enumValue)) {
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
      if (!isValidPrimitive(attribute, defaultValue)) {
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
