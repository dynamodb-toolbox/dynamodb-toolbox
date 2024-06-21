import type { O } from 'ts-toolbelt'

import { $state } from '../constants/attributeOptions.js'
import { validateAttributeProperties } from '../shared/validate.js'
import { $AnyAttributeState, AnyAttribute } from './interface.js'
import type { AnyAttributeState } from './types.js'

export type FreezeAnyAttribute<$ANY_ATTRIBUTE extends $AnyAttributeState> =
  // Applying void O.Update improves type display
  O.Update<AnyAttribute<$ANY_ATTRIBUTE[$state]>, never, never>

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
