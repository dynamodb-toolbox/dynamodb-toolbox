import { freezeAttribute } from '../freeze'
import { validateAttributeProperties } from '../shared/validate'
import {
  $type,
  $elements,
  $required,
  $hidden,
  $key,
  $savedAs,
  $default
} from '../constants/symbols'

import { _SetAttribute, FreezeSetAttribute } from './interface'

type SetAttributeFreezer = <_SET_ATTRIBUTE extends _SetAttribute>(
  _setAttribute: _SET_ATTRIBUTE,
  path: string
) => FreezeSetAttribute<_SET_ATTRIBUTE>

/**
 * Validates a set instance
 *
 * @param _setAttribute SetAttribute
 * @param path _(optional)_ Path of the instance in the related item (string)
 * @return void
 */
export const freezeSetAttribute: SetAttributeFreezer = <_SET_ATTRIBUTE extends _SetAttribute>(
  _setAttribute: _SET_ATTRIBUTE,
  path: string
): FreezeSetAttribute<_SET_ATTRIBUTE> => {
  validateAttributeProperties(_setAttribute, path)

  const elements: _SET_ATTRIBUTE[$elements] = _setAttribute[$elements]

  if (elements[$required] !== 'atLeastOnce') {
    throw new OptionalSetElementsError({ path })
  }

  if (elements[$hidden] !== false) {
    throw new HiddenSetElementsError({ path })
  }

  if (elements[$savedAs] !== undefined) {
    throw new SavedAsSetElementsError({ path })
  }

  if (elements[$default] !== undefined) {
    throw new DefaultedSetElementsError({ path })
  }

  const frozenElements = freezeAttribute(elements, `${path}[x]`)

  return {
    path,
    type: _setAttribute[$type],
    elements: frozenElements,
    required: _setAttribute[$required],
    hidden: _setAttribute[$hidden],
    key: _setAttribute[$key],
    savedAs: _setAttribute[$savedAs],
    default: _setAttribute[$default]
  }
}

export class OptionalSetElementsError extends Error {
  constructor({ path }: { path: string }) {
    super(`Invalid set elements at path ${path}: Set elements must be required`)
  }
}

export class HiddenSetElementsError extends Error {
  constructor({ path }: { path: string }) {
    super(`Invalid set elements at path ${path}: Set elements cannot be hidden`)
  }
}

export class SavedAsSetElementsError extends Error {
  constructor({ path }: { path: string }) {
    super(
      `Invalid set elements at path ${path}: Set elements cannot be renamed (have savedAs option)`
    )
  }
}

export class DefaultedSetElementsError extends Error {
  constructor({ path }: { path: string }) {
    super(`Invalid set elements at path ${path}: Set elements cannot have default values`)
  }
}
