import type { O } from 'ts-toolbelt'

import { validateAttributeProperties } from '../shared/validate'
import {
  $required,
  $hidden,
  $key,
  $savedAs,
  $defaults,
  $links,
  $castAs
} from '../constants/attributeOptions'

import type { $AnyAttributeState, AnyAttribute } from './interface'
import type { AnyAttributeState } from './types'

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
  path: string
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
  path: string
) => {
  validateAttributeProperties(state, path)

  return { path, type: 'any', ...state }
}
