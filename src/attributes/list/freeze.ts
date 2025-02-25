import { DynamoDBToolboxError } from '~/errors/index.js'

import { $state } from '../constants/attributeOptions.js'
import type { $elements } from '../constants/attributeOptions.js'
import type { FreezeAttribute } from '../freeze.js'
import { hasDefinedDefault } from '../shared/hasDefinedDefault.js'
import type { SharedAttributeStateConstraint } from '../shared/interface.js'
import { validateAttributeProperties } from '../shared/validate.js'
import type { ListAttribute } from './interface.js'
import { ListAttribute_ } from './interface.js'
import type { $ListAttributeState } from './interface.js'
import type { $ListAttributeElements } from './types.js'

export type FreezeListAttribute<
  $LIST_ATTRIBUTE extends $ListAttributeState,
  EXTENDED extends boolean = false
> = EXTENDED extends true
  ? ListAttribute_<$LIST_ATTRIBUTE[$state], FreezeAttribute<$LIST_ATTRIBUTE[$elements], false>>
  : ListAttribute<$LIST_ATTRIBUTE[$state], FreezeAttribute<$LIST_ATTRIBUTE[$elements], false>>

type ListAttributeFreezer = <
  STATE extends SharedAttributeStateConstraint,
  $ELEMENTS extends $ListAttributeElements
>(
  state: STATE,
  $elements: $ELEMENTS,
  path?: string
) => FreezeListAttribute<$ListAttributeState<STATE, $ELEMENTS>, true>

/**
 * Freezes a warm `list` attribute
 *
 * @param elements Attribute elements
 * @param state Attribute options
 * @param path Path of the instance in the related schema (string)
 * @return void
 */
export const freezeListAttribute: ListAttributeFreezer = <
  STATE extends SharedAttributeStateConstraint,
  $ELEMENTS extends $ListAttributeElements
>(
  state: STATE,
  elements: $ELEMENTS,
  path?: string
) => {
  validateAttributeProperties(state, path)

  const { required, hidden, savedAs } = elements[$state]

  if (required !== undefined && required !== 'atLeastOnce' && required !== 'always') {
    throw new DynamoDBToolboxError('schema.listAttribute.optionalElements', {
      message: `Invalid list elements${
        path !== undefined ? ` at path '${path}'` : ''
      }: List elements must be required.`,
      path
    })
  }

  if (hidden !== undefined && hidden !== false) {
    throw new DynamoDBToolboxError('schema.listAttribute.hiddenElements', {
      message: `Invalid list elements${
        path !== undefined ? ` at path '${path}'` : ''
      }: List elements cannot be hidden.`,
      path
    })
  }

  if (savedAs !== undefined) {
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

  const frozenElements = elements.freeze(`${path ?? ''}[n]`) as FreezeAttribute<$ELEMENTS, true>

  return new ListAttribute_({
    path,
    elements: frozenElements,
    ...state
  })
}
