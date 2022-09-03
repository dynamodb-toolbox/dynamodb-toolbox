import { validatePropertyState } from '../property/validate'
import { validateProperty } from '../validate'

import type { Mapped } from './interface'

/**
 * Validates a map instance
 *
 * @param mapInstance Mapped
 * @param path _(optional)_ Path of the instance in the related item (string)
 * @return void
 */
export const validateMap = <M extends Mapped>(
  { _properties: properties, ...mapInstance }: M,
  path?: string
): void => {
  validatePropertyState(mapInstance, path)

  Object.entries(properties).forEach(([propertyName, property]) =>
    validateProperty(property, [path, propertyName].filter(Boolean).join('.'))
  )
}
