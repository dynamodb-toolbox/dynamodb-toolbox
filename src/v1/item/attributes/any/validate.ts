import { validateAttributeProperties } from '../shared/validate'

import type { AnyAttribute } from './interface'

/**
 * Validates an any instance
 *
 * @param anyInstance Any
 * @param path _(optional)_ Path of the instance in the related item (string)
 * @return void
 */
export const validateAnyAttribute = <AnyInput extends AnyAttribute>(
  anyInstance: AnyInput,
  path?: string
): void => {
  validateAttributeProperties(anyInstance, path)

  // TODO: validate that _default is valid ?
}
