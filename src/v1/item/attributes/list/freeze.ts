import { freezeAttribute, FreezeAttribute } from '../freeze'
import { validateAttributeProperties } from '../shared/validate'
import {
  $type,
  $elements,
  $required,
  $hidden,
  $key,
  $savedAs,
  $default
} from '../constants/attributeOptions'

import { _ListAttribute, ListAttribute } from './interface'

// TODO probably can be improved
export type FreezeListAttribute<_LIST_ATTRIBUTE extends _ListAttribute> = ListAttribute<{
  elements: FreezeAttribute<_LIST_ATTRIBUTE[$elements]>
  required: _LIST_ATTRIBUTE[$required]
  hidden: _LIST_ATTRIBUTE[$hidden]
  key: _LIST_ATTRIBUTE[$key]
  savedAs: _LIST_ATTRIBUTE[$savedAs]
  default: _LIST_ATTRIBUTE[$default]
}>

type ListAttributeFreezer = <_LIST_ATTRIBUTE extends _ListAttribute>(
  _listAttribute: _LIST_ATTRIBUTE,
  path: string
) => FreezeListAttribute<_LIST_ATTRIBUTE>

/**
 * Freezes a list instance
 *
 * @param _listAttribute List
 * @param path _(optional)_ Path of the instance in the related item (string)
 * @return void
 */
export const freezeListAttribute: ListAttributeFreezer = <_LIST_ATTRIBUTE extends _ListAttribute>(
  _listAttribute: _LIST_ATTRIBUTE,
  path: string
): FreezeListAttribute<_LIST_ATTRIBUTE> => {
  validateAttributeProperties(_listAttribute, path)

  const elements: _LIST_ATTRIBUTE[$elements] = _listAttribute[$elements]

  if (elements[$required] !== 'atLeastOnce') {
    throw new OptionalListAttributeElementsError({ path })
  }

  if (elements[$hidden] !== false) {
    throw new HiddenListAttributeElementsError({ path })
  }

  if (elements[$savedAs] !== undefined) {
    throw new SavedAsListAttributeElementsError({ path })
  }

  if (elements[$default] !== undefined) {
    throw new DefaultedListAttributeElementsError({ path })
  }

  const frozenElements = freezeAttribute(elements, `${path}[n]`)

  return {
    path,
    type: _listAttribute[$type],
    elements: frozenElements,
    required: _listAttribute[$required],
    hidden: _listAttribute[$hidden],
    key: _listAttribute[$key],
    savedAs: _listAttribute[$savedAs],
    default: _listAttribute[$default]
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
