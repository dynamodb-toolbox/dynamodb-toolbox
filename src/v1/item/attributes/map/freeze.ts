import type { O } from 'ts-toolbelt'

import { DynamoDBToolboxError } from 'v1/errors'

import type { RequiredOption } from '../constants/requiredOptions'
import { validateAttributeProperties } from '../shared/validate'
import { freezeAttribute, FreezeAttribute } from '../freeze'
import {
  $type,
  $attributes,
  $required,
  $hidden,
  $key,
  $savedAs,
  $default
} from '../constants/attributeOptions'
import type { MapAttributeAttributes } from '../types/attribute'

import type { $MapAttribute, MapAttribute } from './interface'

export type FreezeMapAttribute<$MAP_ATTRIBUTE extends $MapAttribute> =
  // Applying void O.Update improves type display
  O.Update<
    MapAttribute<
      $MapAttribute extends $MAP_ATTRIBUTE
        ? MapAttributeAttributes
        : {
            [KEY in keyof $MAP_ATTRIBUTE[$attributes]]: FreezeAttribute<
              $MAP_ATTRIBUTE[$attributes][KEY]
            >
          },
      {
        required: $MAP_ATTRIBUTE[$required]
        hidden: $MAP_ATTRIBUTE[$hidden]
        key: $MAP_ATTRIBUTE[$key]
        savedAs: $MAP_ATTRIBUTE[$savedAs]
        default: $MAP_ATTRIBUTE[$default]
      }
    >,
    never,
    never
  >

type MapAttributeFreezer = <$MAP_ATTRIBUTE extends $MapAttribute>(
  $mapAttribute: $MAP_ATTRIBUTE,
  path: string
) => FreezeMapAttribute<$MAP_ATTRIBUTE>

/**
 * Freezes a map instance
 *
 * @param $mapAttribute MapAttribute
 * @param path Path of the instance in the related item (string)
 * @return void
 */
export const freezeMapAttribute: MapAttributeFreezer = <$MAP_ATTRIBUTE extends $MapAttribute>(
  $mapAttribute: $MAP_ATTRIBUTE,
  path: string
) => {
  validateAttributeProperties($mapAttribute, path)

  const attributesSavedAs = new Set<string>()

  const keyAttributesNames = new Set<string>()

  const requiredAttributesNames: Record<RequiredOption, Set<string>> = {
    always: new Set(),
    atLeastOnce: new Set(),
    onlyOnce: new Set(),
    never: new Set()
  }

  const attributes: $MAP_ATTRIBUTE[$attributes] = $mapAttribute[$attributes]
  const frozenAttributes: {
    [KEY in keyof $MAP_ATTRIBUTE[$attributes]]: FreezeAttribute<$MAP_ATTRIBUTE[$attributes][KEY]>
  } = {} as any

  for (const attributeName in attributes) {
    const attribute = attributes[attributeName]

    const attributeSavedAs = attribute[$savedAs] ?? attributeName
    if (attributesSavedAs.has(attributeSavedAs)) {
      throw new DynamoDBToolboxError('item.mapAttribute.duplicateSavedAs', {
        message: `Invalid map attributes at path ${path}: More than two attributes are saved as '${attributeSavedAs}'`,
        path,
        payload: { savedAs: attributeSavedAs }
      })
    }
    attributesSavedAs.add(attributeSavedAs)

    if (attribute[$key]) {
      keyAttributesNames.add(attributeName)
    }

    requiredAttributesNames[attribute[$required]].add(attributeName)

    frozenAttributes[attributeName] = freezeAttribute(attribute, [path, attributeName].join('.'))
  }

  return {
    path,
    type: $mapAttribute[$type],
    attributes: frozenAttributes,
    keyAttributesNames,
    requiredAttributesNames,
    required: $mapAttribute[$required],
    hidden: $mapAttribute[$hidden],
    key: $mapAttribute[$key],
    savedAs: $mapAttribute[$savedAs],
    default: $mapAttribute[$default]
  }
}
