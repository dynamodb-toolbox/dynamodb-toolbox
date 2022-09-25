import { validateAttributeState } from '../attribute/validate'

import type { Any } from './interface'

/**
 * Validates an any instance
 *
 * @param anyInstance Any
 * @param path _(optional)_ Path of the instance in the related item (string)
 * @return void
 */
export const validateAny = <AnyInput extends Any>(anyInstance: AnyInput, path?: string): void => {
  validateAttributeState(anyInstance, path)

  // TODO: validate that _default is valid ?
}
