import { validateAttributeProperties } from '../shared/validate'
import { freezeAttribute } from '../freeze'

import { SetAttribute, FreezeSetAttribute } from './interface'

type SetAttributeFreezer = <Attribute extends SetAttribute>(
  attribute: Attribute,
  path: string
) => FreezeSetAttribute<Attribute>

/**
 * Validates a set instance
 *
 * @param attribute SetAttribute
 * @param path _(optional)_ Path of the instance in the related item (string)
 * @return void
 */
export const freezeSetAttribute: SetAttributeFreezer = <Attribute extends SetAttribute>(
  attribute: Attribute,
  path: string
): FreezeSetAttribute<Attribute> => {
  validateAttributeProperties(attribute, path)

  const {
    _type: type,
    _required: required,
    _hidden: hidden,
    _key: key,
    _savedAs: savedAs,
    _default
  } = attribute

  const elements: Attribute['_elements'] = attribute._elements
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

  const frozenElements = freezeAttribute(elements, `${path}[x]`)

  return {
    type,
    path,
    elements: frozenElements,
    required,
    hidden,
    key,
    savedAs,
    default: _default
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
