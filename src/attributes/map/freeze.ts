import { DynamoDBToolboxError } from '~/errors/index.js'

import type { RequiredOption } from '../constants/requiredOptions.js'
import type { FreezeAttribute } from '../freeze.js'
import type { SharedAttributeState } from '../shared/interface.js'
import { validateAttributeProperties } from '../shared/validate.js'
import type { Attribute } from '../types/attribute.js'
import type { MapAttribute, MapSchema } from './interface.js'
import { MapAttribute_ } from './interface.js'
import type { $MapAttributeAttributeStates } from './types.js'

export type FreezeMapAttribute<
  $MAP_ATTRIBUTE extends MapSchema,
  EXTENDED extends boolean = false
> = EXTENDED extends true
  ? MapAttribute_<
      $MAP_ATTRIBUTE['state'],
      {
        [KEY in keyof $MAP_ATTRIBUTE['attributes']]: FreezeAttribute<
          $MAP_ATTRIBUTE['attributes'][KEY],
          false
        >
      }
    >
  : MapAttribute<
      $MAP_ATTRIBUTE['state'],
      {
        [KEY in keyof $MAP_ATTRIBUTE['attributes']]: FreezeAttribute<
          $MAP_ATTRIBUTE['attributes'][KEY],
          false
        >
      }
    >

type MapAttributeFreezer = <
  STATE extends SharedAttributeState,
  $ATTRIBUTES extends $MapAttributeAttributeStates
>(
  state: STATE,
  attribute: $ATTRIBUTES,
  path?: string
) => FreezeMapAttribute<MapSchema<STATE, $ATTRIBUTES>, true>

/**
 * Freezes a warm `map` attribute
 *
 * @param attributes Attribute elements
 * @param state Attribute options
 * @param path Path of the instance in the related schema (string)
 * @return void
 */
export const freezeMapAttribute: MapAttributeFreezer = <
  STATE extends SharedAttributeState,
  $ATTRIBUTES extends $MapAttributeAttributeStates
>(
  state: STATE,
  attributes: $ATTRIBUTES,
  path?: string
) => {
  validateAttributeProperties(state, path)

  const attributesSavedAs = new Set<string>()

  const keyAttributeNames = new Set<string>()

  const requiredAttributeNames: Record<RequiredOption, Set<string>> = {
    always: new Set(),
    atLeastOnce: new Set(),
    never: new Set()
  }

  const frozenAttributes: Record<string, Attribute> = {}

  for (const [attributeName, attribute] of Object.entries(attributes)) {
    const {
      savedAs: attributeSavedAs = attributeName,
      key: attributeKey,
      required: attributeRequired = 'atLeastOnce'
    } = attribute.state
    if (attributesSavedAs.has(attributeSavedAs)) {
      throw new DynamoDBToolboxError('schema.mapAttribute.duplicateSavedAs', {
        message: `Invalid map attributes${
          path !== undefined ? ` at path '${path}'` : ''
        }: More than two attributes are saved as '${attributeSavedAs}'.`,
        path,
        payload: { savedAs: attributeSavedAs }
      })
    }
    attributesSavedAs.add(attributeSavedAs)

    if (attributeKey !== undefined && attributeKey) {
      keyAttributeNames.add(attributeName)
    }

    requiredAttributeNames[attributeRequired].add(attributeName)

    frozenAttributes[attributeName] = attribute.freeze([path, attributeName].join('.'))
  }

  return new MapAttribute_({
    path,
    attributes: frozenAttributes as {
      [KEY in keyof $ATTRIBUTES]: FreezeAttribute<$ATTRIBUTES[KEY], false>
    },
    ...state
  })
}
