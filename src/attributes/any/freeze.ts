import type { $state } from '../constants/attributeOptions.js'
import { validateAttributeProperties } from '../shared/validate.js'
import { AnyAttribute } from './interface.js'
import type { $AnyAttributeState } from './interface.js'
import type { AnyAttributeState } from './types.js'

export type FreezeAnyAttribute<$ANY_ATTRIBUTE extends $AnyAttributeState> =
  // '& {}' Improves type display
  AnyAttribute<$ANY_ATTRIBUTE[$state]> & {}

type AnyAttributeFreezer = <STATE extends AnyAttributeState>(
  state: STATE,
  path?: string
) => AnyAttribute<STATE>

/**
 * Validates a warm `any` attribute
 *
 * @param state Attribute options
 * @param path Path of the instance in the related schema (string)
 * @return void
 */
export const freezeAnyAttribute: AnyAttributeFreezer = (state, path) => {
  validateAttributeProperties(state, path)

  return new AnyAttribute({ path, ...state })
}
