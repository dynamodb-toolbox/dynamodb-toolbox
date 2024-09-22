import type { Update } from '~/types/update.js'

import type { $state } from '../constants/attributeOptions.js'
import { validatePrimitiveAttribute } from '../primitive/freeze.js'
import type { $BooleanAttributeState } from './interface.js'
import { BooleanAttribute } from './interface.js'
import type { BooleanAttributeState } from './types.js'

export type FreezeBooleanAttribute<$BOOLEAN_ATTRIBUTE extends $BooleanAttributeState> =
  // Applying void Update improves type display
  Update<BooleanAttribute<$BOOLEAN_ATTRIBUTE[$state]>, never, never>

type BooleanAttributeFreezer = <STATE extends BooleanAttributeState>(
  state: STATE,
  path?: string
) => FreezeBooleanAttribute<$BooleanAttributeState<STATE>>

/**
 * Freezes a warm `boolean` attribute
 *
 * @param state Attribute options
 * @param path Path of the instance in the related schema (string)
 * @return void
 */
export const freezeBooleanAttribute: BooleanAttributeFreezer = <
  STATE extends BooleanAttributeState
>(
  state: STATE,
  path?: string
): FreezeBooleanAttribute<$BooleanAttributeState<STATE>> => {
  validatePrimitiveAttribute({ type: 'boolean', ...state }, path)

  return new BooleanAttribute({ path, ...state })
}
