import type { $state } from '../constants/attributeOptions.js'
import { validatePrimitiveAttribute } from '../primitive/freeze.js'
import type { $BinaryAttributeState } from './interface.js'
import type { BinaryAttribute } from './interface.js'
import { BinaryAttribute_ } from './interface.js'
import type { BinaryAttributeStateConstraint } from './types.js'

export type FreezeBinaryAttribute<
  $BINARY_ATTRIBUTE extends $BinaryAttributeState,
  EXTENDED extends boolean = false
> = EXTENDED extends true
  ? BinaryAttribute_<$BINARY_ATTRIBUTE[$state]>
  : BinaryAttribute<$BINARY_ATTRIBUTE[$state]>

type BinaryAttributeFreezer = <STATE extends BinaryAttributeStateConstraint>(
  state: STATE,
  path?: string
) => FreezeBinaryAttribute<$BinaryAttributeState<STATE>, true>

/**
 * Freezes a warm `number` attribute
 *
 * @param state Attribute options
 * @param path Path of the instance in the related schema (string)
 * @return void
 */
export const freezeBinaryAttribute: BinaryAttributeFreezer = (state, path) => {
  validatePrimitiveAttribute({ type: 'binary', state }, path)

  return new BinaryAttribute_({ path, ...state })
}
