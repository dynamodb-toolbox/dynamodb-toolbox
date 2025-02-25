import type { $state } from '../constants/attributeOptions.js'
import { validateAttributeProperties } from '../shared/validate.js'
import type { AnyAttribute } from './interface.js'
import { AnyAttribute_ } from './interface.js'
import type { $AnyAttributeState } from './interface.js'
import type { AnyAttributeStateConstraint } from './types.js'

export type FreezeAnyAttribute<
  $ANY_ATTRIBUTE extends $AnyAttributeState,
  EXTENDED extends boolean = false
> = EXTENDED extends true
  ? AnyAttribute_<$ANY_ATTRIBUTE[$state]>
  : AnyAttribute<$ANY_ATTRIBUTE[$state]>

type AnyAttributeFreezer = <STATE extends AnyAttributeStateConstraint>(
  state: STATE,
  path?: string
) => FreezeAnyAttribute<$AnyAttributeState<STATE>, true>

/**
 * Validates a warm `any` attribute
 *
 * @param state Attribute options
 * @param path Path of the instance in the related schema (string)
 * @return void
 */
export const freezeAnyAttribute: AnyAttributeFreezer = (state, path) => {
  validateAttributeProperties(state, path)

  return new AnyAttribute_({ path, ...state })
}
