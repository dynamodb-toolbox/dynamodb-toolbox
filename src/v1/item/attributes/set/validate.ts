import { getInfoTextForItemPath } from 'v1/errors/getInfoTextForItemPath'

import { validateAttributeProperties } from '../shared/validate'
import { validateAttribute } from '../validate'

import type { SetAttribute } from './interface'

/**
 * Validates a set instance
 *
 * @param setInstance SetAttribute
 * @param path _(optional)_ Path of the instance in the related item (string)
 * @return void
 */
export const validateSetAttribute = <SetInput extends SetAttribute>(
  setInstance: SetInput,
  path?: string
): void => {
  validateAttributeProperties(setInstance, path)

  const { _elements: elements } = setInstance

  const {
    _required: elementsRequired,
    _hidden: elementsHidden,
    _savedAs: elementsSavedAs,
    _default: elementsDefault
  } = elements

  if (elementsRequired !== 'atLeastOnce') {
    throw new OptionalSetElementsError({ path })
  }

  if (elementsHidden !== false) {
    throw new HiddenSetElementsError({ path })
  }

  if (elementsSavedAs !== undefined) {
    throw new SavedAsSetElementsError({ path })
  }

  if (elementsDefault !== undefined) {
    throw new DefaultedSetElementsError({ path })
  }

  validateAttribute(elements, `${path ?? ''}[n]`)
}

export class OptionalSetElementsError extends Error {
  constructor({ path }: { path?: string }) {
    super(`Invalid set elements${getInfoTextForItemPath(path)}: Set elements must be required`)
  }
}

export class HiddenSetElementsError extends Error {
  constructor({ path }: { path?: string }) {
    super(`Invalid set elements${getInfoTextForItemPath(path)}: Set elements cannot be hidden`)
  }
}

export class SavedAsSetElementsError extends Error {
  constructor({ path }: { path?: string }) {
    super(
      `Invalid set elements${getInfoTextForItemPath(
        path
      )}: Set elements cannot be renamed (have savedAs option)`
    )
  }
}

export class DefaultedSetElementsError extends Error {
  constructor({ path }: { path?: string }) {
    super(
      `Invalid set elements${getInfoTextForItemPath(path)}: Set elements cannot have default values`
    )
  }
}
