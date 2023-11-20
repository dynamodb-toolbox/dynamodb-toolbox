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
  $defaults
} from '../constants/attributeOptions'

import type { $MapAttributeState, MapAttribute } from './interface'

export type FreezeMapAttribute<$MAP_ATTRIBUTE extends $MapAttributeState> =
  // Applying void O.Update improves type display
  O.Update<
    MapAttribute<
      {
        [KEY in keyof $MAP_ATTRIBUTE[$attributes]]: FreezeAttribute<
          $MAP_ATTRIBUTE[$attributes][KEY]
        >
      },
      {
        required: $MAP_ATTRIBUTE[$required]
        hidden: $MAP_ATTRIBUTE[$hidden]
        key: $MAP_ATTRIBUTE[$key]
        savedAs: $MAP_ATTRIBUTE[$savedAs]
        defaults: $MAP_ATTRIBUTE[$defaults]
      }
    >,
    never,
    never
  >

type MapAttributeFreezer = <$MAP_ATTRIBUTE extends $MapAttributeState>(
  $mapAttribute: $MAP_ATTRIBUTE,
  path: string
) => FreezeMapAttribute<$MAP_ATTRIBUTE>

/**
 * Freezes a map instance
 *
 * @param $mapAttribute MapAttribute
 * @param path Path of the instance in the related schema (string)
 * @return void
 */
export const freezeMapAttribute: MapAttributeFreezer = <$MAP_ATTRIBUTE extends $MapAttributeState>(
  $mapAttribute: $MAP_ATTRIBUTE,
  path: string
): FreezeMapAttribute<$MAP_ATTRIBUTE> => {
  validateAttributeProperties($mapAttribute, path)

  const attributesSavedAs = new Set<string>()

  const keyAttributeNames = new Set<string>()

  const requiredAttributeNames: Record<RequiredOption, Set<string>> = {
    always: new Set(),
    atLeastOnce: new Set(),
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
      throw new DynamoDBToolboxError('schema.mapAttribute.duplicateSavedAs', {
        message: `Invalid map attributes at path ${path}: More than two attributes are saved as '${attributeSavedAs}'`,
        path,
        payload: { savedAs: attributeSavedAs }
      })
    }
    attributesSavedAs.add(attributeSavedAs)

    if (attribute[$key]) {
      keyAttributeNames.add(attributeName)
    }

    requiredAttributeNames[attribute[$required]].add(attributeName)

    frozenAttributes[attributeName] = freezeAttribute(attribute, [path, attributeName].join('.'))
  }

  return {
    path,
    type: $mapAttribute[$type],
    attributes: frozenAttributes,
    keyAttributeNames,
    requiredAttributeNames,
    required: $mapAttribute[$required],
    hidden: $mapAttribute[$hidden],
    key: $mapAttribute[$key],
    savedAs: $mapAttribute[$savedAs],
    defaults: $mapAttribute[$defaults]
  }
}
