import { DynamoDBToolboxError } from '~/errors/index.js'
import type { Update } from '~/types/update.js'

import { $state } from '../constants/attributeOptions.js'
import type { $elements } from '../constants/attributeOptions.js'
import type { FreezeAttribute } from '../freeze.js'
import { hasDefinedDefault } from '../shared/hasDefinedDefault.js'
import type { SharedAttributeState } from '../shared/interface.js'
import { validateAttributeProperties } from '../shared/validate.js'
import { SetAttribute } from './interface.js'
import type { $SetAttributeState } from './interface.js'
import type { $SetAttributeElements } from './types.js'

export type FreezeSetAttribute<$SET_ATTRIBUTE extends $SetAttributeState> =
  // Applying void Update improves type display
  Update<
    SetAttribute<$SET_ATTRIBUTE[$state], FreezeAttribute<$SET_ATTRIBUTE[$elements]>>,
    never,
    never
  >

type SetAttributeFreezer = <
  STATE extends SharedAttributeState,
  $ELEMENTS extends $SetAttributeElements
>(
  state: STATE,
  $elements: $ELEMENTS,
  path?: string
) => FreezeSetAttribute<$SetAttributeState<STATE, $ELEMENTS>>

/**
 * Validates a set instance
 *
 * @param state Attribute options
 * @param elements Attribute elements
 * @param path Path of the instance in the related schema (string)
 * @return void
 */
export const freezeSetAttribute: SetAttributeFreezer = <
  STATE extends SharedAttributeState,
  $ELEMENTS extends $SetAttributeElements
>(
  state: STATE,
  elements: $ELEMENTS,
  path?: string
): FreezeSetAttribute<$SetAttributeState<STATE, $ELEMENTS>> => {
  validateAttributeProperties(state, path)

  const { required, hidden, savedAs } = elements[$state]

  if (required !== 'atLeastOnce') {
    throw new DynamoDBToolboxError('schema.setAttribute.optionalElements', {
      message: `Invalid set elements${
        path !== undefined ? ` at path '${path}'` : ''
      }: Set elements must be required.`,
      path
    })
  }

  if (hidden !== false) {
    throw new DynamoDBToolboxError('schema.setAttribute.hiddenElements', {
      message: `Invalid set elements${
        path !== undefined ? ` at path '${path}'` : ''
      }: Set elements cannot be hidden.`,
      path
    })
  }

  if (savedAs !== undefined) {
    throw new DynamoDBToolboxError('schema.setAttribute.savedAsElements', {
      message: `Invalid set elements${
        path !== undefined ? ` at path '${path}'` : ''
      }: Set elements cannot be renamed (have savedAs option).`,
      path
    })
  }

  if (hasDefinedDefault(elements)) {
    throw new DynamoDBToolboxError('schema.setAttribute.defaultedElements', {
      message: `Invalid set elements${
        path !== undefined ? ` at path '${path}'` : ''
      }: Set elements cannot have default or linked values.`,
      path
    })
  }

  const frozenElements = elements.freeze(`${path ?? ''}[x]`) as FreezeAttribute<$ELEMENTS>

  return new SetAttribute({ path, elements: frozenElements, ...state })
}
