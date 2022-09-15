import { getPathMessage } from 'v1/errors/getPathMessage'

import { validatePropertyState } from '../property/validate'
import { validateProperty } from '../validate'

import type { List } from './interface'

export class OptionalListElementsError extends Error {
  constructor({ path }: { path?: string }) {
    super(`Invalid list elements${getPathMessage(path)}: List elements must be required`)
  }
}

export class HiddenListElementsError extends Error {
  constructor({ path }: { path?: string }) {
    super(`Invalid list elements${getPathMessage(path)}: List elements cannot be hidden`)
  }
}

export class SavedAsListElementsError extends Error {
  constructor({ path }: { path?: string }) {
    super(
      `Invalid list elements${getPathMessage(
        path
      )}: List elements cannot be renamed (have savedAs option)`
    )
  }
}

export class DefaultedListElementsError extends Error {
  constructor({ path }: { path?: string }) {
    super(`Invalid list elements${getPathMessage(path)}: List elements cannot have default values`)
  }
}

/**
 * Validates a list instance
 *
 * @param listInstance List
 * @param path _(optional)_ Path of the instance in the related item (string)
 * @return void
 */
export const validateList = <L extends List>(
  { _elements: elements, ...listInstance }: L,
  path?: string
): void => {
  validatePropertyState(listInstance, path)

  const {
    _required: elementsRequired,
    _hidden: elementsHidden,
    _key: elementsKey,
    _savedAs: elementsSavedAs,
    _default: elementsDefault
  } = elements

  if (elementsRequired !== 'atLeastOnce') {
    throw new OptionalListElementsError({ path })
  }

  if (elementsHidden !== false) {
    throw new HiddenListElementsError({ path })
  }

  if (elementsSavedAs !== undefined) {
    throw new SavedAsListElementsError({ path })
  }

  if (elementsDefault !== undefined) {
    throw new DefaultedListElementsError({ path })
  }

  validateProperty(elements, `${path ?? ''}[n]`)
}
