import type { Update } from '~/types/update.js'

import type { $state } from '../constants/attributeOptions.js'
import { validatePrimitiveAttribute } from '../primitive/freeze.js'
import type { $NumberAttributeState } from './interface.js'
import { NumberAttribute } from './interface.js'
import type { NumberAttributeState } from './types.js'

export type FreezeNumberAttribute<$NUMBER_ATTRIBUTE extends $NumberAttributeState> =
  // Applying void Update improves type display
  Update<NumberAttribute<$NUMBER_ATTRIBUTE[$state]>, never, never>

type NumberAttributeFreezer = <STATE extends NumberAttributeState>(
  state: STATE,
  path?: string
) => FreezeNumberAttribute<$NumberAttributeState<STATE>>

/**
 * Freezes a warm `number` attribute
 *
 * @param state Attribute options
 * @param path Path of the instance in the related schema (string)
 * @return void
 */
export const freezeNumberAttribute: NumberAttributeFreezer = <STATE extends NumberAttributeState>(
  state: STATE,
  path?: string
): FreezeNumberAttribute<$NumberAttributeState<STATE>> => {
  validatePrimitiveAttribute({ type: 'number', ...state }, path)

  return new NumberAttribute({ path, ...state })
}
