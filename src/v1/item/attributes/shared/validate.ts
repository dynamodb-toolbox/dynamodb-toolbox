import { getInfoTextForItemPath } from 'v1/errors/getInfoTextForItemPath'
import { isBoolean, isString } from 'v1/utils/validation'

import { $required, $hidden, $key, $savedAs } from '../constants/attributeOptions'
import { requiredOptionsSet } from '../constants/requiredOptions'
import type { $AttributeSharedStateConstraint } from './interface'

/**
 * Validates an attribute shared properties
 *
 * @param attribute Attribute
 * @param path _(optional)_ Path of the instance in the related item (string)
 * @return void
 */
export const validateAttributeProperties = (
  _attribute: $AttributeSharedStateConstraint,
  path?: string
): void => {
  const attributeRequired = _attribute[$required]
  if (!requiredOptionsSet.has(attributeRequired)) {
    throw new InvalidAttributePropertyError({
      propertyName: 'required',
      expectedType: [...requiredOptionsSet].join(', '),
      receivedValue: attributeRequired,
      path
    })
  }

  const attributeHidden = _attribute[$hidden]
  if (!isBoolean(attributeHidden)) {
    throw new InvalidAttributePropertyError({
      propertyName: 'hidden',
      expectedType: 'boolean',
      receivedValue: attributeHidden,
      path
    })
  }

  const attributeKey = _attribute[$key]
  if (!isBoolean(attributeKey)) {
    throw new InvalidAttributePropertyError({
      propertyName: 'key',
      expectedType: 'boolean',
      receivedValue: attributeKey,
      path
    })
  }

  const attributeSavedAs = _attribute[$savedAs]
  if (attributeSavedAs !== undefined && !isString(attributeSavedAs)) {
    throw new InvalidAttributePropertyError({
      propertyName: 'savedAs',
      expectedType: 'string',
      receivedValue: attributeSavedAs,
      path
    })
  }
}

export class InvalidAttributePropertyError extends Error {
  constructor({
    propertyName,
    expectedType,
    receivedValue,
    path
  }: {
    propertyName: string
    expectedType: string
    receivedValue: unknown
    path?: string
  }) {
    super(
      `Invalid option value type${getInfoTextForItemPath(
        path
      )}. Property: ${propertyName}. Expected: ${expectedType}. Received: ${String(receivedValue)}.`
    )
  }
}
