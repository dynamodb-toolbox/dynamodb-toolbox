import { getInfoTextForItemPath } from 'v1/errors/getInfoTextForItemPath'
import { isBoolean, isString } from 'v1/utils/validation'

import type { AttributeProperties } from './interface'
import { requiredOptionsSet } from '../constants/requiredOptions'

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
      )}. Option: ${propertyName}. Expected: ${expectedType}. Received: ${String(receivedValue)}.`
    )
  }
}

/**
 * Validates an attribute shared properties
 *
 * @param attribute Attribute
 * @param path _(optional)_ Path of the instance in the related item (string)
 * @return void
 */
export const validateAttributeProperties = (
  { _required, _hidden, _key, _savedAs }: AttributeProperties,
  path?: string
): void => {
  if (!requiredOptionsSet.has(_required)) {
    throw new InvalidAttributePropertyError({
      propertyName: 'required',
      expectedType: [...requiredOptionsSet].join(', '),
      receivedValue: _required,
      path
    })
  }

  if (!isBoolean(_hidden)) {
    throw new InvalidAttributePropertyError({
      propertyName: 'hidden',
      expectedType: 'boolean',
      receivedValue: _hidden,
      path
    })
  }

  if (!isBoolean(_key)) {
    throw new InvalidAttributePropertyError({
      propertyName: 'key',
      expectedType: 'boolean',
      receivedValue: _key,
      path
    })
  }

  if (_savedAs !== undefined && !isString(_savedAs)) {
    throw new InvalidAttributePropertyError({
      propertyName: 'savedAs',
      expectedType: 'string',
      receivedValue: _savedAs,
      path
    })
  }
}
