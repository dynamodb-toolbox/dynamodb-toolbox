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

import { $ListAttribute, ListAttribute } from './interface'

export type FreezeListAttribute<$LIST_ATTRIBUTE extends $ListAttribute> = ListAttribute<
  FreezeAttribute<$LIST_ATTRIBUTE[$elements]>,
  {
    required: $LIST_ATTRIBUTE[$required]
    hidden: $LIST_ATTRIBUTE[$hidden]
    key: $LIST_ATTRIBUTE[$key]
    savedAs: $LIST_ATTRIBUTE[$savedAs]
    default: $LIST_ATTRIBUTE[$default]
  }
>

type ListAttributeFreezer = <$LIST_ATTRIBUTE extends $ListAttribute>(
  $listAttribute: $LIST_ATTRIBUTE,
  path: string
) => FreezeListAttribute<$LIST_ATTRIBUTE>

/**
 * Freezes a list instance
 *
 * @param $listAttribute List
 * @param path _(optional)_ Path of the instance in the related item (string)
 * @return void
 */
export const freezeListAttribute: ListAttributeFreezer = <$LIST_ATTRIBUTE extends $ListAttribute>(
  $listAttribute: $LIST_ATTRIBUTE,
  path: string
): FreezeListAttribute<$LIST_ATTRIBUTE> => {
  validateAttributeProperties($listAttribute, path)

  const elements: $LIST_ATTRIBUTE[$elements] = $listAttribute[$elements]

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
    type: $listAttribute[$type],
    elements: frozenElements,
    required: $listAttribute[$required],
    hidden: $listAttribute[$hidden],
    key: $listAttribute[$key],
    savedAs: $listAttribute[$savedAs],
    default: $listAttribute[$default]
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
