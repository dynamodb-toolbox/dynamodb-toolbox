import { validateLeaf } from './leaf'
import { validateMap } from './map'
import { validateList } from './list'
import { validateAny } from './any'
import type { Property } from './types/property'

export const errorMessagePathSuffix = (path?: string): string =>
  path !== undefined ? ` at path ${path}` : ''

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
