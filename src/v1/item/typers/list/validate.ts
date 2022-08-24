import { AtLeastOnce } from '../constants/requiredOptions'
import { errorMessagePathSuffix, validateProperty } from '../validate'

import type { List } from './interface'

export class OptionalListElementsError extends Error {
  constructor({ path }: { path?: string }) {
    super(`Invalid list elements${errorMessagePathSuffix(path)}: List elements must be required`)
  }
}

export class HiddenListElementsError extends Error {
  constructor({ path }: { path?: string }) {
    super(`Invalid list elements${errorMessagePathSuffix(path)}: List elements cannot be hidden`)
  }
}

export class KeyListElementsError extends Error {
  constructor({ path }: { path?: string }) {
    super(
      `Invalid list elements${errorMessagePathSuffix(path)}: List elements cannot be part of key`
    )
  }
}

export class SavedAsListElementsError extends Error {
  constructor({ path }: { path?: string }) {
    super(
      `Invalid list elements${errorMessagePathSuffix(
        path
      )}: List elements cannot be renamed (have savedAs option)`
    )
  }
}

export class DefaultedListElementsError extends Error {
  constructor({ path }: { path?: string }) {
    super(
      `Invalid list elements${errorMessagePathSuffix(
        path
      )}: List elements cannot have default values`
    )
  }
}

/**
 * Validates a list instance
 *
 * @param listInstance List
 * @param path _(optional)_ Path of the instance in the related item (string)
 * @return Boolean
 */
export const validateList = <L extends List>(
  { _elements: elements }: L,
  path?: string
): boolean => {
  // TODO: Validate common attributes (_required, _key etc...)

  const {
    _required: elementsRequired,
    _hidden: elementsHidden,
    _key: elementsKey,
    _savedAs: elementsSavedAs,
    _default: elementsDefault
  } = elements

  if (elementsRequired !== AtLeastOnce) {
    throw new OptionalListElementsError({ path })
  }

  if (elementsHidden !== false) {
    throw new HiddenListElementsError({ path })
  }

  if (elementsKey !== false) {
    throw new KeyListElementsError({ path })
  }

  if (elementsSavedAs !== undefined) {
    throw new SavedAsListElementsError({ path })
  }

  if (elementsDefault !== undefined) {
    throw new DefaultedListElementsError({ path })
  }

  return validateProperty(elements, `${path ?? ''}[n]`)
}
