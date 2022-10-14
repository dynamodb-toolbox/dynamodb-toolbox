import { getInfoTextForItemPath } from 'v1/errors/getInfoTextForItemPath'

import { validateAttributeProperties } from '../shared/validate'
import { validateAttribute } from '../validate'

import type { MapAttribute } from './interface'

/**
 * Validates a map instance
 *
 * @param mapInstance MapAttribute
 * @param path _(optional)_ Path of the instance in the related item (string)
 * @return void
 */
export const validateMapAttribute = <MapAttributeInput extends MapAttribute>(
  mapInstance: MapAttributeInput,
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

export class DuplicateSavedAsAttributesError extends Error {
  constructor({ duplicatedSavedAs, path }: { duplicatedSavedAs: string; path?: string }) {
    super(
      `Invalid map attributes${getInfoTextForItemPath(
        path
      )}: More than two attributes are saved as '${duplicatedSavedAs}'`
    )
  }
}
