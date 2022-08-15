import { validateProperty } from '../validate'

import type { Mapped } from './interface'

export const validateMap = <M extends Mapped>(mapped: M, path?: string): boolean => {
  // TODO: Validate common attributes (_required, _key etc...)

  const { _properties: properties } = mapped

  return Object.entries(properties).every(([propertyName, property]) =>
    validateProperty(property, [path, propertyName].filter(Boolean).join('.'))
  )
}
