import type { RequiredOption } from '../constants/requiredOptions'
import { validateAttributeProperties } from '../shared/validate'
import { freezeAttribute, FreezeAttribute } from '../freeze'

import type { _MapAttribute, FreezeMapAttribute } from './interface'

type MapAttributeFreezer = <_MAP_ATTRIBUTE extends _MapAttribute>(
  attribute: _MAP_ATTRIBUTE,
  path: string
) => FreezeMapAttribute<_MAP_ATTRIBUTE>

/**
 * Freezes a map instance
 *
 * @param attribute MapAttribute
 * @param path _(optional)_ Path of the instance in the related item (string)
 * @return void
 */
export const freezeMapAttribute: MapAttributeFreezer = <_MAP_ATTRIBUTE extends _MapAttribute>(
  attribute: _MAP_ATTRIBUTE,
  path: string
): FreezeMapAttribute<_MAP_ATTRIBUTE> => {
  validateAttributeProperties(attribute, path)

  const {
    _type: type,
    _required: required,
    _hidden: hidden,
    _key: key,
    _open: open,
    _savedAs: savedAs,
    _default
  } = attribute

  const attributesSavedAs = new Set<string>()

  const keyAttributesNames = new Set<string>()

  const requiredAttributesNames: Record<RequiredOption, Set<string>> = {
    always: new Set(),
    atLeastOnce: new Set(),
    onlyOnce: new Set(),
    never: new Set()
  }

  const attributes: _MAP_ATTRIBUTE['_attributes'] = attribute._attributes
  const frozenAttributes: {
    [key in keyof _MAP_ATTRIBUTE['_attributes']]: FreezeAttribute<
      _MAP_ATTRIBUTE['_attributes'][key]
    >
  } = {} as any

  for (const attributeName in attributes) {
    const attribute = attributes[attributeName]

    const attributeSavedAs = attribute._savedAs ?? attributeName
    if (attributesSavedAs.has(attributeSavedAs)) {
      throw new DuplicateSavedAsAttributesError({ duplicatedSavedAs: attributeSavedAs, path })
    }
    attributesSavedAs.add(attributeSavedAs)

    if (attribute._key) {
      keyAttributesNames.add(attributeName)
    }

    requiredAttributesNames[attribute._required].add(attributeName)

    frozenAttributes[attributeName] = freezeAttribute(attribute, [path, attributeName].join('.'))
  }

  return {
    type,
    path,
    attributes: frozenAttributes,
    keyAttributesNames,
    requiredAttributesNames,
    required,
    hidden,
    key,
    open,
    savedAs,
    default: _default
  }
}

export class DuplicateSavedAsAttributesError extends Error {
  constructor({ duplicatedSavedAs, path }: { duplicatedSavedAs: string; path: string }) {
    super(
      `Invalid map attributes at path ${path}: More than two attributes are saved as '${duplicatedSavedAs}'`
    )
  }
}
