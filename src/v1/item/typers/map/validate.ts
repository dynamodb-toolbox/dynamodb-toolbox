import { validateProperty } from '../validate'

import type { Mapped } from './interface'

/**
 * Validates a map instance
 *
 * @param mapInstance Mapped
 * @param path _(optional)_ Path of the instance in the related item (string)
 * @return Boolean
 */
export const validateMap = <M extends Mapped>(mapInstance: M, path?: string): boolean => {
  // TODO: Validate common attributes (_required, _key etc...)

  const { _properties: properties } = mapInstance

  return Object.entries(properties).every(([propertyName, property]) =>
    validateProperty(property, [path, propertyName].filter(Boolean).join('.'))
  )
}
