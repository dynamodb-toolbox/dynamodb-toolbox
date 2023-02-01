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

import type { $SetAttribute, SetAttribute } from './interface'

export type FreezeSetAttribute<$SET_ATTRIBUTE extends $SetAttribute> = SetAttribute<
  FreezeAttribute<$SET_ATTRIBUTE[$elements]>,
  {
    required: $SET_ATTRIBUTE[$required]
    hidden: $SET_ATTRIBUTE[$hidden]
    key: $SET_ATTRIBUTE[$key]
    savedAs: $SET_ATTRIBUTE[$savedAs]
    default: $SET_ATTRIBUTE[$default]
  }
>

type SetAttributeFreezer = <$SET_ATTRIBUTE extends $SetAttribute>(
  $setAttribute: $SET_ATTRIBUTE,
  path: string
) => FreezeSetAttribute<$SET_ATTRIBUTE>

/**
 * Validates a set instance
 *
 * @param $setAttribute SetAttribute
 * @param path _(optional)_ Path of the instance in the related item (string)
 * @return void
 */
export const freezeSetAttribute: SetAttributeFreezer = <$SET_ATTRIBUTE extends $SetAttribute>(
  $setAttribute: $SET_ATTRIBUTE,
  path: string
): FreezeSetAttribute<$SET_ATTRIBUTE> => {
  validateAttributeProperties($setAttribute, path)

  const elements: $SET_ATTRIBUTE[$elements] = $setAttribute[$elements]

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
    type: $setAttribute[$type],
    elements: frozenElements,
    required: $setAttribute[$required],
    hidden: $setAttribute[$hidden],
    key: $setAttribute[$key],
    savedAs: $setAttribute[$savedAs],
    default: $setAttribute[$default]
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
