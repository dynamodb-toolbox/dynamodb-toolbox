import { getInfoTextForItemPath } from 'v1/errors/getInfoTextForItemPath'

import { validateAttributeProperties } from '../shared/validate'
import { validateAttribute } from '../validate'

import type { ListAttribute } from './interface'

/**
 * Validates a list instance
 *
 * @param listInstance List
 * @param path _(optional)_ Path of the instance in the related item (string)
 * @return void
 */
export const validateListAttribute = <ListInput extends ListAttribute>(
  { _elements: elements, ...listInstance }: ListInput,
  path?: string
): void => {
  validateAttributeProperties(listInstance, path)

  const {
    _required: elementsRequired,
    _hidden: elementsHidden,
    _savedAs: elementsSavedAs,
    _default: elementsDefault
  } = elements

  if (elementsRequired !== 'atLeastOnce') {
    throw new OptionalListAttributeElementsError({ path })
  }

  if (elementsHidden !== false) {
    throw new HiddenListAttributeElementsError({ path })
  }

  if (elementsSavedAs !== undefined) {
    throw new SavedAsListAttributeElementsError({ path })
  }

  if (elementsDefault !== undefined) {
    throw new DefaultedListAttributeElementsError({ path })
  }

  validateAttribute(elements, `${path ?? ''}[n]`)
}

export class OptionalListAttributeElementsError extends Error {
  constructor({ path }: { path?: string }) {
    super(`Invalid list elements${getInfoTextForItemPath(path)}: List elements must be required`)
  }
}

export class HiddenListAttributeElementsError extends Error {
  constructor({ path }: { path?: string }) {
    super(`Invalid list elements${getInfoTextForItemPath(path)}: List elements cannot be hidden`)
  }
}

export class SavedAsListAttributeElementsError extends Error {
  constructor({ path }: { path?: string }) {
    super(
      `Invalid list elements${getInfoTextForItemPath(
        path
      )}: List elements cannot be renamed (have savedAs option)`
    )
  }
}

export class DefaultedListAttributeElementsError extends Error {
  constructor({ path }: { path?: string }) {
    super(
      `Invalid list elements${getInfoTextForItemPath(
        path
      )}: List elements cannot have default values`
    )
  }
}
