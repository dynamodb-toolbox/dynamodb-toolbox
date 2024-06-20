import type { O } from 'ts-toolbelt'

import { DynamoDBToolboxError } from '~/errors/index.js'

import type { FreezeAttribute } from '../freeze.js'
import { validateAttributeProperties } from '../shared/validate.js'
import { hasDefinedDefault } from '../shared/hasDefinedDefault.js'
import {
  $elements,
  $required,
  $hidden,
  $key,
  $savedAs,
  $defaults,
  $links
} from '../constants/attributeOptions.js'

import type { SharedAttributeState } from '../shared/interface.js'
import type { $ListAttributeElements } from './types.js'
import { $ListAttributeState, ListAttribute } from './interface.js'

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
        links: $LIST_ATTRIBUTE[$links]
      }
    >,
    never,
    never
  >

type ListAttributeFreezer = <
  $ELEMENTS extends $ListAttributeElements,
  STATE extends SharedAttributeState
>(
  $elements: $ELEMENTS,
  state: STATE,
  path?: string
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
  path?: string
): FreezeListAttribute<$ListAttributeState<$ELEMENTS, STATE>> => {
  validateAttributeProperties(state, path)

  if (elements[$required] !== 'atLeastOnce' && elements[$required] !== 'always') {
    throw new DynamoDBToolboxError('schema.listAttribute.optionalElements', {
      message: `Invalid list elements${
        path !== undefined ? ` at path '${path}'` : ''
      }: List elements must be required.`,
      path
    })
  }

  if (elements[$hidden] !== false) {
    throw new DynamoDBToolboxError('schema.listAttribute.hiddenElements', {
      message: `Invalid list elements${
        path !== undefined ? ` at path '${path}'` : ''
      }: List elements cannot be hidden.`,
      path
    })
  }

  if (elements[$savedAs] !== undefined) {
    throw new DynamoDBToolboxError('schema.listAttribute.savedAsElements', {
      message: `Invalid list elements at path ${
        path !== undefined ? ` at path '${path}'` : ''
      }: List elements cannot be renamed (have savedAs option).`,
      path
    })
  }

  if (hasDefinedDefault(elements)) {
    throw new DynamoDBToolboxError('schema.listAttribute.defaultedElements', {
      message: `Invalid list elements${
        path !== undefined ? ` at path '${path}'` : ''
      }: List elements cannot have default or linked values.`,
      path
    })
  }

  const frozenElements = elements.freeze(`${path ?? ''}[n]`) as FreezeAttribute<$ELEMENTS>

  return new ListAttribute({
    path,
    elements: frozenElements,
    ...state
  })
}
