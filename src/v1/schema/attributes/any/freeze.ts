import type { O } from 'ts-toolbelt'

import { validateAttributeProperties } from '../shared/validate'
import {
  $type,
  $required,
  $hidden,
  $key,
  $savedAs,
  $defaults,
  $castAs
} from '../constants/attributeOptions'

import type { $AnyAttributeState, AnyAttribute } from './interface'

export type FreezeAnyAttribute<$ANY_ATTRIBUTE extends $AnyAttributeState> =
  // Applying void O.Update improves type display
  O.Update<
    AnyAttribute<{
      required: $ANY_ATTRIBUTE[$required]
      hidden: $ANY_ATTRIBUTE[$hidden]
      key: $ANY_ATTRIBUTE[$key]
      savedAs: $ANY_ATTRIBUTE[$savedAs]
      defaults: $ANY_ATTRIBUTE[$defaults]
      castAs: $ANY_ATTRIBUTE[$castAs]
    }>,
    never,
    never
  >

type AnyAttributeFreezer = <$ANY_ATTRIBUTE extends $AnyAttributeState>(
  $anyAttribute: $ANY_ATTRIBUTE,
  path: string
) => FreezeAnyAttribute<$ANY_ATTRIBUTE>

/**
 * Validates an any instance
 *
 * @param $anyAttribute Any
 * @param path Path of the instance in the related schema (string)
 * @return void
 */
export const freezeAnyAttribute: AnyAttributeFreezer = <$ANY_ATTRIBUTE extends $AnyAttributeState>(
  $anyAttribute: $ANY_ATTRIBUTE,
  path: string
) => {
  validateAttributeProperties($anyAttribute, path)

  return {
    path,
    type: $anyAttribute[$type],
    required: $anyAttribute[$required],
    hidden: $anyAttribute[$hidden],
    key: $anyAttribute[$key],
    savedAs: $anyAttribute[$savedAs],
    defaults: $anyAttribute[$defaults],
    castAs: $anyAttribute[$castAs]
  }
}
