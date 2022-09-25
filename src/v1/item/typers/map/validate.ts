import { validateAttributeState } from '../attribute/validate'
import { validateAttribute } from '../validate'

import type { Mapped } from './interface'

/**
 * Validates a map instance
 *
 * @param mapInstance Mapped
 * @param path _(optional)_ Path of the instance in the related item (string)
 * @return void
 */
export const validateMap = <MappedInput extends Mapped>(
  { _attributes: attributes, ...mapInstance }: MappedInput,
  path?: string
): void => {
  validateAttributeState(mapInstance, path)

  Object.entries(attributes).forEach(([attributeName, attribute]) =>
    validateAttribute(attribute, [path, attributeName].filter(Boolean).join('.'))
  )
}
