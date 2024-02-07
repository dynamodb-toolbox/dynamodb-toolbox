import type { ComputeObject } from 'v1/types'
import { DynamoDBToolboxError } from 'v1/errors'

import type { FreezeAttribute } from '../types'
import { validateAttributeProperties } from '../shared/validate'
import { hasDefinedDefault } from '../shared/hasDefinedDefault'
import {
  $elements,
  $required,
  $hidden,
  $key,
  $savedAs,
  $defaults,
  $links
} from '../constants/attributeOptions'

import type { SharedAttributeState } from '../shared/interface'
import type { $ListAttributeState, MegaListAttribute } from './interface'
import type { $ListAttributeElements } from './types'

export type FreezeListAttribute<$LIST_ATTRIBUTE extends $ListAttributeState> = ComputeObject<
  MegaListAttribute<
    FreezeAttribute<$LIST_ATTRIBUTE[$elements]>,
    {
      required: $LIST_ATTRIBUTE[$required]
      hidden: $LIST_ATTRIBUTE[$hidden]
      key: $LIST_ATTRIBUTE[$key]
      savedAs: $LIST_ATTRIBUTE[$savedAs]
      defaults: $LIST_ATTRIBUTE[$defaults]
      links: $LIST_ATTRIBUTE[$links]
    }
  >
>

type ListAttributeFreezer = <
  $ELEMENTS extends $ListAttributeElements,
  STATE extends SharedAttributeState
>(
  $elements: $ELEMENTS,
  state: STATE,
  path: string
) => FreezeListAttribute<$ListAttributeState<$ELEMENTS, STATE>>

/**
 * Freezes a warm `list` attribute
 *
 * @param elements Attribute elements
 * @param state Attribute options
 * @param path Path of the instance in the related schema (string)
 * @return void
 */
export const freezeListAttribute: ListAttributeFreezer = <
  $ELEMENTS extends $ListAttributeElements,
  STATE extends SharedAttributeState
>(
  elements: $ELEMENTS,
  state: STATE,
  path: string
): FreezeListAttribute<$ListAttributeState<$ELEMENTS, STATE>> => {
  validateAttributeProperties(state, path)

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
      message: `Invalid list elements at path ${path}: List elements cannot have default or linked values`,
      path
    })
  }

  const frozenElements = elements.freeze(`${path}[n]`) as FreezeAttribute<$ELEMENTS>

  return {
    path,
    type: 'list',
    elements: frozenElements,
    // TODO
    parse: input => input as any,
    ...state
  }
}
