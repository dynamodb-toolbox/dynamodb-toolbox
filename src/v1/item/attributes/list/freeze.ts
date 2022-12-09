import { validateAttributeProperties } from '../shared/validate'
import { freezeAttribute } from '../freeze'

import type { _ListAttribute, FreezeListAttribute } from './interface'

type ListAttributeFreezer = <Attribute extends _ListAttribute>(
  attribute: Attribute,
  path: string
) => FreezeListAttribute<Attribute>

/**
 * Freezes a list instance
 *
 * @param attribute List
 * @param path _(optional)_ Path of the instance in the related item (string)
 * @return void
 */
export const freezeListAttribute: ListAttributeFreezer = <Attribute extends _ListAttribute>(
  attribute: Attribute,
  path: string
): FreezeListAttribute<Attribute> => {
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

  const frozenElements = freezeAttribute(elements, `${path}[n]`)

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

export class OptionalListAttributeElementsError extends Error {
  constructor({ path }: { path: string }) {
    super(`Invalid list elements at path ${path}: List elements must be required`)
  }
}

export class HiddenListAttributeElementsError extends Error {
  constructor({ path }: { path: string }) {
    super(`Invalid list elements at path ${path}: List elements cannot be hidden`)
  }
}

export class SavedAsListAttributeElementsError extends Error {
  constructor({ path }: { path: string }) {
    super(
      `Invalid list elements at path ${path}: List elements cannot be renamed (have savedAs option)`
    )
  }
}

export class DefaultedListAttributeElementsError extends Error {
  constructor({ path }: { path: string }) {
    super(`Invalid list elements at path ${path}: List elements cannot have default values`)
  }
}
