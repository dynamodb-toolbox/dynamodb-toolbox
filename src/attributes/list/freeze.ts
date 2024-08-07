import { DynamoDBToolboxError } from '~/errors/index.js'
import type { Update } from '~/types/update.js'

import { $state } from '../constants/attributeOptions.js'
import type { $elements } from '../constants/attributeOptions.js'
import type { FreezeAttribute } from '../freeze.js'
import { hasDefinedDefault } from '../shared/hasDefinedDefault.js'
import { validateAttributeProperties } from '../shared/validate.js'
import { ListAttribute } from './interface.js'
import type { $ListAttributeState } from './interface.js'
import type { ListAttributeState } from './types.js'
import type { $ListAttributeElements } from './types.js'

export type FreezeListAttribute<$LIST_ATTRIBUTE extends $ListAttributeState> =
  // Applying void Update improves type display
  Update<
    ListAttribute<$LIST_ATTRIBUTE[$state], FreezeAttribute<$LIST_ATTRIBUTE[$elements]>>,
    never,
    never
  >

type ListAttributeFreezer = <
  STATE extends ListAttributeState,
  $ELEMENTS extends $ListAttributeElements
>(
  state: STATE,
  $elements: $ELEMENTS,
  path?: string
) => FreezeListAttribute<$ListAttributeState<STATE, $ELEMENTS>>

/**
 * Freezes a warm `list` attribute
 *
 * @param elements Attribute elements
 * @param state Attribute options
 * @param path Path of the instance in the related schema (string)
 * @return void
 */
export const freezeListAttribute: ListAttributeFreezer = <
  STATE extends ListAttributeState,
  $ELEMENTS extends $ListAttributeElements
>(
  state: STATE,
  elements: $ELEMENTS,
  path?: string
): FreezeListAttribute<$ListAttributeState<STATE, $ELEMENTS>> => {
  validateAttributeProperties(state, path)

  const { required, hidden, savedAs } = elements[$state]

  if (required !== 'atLeastOnce' && required !== 'always') {
    throw new DynamoDBToolboxError('schema.listAttribute.optionalElements', {
      message: `Invalid list elements${
        path !== undefined ? ` at path '${path}'` : ''
      }: List elements must be required.`,
      path
    })
  }

  if (hidden !== false) {
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

  const frozenElements = elements.freeze(`${path ?? ''}[n]`) as FreezeAttribute<$ELEMENTS>

  return new ListAttribute({
    path,
    elements: frozenElements,
    ...state
  })
}
