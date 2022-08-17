import { validateLeaf } from './leaf'
import { validateMap } from './map'
import { validateList } from './list'
import { validateAny } from './any'
import type { Property } from './types/property'

export const errorMessagePathSuffix = (path?: string): string =>
  path !== undefined ? ` at path ${path}` : ''

/**
 * Validates a property definition
 *
 * @param property Property
 * @param path _(optional)_ Path of the property in the related item (string)
 * @return Boolean
 */
export const validateProperty = (property: Property, path?: string): boolean => {
  switch (property._type) {
    case 'string':
    case 'number':
    case 'boolean':
    case 'binary':
      return validateLeaf(property, path)
    case 'list':
      return validateList(property, path)
    case 'map':
      return validateMap(property, path)
    case 'any':
      return validateAny(property, path)
  }
}
