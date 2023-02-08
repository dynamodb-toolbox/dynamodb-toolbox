import { DynamoDBToolboxError } from 'v1/errors'
import { isBoolean, isString } from 'v1/utils/validation'

import { $required, $hidden, $key, $savedAs } from '../constants/attributeOptions'
import { requiredOptionsSet } from '../constants/requiredOptions'

import type { $AttributeSharedStateConstraint } from './interface'

/**
 * Validates an attribute shared properties
 *
 * @param attribute Attribute
 * @param path Path of the instance in the related item (string)
 * @return void
 */
export const validateAttributeProperties = (
  $attribute: $AttributeSharedStateConstraint,
  path: string
): void => {
  const attributeRequired = $attribute[$required]
  if (!requiredOptionsSet.has(attributeRequired)) {
    throw new DynamoDBToolboxError('invalidAttributeProperty', {
      message: `Invalid option value type at path ${path}. Property: 'required'. Expected: ${[
        ...requiredOptionsSet
      ].join(', ')}. Received: ${String(attributeRequired)}.`,
      path,
      payload: {
        propertyName: 'required',
        expected: [...requiredOptionsSet].join(', '),
        received: attributeRequired
      }
    })
  }

  const attributeHidden = $attribute[$hidden]
  if (!isBoolean(attributeHidden)) {
    throw new DynamoDBToolboxError('invalidAttributeProperty', {
      message: `Invalid option value type at path ${path}. Property: 'hidden'. Expected: boolean. Received: ${String(
        attributeHidden
      )}.`,
      path,
      payload: {
        propertyName: 'hidden',
        received: attributeRequired
      }
    })
  }

  const attributeKey = $attribute[$key]
  if (!isBoolean(attributeKey)) {
    throw new DynamoDBToolboxError('invalidAttributeProperty', {
      message: `Invalid option value type at path ${path}. Property: 'key'. Expected: boolean. Received: ${String(
        attributeHidden
      )}.`,
      path,
      payload: {
        propertyName: 'key',
        received: attributeRequired
      }
    })
  }

  const attributeSavedAs = $attribute[$savedAs]
  if (attributeSavedAs !== undefined && !isString(attributeSavedAs)) {
    throw new DynamoDBToolboxError('invalidAttributeProperty', {
      message: `Invalid option value type at path ${path}. Property: 'savedAs'. Expected: string. Received: ${String(
        attributeHidden
      )}.`,
      path,
      payload: {
        propertyName: 'savedAs',
        received: attributeRequired
      }
    })
  }
}
