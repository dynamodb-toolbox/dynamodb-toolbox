import { getPathMessage } from 'v1/errors/getPathMessage'

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
      `Invalid option value type${getPathMessage(
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

  if (typeof _hidden !== 'boolean') {
    throw new InvalidPropertyStateError({
      optionName: 'hidden',
      expectedType: 'boolean',
      receivedValue: _hidden,
      path
    })
  }

  if (typeof _key !== 'boolean') {
    throw new InvalidPropertyStateError({
      optionName: 'key',
      expectedType: 'boolean',
      receivedValue: _key,
      path
    })
  }

  if (_savedAs !== undefined && typeof _savedAs !== 'string') {
    throw new InvalidPropertyStateError({
      optionName: 'savedAs',
      expectedType: 'string',
      receivedValue: _savedAs,
      path
    })
  }
}
