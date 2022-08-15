import type { Any } from './interface'

export const validateAny = <A extends Any>(anyInstance: A, path?: string): boolean => {
  // TODO: Validate common attributes (_required, _key etc...)
  anyInstance
  path

  return true
}
