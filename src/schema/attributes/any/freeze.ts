import type { O } from 'ts-toolbelt'

import {
  $castAs,
  $defaults,
  $hidden,
  $key,
  $links,
  $required,
  $savedAs
} from '../constants/attributeOptions.js'
import { validateAttributeProperties } from '../shared/validate.js'
import { $AnyAttributeState, AnyAttribute } from './interface.js'
import type { AnyAttributeState } from './types.js'

export type FreezeAnyAttribute<$ANY_ATTRIBUTE extends $AnyAttributeState> =
  // Applying void O.Update improves type display
  O.Update<
    AnyAttribute<{
      required: $ANY_ATTRIBUTE[$required]
      hidden: $ANY_ATTRIBUTE[$hidden]
      key: $ANY_ATTRIBUTE[$key]
      savedAs: $ANY_ATTRIBUTE[$savedAs]
      defaults: $ANY_ATTRIBUTE[$defaults]
      links: $ANY_ATTRIBUTE[$links]
      castAs: $ANY_ATTRIBUTE[$castAs]
    }>,
    never,
    never
  >

type AnyAttributeFreezer = <STATE extends AnyAttributeState>(
  anyAttribute: STATE,
  path?: string
) => FreezeAnyAttribute<$AnyAttributeState<STATE>>

/**
 * Validates a warm `any` attribute
 *
 * @param state Attribute options
 * @param path Path of the instance in the related schema (string)
 * @return void
 */
export const freezeAnyAttribute: AnyAttributeFreezer = <STATE extends AnyAttributeState>(
  state: STATE,
  path?: string
) => {
  validateAttributeProperties(state, path)

  return new AnyAttribute({ path, ...state })
}
