import { validateAttributeProperties } from '../shared/validate'
import { $type, $required, $hidden, $key, $savedAs, $default } from '../constants/symbols'

import type { _AnyAttribute, FreezeAnyAttribute } from './interface'

type AnyAttributeFreezer = <_ANY_ATTRIBUTE extends _AnyAttribute>(
  _anyAttribute: _ANY_ATTRIBUTE,
  path: string
) => FreezeAnyAttribute<_ANY_ATTRIBUTE>

/**
 * Validates an any instance
 *
 * @param _anyAttribute Any
 * @param path _(optional)_ Path of the instance in the related item (string)
 * @return void
 */
export const freezeAnyAttribute: AnyAttributeFreezer = <_ANY_ATTRIBUTE extends _AnyAttribute>(
  _anyAttribute: _ANY_ATTRIBUTE,
  path: string
): FreezeAnyAttribute<_ANY_ATTRIBUTE> => {
  validateAttributeProperties(_anyAttribute, path)

  return {
    path,
    type: _anyAttribute[$type],
    required: _anyAttribute[$required],
    hidden: _anyAttribute[$hidden],
    key: _anyAttribute[$key],
    savedAs: _anyAttribute[$savedAs],
    // TODO: validate that default is valid ?
    default: _anyAttribute[$default]
  }
}
