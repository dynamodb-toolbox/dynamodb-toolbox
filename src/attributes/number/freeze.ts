import type { $state } from '../constants/attributeOptions.js'
import { validatePrimitiveAttribute } from '../primitive/freeze.js'
import type { $NumberAttributeState, NumberAttribute } from './interface.js'
import { NumberAttribute_ } from './interface.js'
import type { NumberAttributeStateConstraint } from './types.js'

export type FreezeNumberAttribute<
  $NUMBER_ATTRIBUTE extends $NumberAttributeState,
  EXTENDED extends boolean = false
> = EXTENDED extends true
  ? NumberAttribute_<$NUMBER_ATTRIBUTE[$state]>
  : NumberAttribute<$NUMBER_ATTRIBUTE[$state]>

type NumberAttributeFreezer = <STATE extends NumberAttributeStateConstraint>(
  state: STATE,
  path?: string
) => FreezeNumberAttribute<$NumberAttributeState<STATE>, true>

/**
 * Freezes a warm `number` attribute
 *
 * @param state Attribute options
 * @param path Path of the instance in the related schema (string)
 * @return void
 */
export const freezeNumberAttribute: NumberAttributeFreezer = (state, path) => {
  validatePrimitiveAttribute({ type: 'number', state }, path)

  return new NumberAttribute_({ path, ...state })
}
