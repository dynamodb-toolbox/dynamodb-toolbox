import type { Update } from '~/types/update.js'

import type { $state } from '../constants/attributeOptions.js'
import { validatePrimitiveAttribute } from '../primitive/freeze.js'
import type { $NullAttributeState } from './interface.js'
import { NullAttribute } from './interface.js'
import type { NullAttributeState } from './types.js'

export type FreezeNullAttribute<$NULL_ATTRIBUTE extends $NullAttributeState> =
  // Applying void Update improves type display
  Update<NullAttribute<$NULL_ATTRIBUTE[$state]>, never, never>

type NullAttributeFreezer = <STATE extends NullAttributeState>(
  state: STATE,
  path?: string
) => FreezeNullAttribute<$NullAttributeState<STATE>>

/**
 * Freezes a warm `null` attribute
 *
 * @param state Attribute options
 * @param path Path of the instance in the related schema (string)
 * @return void
 */
export const freezeNullAttribute: NullAttributeFreezer = <STATE extends NullAttributeState>(
  state: STATE,
  path?: string
): FreezeNullAttribute<$NullAttributeState<STATE>> => {
  validatePrimitiveAttribute({ type: 'null', ...state }, path)

  return new NullAttribute({ path, ...state })
}
