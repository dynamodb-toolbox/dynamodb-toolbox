import type { O } from 'ts-toolbelt'

import { DynamoDBToolboxError } from 'v1/errors'

import { freezeAttribute, FreezeAttribute } from '../freeze'
import { validateAttributeProperties } from '../shared/validate'
import { hasDefinedDefault } from '../shared/hasDefinedDefault'
import {
  $type,
  $elements,
  $required,
  $hidden,
  $key,
  $savedAs,
  $defaults
} from '../constants/attributeOptions'

import type { $ListAttributeState, ListAttribute } from './interface'

export type FreezeListAttribute<$LIST_ATTRIBUTE extends $ListAttributeState> =
  // Applying void O.Update improves type display
  O.Update<
    ListAttribute<
      FreezeAttribute<$LIST_ATTRIBUTE[$elements]>,
      {
        required: $LIST_ATTRIBUTE[$required]
        hidden: $LIST_ATTRIBUTE[$hidden]
        key: $LIST_ATTRIBUTE[$key]
        savedAs: $LIST_ATTRIBUTE[$savedAs]
        defaults: $LIST_ATTRIBUTE[$defaults]
      }
    >,
    never,
    never
  >

type ListAttributeFreezer = <$LIST_ATTRIBUTE extends $ListAttributeState>(
  $listAttribute: $LIST_ATTRIBUTE,
  path: string
) => FreezeListAttribute<$LIST_ATTRIBUTE>

/**
 * Freezes a list instance
 *
 * @param $listAttribute List
 * @param path Path of the instance in the related schema (string)
 * @return void
 */
export const freezeListAttribute: ListAttributeFreezer = <
  $LIST_ATTRIBUTE extends $ListAttributeState
>(
  $listAttribute: $LIST_ATTRIBUTE,
  path: string
): FreezeListAttribute<$LIST_ATTRIBUTE> => {
  validateAttributeProperties($listAttribute, path)

  const elements: $LIST_ATTRIBUTE[$elements] = $listAttribute[$elements]

  if (elements[$required] !== 'atLeastOnce' && elements[$required] !== 'always') {
    throw new DynamoDBToolboxError('schema.listAttribute.optionalElements', {
      message: `Invalid list elements at path ${path}: List elements must be required`,
      path
    })
  }

  if (elements[$hidden] !== false) {
    throw new DynamoDBToolboxError('schema.listAttribute.hiddenElements', {
      message: `Invalid list elements at path ${path}: List elements cannot be hidden`,
      path
    })
  }

  if (elements[$savedAs] !== undefined) {
    throw new DynamoDBToolboxError('schema.listAttribute.savedAsElements', {
      message: `Invalid list elements at path ${path}: List elements cannot be renamed (have savedAs option)`,
      path
    })
  }

  if (hasDefinedDefault(elements)) {
    throw new DynamoDBToolboxError('schema.listAttribute.defaultedElements', {
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
    defaults: $listAttribute[$defaults]
  }
}
