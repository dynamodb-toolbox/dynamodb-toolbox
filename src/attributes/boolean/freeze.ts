import { validatePrimitiveAttribute } from '../primitive/freeze.js'
import type { $BooleanAttributeState, BooleanAttribute } from './interface.js'
import { BooleanAttribute_ } from './interface.js'
import type { BooleanAttributeState } from './types.js'

export type FreezeBooleanAttribute<
  $BOOLEAN_ATTRIBUTE extends $BooleanAttributeState,
  EXTENDED extends boolean = false
> = EXTENDED extends true
  ? BooleanAttribute_<$BOOLEAN_ATTRIBUTE['state']>
  : BooleanAttribute<$BOOLEAN_ATTRIBUTE['state']>

type BooleanAttributeFreezer = <STATE extends BooleanAttributeState>(
  state: STATE,
  path?: string
) => FreezeBooleanAttribute<$BooleanAttributeState<STATE>, true>

/**
 * Freezes a warm `boolean` attribute
 *
 * @param state Attribute options
 * @param path Path of the instance in the related schema (string)
 * @return void
 */
export const freezeBooleanAttribute: BooleanAttributeFreezer = (state, path) => {
  validatePrimitiveAttribute({ type: 'boolean', state }, path)

  return new BooleanAttribute_({ path, ...state })
}
