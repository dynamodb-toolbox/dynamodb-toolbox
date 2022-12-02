import { validateAttributeProperties } from '../shared/validate'

import type { _AnyAttribute, FreezeAnyAttribute } from './interface'

type AnyAttributeFreezer = <_ANY_ATTRIBUTE extends _AnyAttribute>(
  attribute: _ANY_ATTRIBUTE,
  path: string
) => FreezeAnyAttribute<_ANY_ATTRIBUTE>

/**
 * Validates an any instance
 *
 * @param attribute Any
 * @param path _(optional)_ Path of the instance in the related item (string)
 * @return void
 */
export const freezeAnyAttribute: AnyAttributeFreezer = <_ANY_ATTRIBUTE extends _AnyAttribute>(
  attribute: _ANY_ATTRIBUTE,
  path: string
): FreezeAnyAttribute<_ANY_ATTRIBUTE> => {
  validateAttributeProperties(attribute, path)

  // TODO: validate that _default is valid ?

  const {
    _type: type,
    _required: required,
    _hidden: hidden,
    _key: key,
    _savedAs: savedAs,
    _default
  } = attribute

  return {
    type,
    path,
    required,
    hidden,
    key,
    savedAs,
    default: _default
  }
}
