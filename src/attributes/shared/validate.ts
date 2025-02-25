import { DynamoDBToolboxError } from '~/errors/index.js'
import { isBoolean } from '~/utils/validation/isBoolean.js'
import { isString } from '~/utils/validation/isString.js'

import { requiredOptionsSet } from '../constants/requiredOptions.js'
import type { SharedAttributeState } from './interface.js'

/**
 * Validates an attribute shared properties
 *
 * @param attribute Attribute
 * @param path Path of the instance in the related schema (string)
 * @return void
 */
export const validateAttributeProperties = (
  attribute: SharedAttributeState,
  path?: string
): void => {
  const { required, hidden, key, savedAs } = attribute

  if (required !== undefined && !requiredOptionsSet.has(required)) {
    throw new DynamoDBToolboxError('schema.attribute.invalidProperty', {
      message: `Invalid option value type${
        path !== undefined ? ` at path '${path}'` : ''
      }. Property: 'required'. Expected: ${[...requiredOptionsSet].join(', ')}. Received: ${String(
        required
      )}.`,
      path,
      payload: {
        propertyName: 'required',
        expected: [...requiredOptionsSet].join(', '),
        received: required
      }
    })
  }

  if (hidden !== undefined && !isBoolean(hidden)) {
    throw new DynamoDBToolboxError('schema.attribute.invalidProperty', {
      message: `Invalid option value type${
        path !== undefined ? ` at path '${path}'` : ''
      }. Property: 'hidden'. Expected: boolean. Received: ${String(hidden)}.`,
      path,
      payload: {
        propertyName: 'hidden',
        received: required
      }
    })
  }

  if (key !== undefined && !isBoolean(key)) {
    throw new DynamoDBToolboxError('schema.attribute.invalidProperty', {
      message: `Invalid option value type${
        path !== undefined ? ` at path '${path}'` : ''
      }. Property: 'key'. Expected: boolean. Received: ${String(hidden)}.`,
      path,
      payload: {
        propertyName: 'key',
        received: hidden
      }
    })
  }

  if (savedAs !== undefined && !isString(savedAs)) {
    throw new DynamoDBToolboxError('schema.attribute.invalidProperty', {
      message: `Invalid option value type${
        path !== undefined ? ` at path '${path}'` : ''
      }. Property: 'savedAs'. Expected: string. Received: ${String(savedAs)}.`,
      path,
      payload: {
        propertyName: 'savedAs',
        received: savedAs
      }
    })
  }
}
