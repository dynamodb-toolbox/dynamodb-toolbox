import type { O } from 'ts-toolbelt'

import { DynamoDBToolboxError } from 'v1/errors'

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

import type { $ListAttribute, ListAttribute } from './interface'

export type FreezeListAttribute<$LIST_ATTRIBUTE extends $ListAttribute> =
  // Applying void O.Update improves type display
  O.Update<
    ListAttribute<
      FreezeAttribute<$LIST_ATTRIBUTE[$elements]>,
      {
        required: $LIST_ATTRIBUTE[$required]
        hidden: $LIST_ATTRIBUTE[$hidden]
        key: $LIST_ATTRIBUTE[$key]
        savedAs: $LIST_ATTRIBUTE[$savedAs]
        default: $LIST_ATTRIBUTE[$default]
      }
    >,
    never,
    never
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
    throw new DynamoDBToolboxError('optionalListAttributeElements', {
      message: `Invalid list elements at path ${path}: List elements must be required`,
      path
    })
  }

  if (elements[$hidden] !== false) {
    throw new DynamoDBToolboxError('hiddenListAttributeElements', {
      message: `Invalid list elements at path ${path}: List elements cannot be hidden`,
      path
    })
  }

  if (elements[$savedAs] !== undefined) {
    throw new DynamoDBToolboxError('savedAsListAttributeElements', {
      message: `Invalid list elements at path ${path}: List elements cannot be renamed (have savedAs option)`,
      path
    })
  }

  if (elements[$default] !== undefined) {
    throw new DynamoDBToolboxError('defaultedListAttributeElements', {
      message: `Invalid list elements at path ${path}: List elements cannot have default values`,
      path
    })
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
