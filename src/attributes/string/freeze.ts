import type { $state } from '../constants/attributeOptions.js'
import { validatePrimitiveAttribute } from '../primitive/freeze.js'
import type { $StringAttributeState } from './interface.js'
import type { StringAttribute } from './interface.js'
import { StringAttribute_ } from './interface.js'
import type { StringAttributeStateConstraint } from './types.js'

export type FreezeStringAttribute<
  $STRING_ATTRIBUTE extends $StringAttributeState,
  EXTENDED extends boolean = false
> = EXTENDED extends true
  ? StringAttribute_<$STRING_ATTRIBUTE[$state]>
  : StringAttribute<$STRING_ATTRIBUTE[$state]>

type StringAttributeFreezer = <STATE extends StringAttributeStateConstraint>(
  state: STATE,
  path?: string
) => FreezeStringAttribute<$StringAttributeState<STATE>, true>

/**
 * Freezes a warm `string` attribute
 *
 * @param state Attribute options
 * @param path Path of the instance in the related schema (string)
 * @return void
 */
export const freezeStringAttribute: StringAttributeFreezer = (state, path) => {
  validatePrimitiveAttribute({ type: 'string', state }, path)

  return new StringAttribute_({ path, ...state })
}
