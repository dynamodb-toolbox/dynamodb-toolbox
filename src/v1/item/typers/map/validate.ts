import { getInfoTextForItemPath } from 'v1/errors/getInfoTextForItemPath'

import { validateAttributeProperties } from '../attribute/validate'
import { validateAttribute } from '../validate'

import type { Mapped } from './interface'

export class DuplicateSavedAsAttributesError extends Error {
  constructor({ duplicatedSavedAs, path }: { duplicatedSavedAs: string; path?: string }) {
    super(
      `Invalid map attributes${getInfoTextForItemPath(
        path
      )}: More than two attributes are saved as '${duplicatedSavedAs}'`
    )
  }
}

/**
 * Validates a map instance
 *
 * @param mapInstance Mapped
 * @param path _(optional)_ Path of the instance in the related item (string)
 * @return void
 */
export const validateMap = <MappedInput extends Mapped>(
  mapInstance: MappedInput,
  path?: string
): void => {
  validateAttributeProperties(mapInstance, path)

  const attributesSavedAs = new Set<string>()

  const { _attributes: attributes } = mapInstance
  Object.entries(attributes).forEach(([attributeName, attribute]) => {
    const attributeSavedAs = attribute._savedAs ?? attributeName
    if (attributesSavedAs.has(attributeSavedAs)) {
      throw new DuplicateSavedAsAttributesError({ duplicatedSavedAs: attributeSavedAs, path })
    }
    attributesSavedAs.add(attributeSavedAs)

    validateAttribute(attribute, [path, attributeName].filter(Boolean).join('.'))
  })
}
