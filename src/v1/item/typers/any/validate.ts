import { validatePropertyState } from '../property/validate'

import type { Any } from './interface'

/**
 * Validates an any instance
 *
 * @param anyInstance Any
 * @param path _(optional)_ Path of the instance in the related item (string)
 * @return void
 */
export const validateAny = <A extends Any>(anyInstance: A, path?: string): void => {
  validatePropertyState(anyInstance, path)

  // TODO: validate that _default is valid ?
}
