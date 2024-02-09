import type { ComputeObject } from 'v1/types'
import { DynamoDBToolboxError } from 'v1/errors'

import type { RequiredOption } from '../constants/requiredOptions'
import type { FreezeAttribute } from '../types'
import { validateAttributeProperties } from '../shared/validate'
import {
  $attributes,
  $required,
  $hidden,
  $key,
  $savedAs,
  $defaults,
  $links
} from '../constants/attributeOptions'

import type { SharedAttributeState } from '../shared/interface'
import type { $MapAttributeState, MegaMapAttribute } from './interface'
import type { $MapAttributeAttributeStates } from './types'

export type FreezeMapAttribute<$MAP_ATTRIBUTE extends $MapAttributeState> = ComputeObject<
  MegaMapAttribute<
    {
      [KEY in keyof $MAP_ATTRIBUTE[$attributes]]: FreezeAttribute<$MAP_ATTRIBUTE[$attributes][KEY]>
    },
    {
      required: $MAP_ATTRIBUTE[$required]
      hidden: $MAP_ATTRIBUTE[$hidden]
      key: $MAP_ATTRIBUTE[$key]
      savedAs: $MAP_ATTRIBUTE[$savedAs]
      defaults: $MAP_ATTRIBUTE[$defaults]
      links: $MAP_ATTRIBUTE[$links]
    }
  >
>

type MapAttributeFreezer = <
  $ATTRIBUTES extends $MapAttributeAttributeStates,
  STATE extends SharedAttributeState
>(
  attribute: $ATTRIBUTES,
  state: STATE,
  path: string
) => FreezeMapAttribute<$MapAttributeState<$ATTRIBUTES, STATE>>

/**
 * Freezes a warm `map` attribute
 *
 * @param attributes Attribute elements
 * @param state Attribute options
 * @param path Path of the instance in the related schema (string)
 * @return void
 */
export const freezeMapAttribute: MapAttributeFreezer = <
  $ATTRIBUTES extends $MapAttributeAttributeStates,
  STATE extends SharedAttributeState
>(
  attributes: $ATTRIBUTES,
  state: STATE,
  path: string
): FreezeMapAttribute<$MapAttributeState<$ATTRIBUTES, STATE>> => {
  validateAttributeProperties(state, path)

  const attributesSavedAs = new Set<string>()

  const keyAttributeNames = new Set<string>()

  const requiredAttributeNames: Record<RequiredOption, Set<string>> = {
    always: new Set(),
    atLeastOnce: new Set(),
    never: new Set()
  }

  const frozenAttributes: {
    [KEY in keyof $ATTRIBUTES]: FreezeAttribute<$ATTRIBUTES[KEY]>
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

    frozenAttributes[attributeName] = attribute.freeze(
      [path, attributeName].join('.')
    ) as FreezeAttribute<$ATTRIBUTES[Extract<keyof $ATTRIBUTES, string>]>
  }

  return {
    path,
    type: 'map',
    attributes: frozenAttributes,
    keyAttributeNames,
    requiredAttributeNames,
    // TODO
    parse: input => input as any,
    ...state
  }
}
