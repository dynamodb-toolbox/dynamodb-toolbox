import type { O } from 'ts-toolbelt'

import { validateAttributeProperties } from '../shared/validate'
import {
  $type,
  $required,
  $hidden,
  $key,
  $savedAs,
  $default,
  AttributeOptionNameSymbol
} from '../constants/attributeOptions'

import type { $AnyAttribute, AnyAttributeStateConstraint, AnyAttribute } from './interface'

export type FreezeAnyAttribute<$ANY_ATTRIBUTE extends $AnyAttribute> =
  // Applying void O.Update improves type display
  O.Update<
    AnyAttribute<
      { [KEY in keyof AnyAttributeStateConstraint]: $ANY_ATTRIBUTE[AttributeOptionNameSymbol[KEY]] }
    >,
    never,
    never
  >

type AnyAttributeFreezer = <$ANY_ATTRIBUTE extends $AnyAttribute>(
  _anyAttribute: $ANY_ATTRIBUTE,
  path: string
) => FreezeAnyAttribute<$ANY_ATTRIBUTE>

/**
 * Validates an any instance
 *
 * @param $anyAttribute Any
 * @param path Path of the instance in the related item (string)
 * @return void
 */
export const freezeAnyAttribute: AnyAttributeFreezer = ($anyAttribute, path) => {
  validateAttributeProperties($anyAttribute, path)

  return {
    path,
    type: $anyAttribute[$type],
    required: $anyAttribute[$required],
    hidden: $anyAttribute[$hidden],
    key: $anyAttribute[$key],
    savedAs: $anyAttribute[$savedAs],
    default: $anyAttribute[$default]
  }
}
