import type { Any } from './interface'

/**
 * Validates an any instance
 *
 * @param anyInstance Any
 * @param path _(optional)_ Path of the instance in the related item (string)
 * @return Boolean
 */
export const validateAny = <A extends Any>(anyInstance: A, path?: string): boolean => {
  // TODO: Validate common attributes (_required, _key etc...)
  anyInstance
  path

  return true
}
