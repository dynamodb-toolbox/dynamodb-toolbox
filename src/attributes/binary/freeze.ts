import type { Update } from '~/types/update.js'

import type { $state } from '../constants/attributeOptions.js'
import { validatePrimitiveAttribute } from '../primitive/freeze.js'
import type { $BinaryAttributeState } from './interface.js'
import { BinaryAttribute } from './interface.js'
import type { BinaryAttributeState } from './types.js'

export type FreezeBinaryAttribute<$BINARY_ATTRIBUTE extends $BinaryAttributeState> =
  // Applying void Update improves type display
  Update<BinaryAttribute<$BINARY_ATTRIBUTE[$state]>, never, never>

type BinaryAttributeFreezer = <STATE extends BinaryAttributeState>(
  state: STATE,
  path?: string
) => FreezeBinaryAttribute<$BinaryAttributeState<STATE>>

/**
 * Freezes a warm `number` attribute
 *
 * @param state Attribute options
 * @param path Path of the instance in the related schema (string)
 * @return void
 */
export const freezeBinaryAttribute: BinaryAttributeFreezer = <STATE extends BinaryAttributeState>(
  state: STATE,
  path?: string
): FreezeBinaryAttribute<$BinaryAttributeState<STATE>> => {
  validatePrimitiveAttribute({ type: 'binary', ...state }, path)

  return new BinaryAttribute({ path, ...state })
}
