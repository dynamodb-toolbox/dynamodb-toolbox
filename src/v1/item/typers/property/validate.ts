import { getInfoTextForItemPath } from 'v1/errors/getInfoTextForItemPath'
import { isBoolean, isString } from 'v1/utils/validation'

import type { PropertyState } from './interface'
import { requiredOptionsSet } from '../constants/requiredOptions'

export class InvalidPropertyStateError extends Error {
  constructor({
    optionName,
    expectedType,
    receivedValue,
    path
  }: {
    optionName: string
    expectedType: string
    receivedValue: unknown
    path?: string
  }) {
    super(
      `Invalid option value type${getInfoTextForItemPath(
        path
      )}. Option: ${optionName}. Expected: ${expectedType}. Received: ${String(receivedValue)}.`
    )
  }
}

/**
 * Validates a property base state
 *
 * @param property Property
 * @param path _(optional)_ Path of the instance in the related item (string)
 * @return void
 */
export const validatePropertyState = (
  { _required, _hidden, _key, _savedAs }: PropertyState,
  path?: string
): void => {
  if (!requiredOptionsSet.has(_required)) {
    throw new InvalidPropertyStateError({
      optionName: 'required',
      expectedType: [...requiredOptionsSet].join(', '),
      receivedValue: _required,
      path
    })
  }

  if (!isBoolean(_hidden)) {
    throw new InvalidPropertyStateError({
      optionName: 'hidden',
      expectedType: 'boolean',
      receivedValue: _hidden,
      path
    })
  }

  if (!isBoolean(_key)) {
    throw new InvalidPropertyStateError({
      optionName: 'key',
      expectedType: 'boolean',
      receivedValue: _key,
      path
    })
  }

  if (_savedAs !== undefined && !isString(_savedAs)) {
    throw new InvalidPropertyStateError({
      optionName: 'savedAs',
      expectedType: 'string',
      receivedValue: _savedAs,
      path
    })
  }
}
