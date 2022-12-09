import { validateAttributeProperties } from '../shared/validate'

import type { _AnyAttribute, FreezeAnyAttribute } from './interface'

type AnyAttributeFreezer = <Attribute extends _AnyAttribute>(
  attribute: Attribute,
  path: string
) => FreezeAnyAttribute<Attribute>

/**
 * Validates an any instance
 *
 * @param attribute Any
 * @param path _(optional)_ Path of the instance in the related item (string)
 * @return void
 */
export const freezeAnyAttribute: AnyAttributeFreezer = <Attribute extends _AnyAttribute>(
  attribute: Attribute,
  path: string
): FreezeAnyAttribute<Attribute> => {
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
