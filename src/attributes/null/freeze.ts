import type { $state } from '../constants/attributeOptions.js'
import { validatePrimitiveAttribute } from '../primitive/freeze.js'
import type { $NullAttributeState } from './interface.js'
import type { NullAttribute } from './interface.js'
import { NullAttribute_ } from './interface.js'
import type { NullAttributeState } from './types.js'

export type FreezeNullAttribute<
  $NULL_ATTRIBUTE extends $NullAttributeState,
  EXTENDED extends boolean = false
> = EXTENDED extends true
  ? NullAttribute_<$NULL_ATTRIBUTE[$state]>
  : NullAttribute<$NULL_ATTRIBUTE[$state]>

type NullAttributeFreezer = <STATE extends NullAttributeState>(
  state: STATE,
  path?: string
) => FreezeNullAttribute<$NullAttributeState<STATE>, true>

/**
 * Freezes a warm `null` attribute
 *
 * @param state Attribute options
 * @param path Path of the instance in the related schema (string)
 * @return void
 */
export const freezeNullAttribute: NullAttributeFreezer = (state, path) => {
  validatePrimitiveAttribute({ type: 'null', ...state }, path)

  return new NullAttribute_({ path, ...state })
}
