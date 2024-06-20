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
  const attributeRequired = attribute.required
  if (!requiredOptionsSet.has(attributeRequired)) {
    throw new DynamoDBToolboxError('schema.attribute.invalidProperty', {
      message: `Invalid option value type${
        path !== undefined ? ` at path '${path}'` : ''
      }. Property: 'required'. Expected: ${[...requiredOptionsSet].join(', ')}. Received: ${String(
        attributeRequired
      )}.`,
      path,
      payload: {
        propertyName: 'required',
        expected: [...requiredOptionsSet].join(', '),
        received: attributeRequired
      }
    })
  }

  const attributeHidden = attribute.hidden
  if (!isBoolean(attributeHidden)) {
    throw new DynamoDBToolboxError('schema.attribute.invalidProperty', {
      message: `Invalid option value type${
        path !== undefined ? ` at path '${path}'` : ''
      }. Property: 'hidden'. Expected: boolean. Received: ${String(attributeHidden)}.`,
      path,
      payload: {
        propertyName: 'hidden',
        received: attributeRequired
      }
    })
  }

  const attributeKey = attribute.key
  if (!isBoolean(attributeKey)) {
    throw new DynamoDBToolboxError('schema.attribute.invalidProperty', {
      message: `Invalid option value type${
        path !== undefined ? ` at path '${path}'` : ''
      }. Property: 'key'. Expected: boolean. Received: ${String(attributeHidden)}.`,
      path,
      payload: {
        propertyName: 'key',
        received: attributeRequired
      }
    })
  }

  const attributeSavedAs = attribute.savedAs
  if (attributeSavedAs !== undefined && !isString(attributeSavedAs)) {
    throw new DynamoDBToolboxError('schema.attribute.invalidProperty', {
      message: `Invalid option value type${
        path !== undefined ? ` at path '${path}'` : ''
      }. Property: 'savedAs'. Expected: string. Received: ${String(attributeSavedAs)}.`,
      path,
      payload: {
        propertyName: 'savedAs',
        received: attributeRequired
      }
    })
  }
}
