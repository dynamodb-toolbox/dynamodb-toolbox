import type { O } from 'ts-toolbelt'

import { DynamoDBToolboxError } from '~/errors/index.js'

import { $state } from '../constants/attributeOptions.js'
import type { $attributes } from '../constants/attributeOptions.js'
import type { RequiredOption } from '../constants/requiredOptions.js'
import type { FreezeAttribute } from '../freeze.js'
import type { SharedAttributeState } from '../shared/interface.js'
import { validateAttributeProperties } from '../shared/validate.js'
import { MapAttribute } from './interface.js'
import type { $MapAttributeState } from './interface.js'
import type { $MapAttributeAttributeStates } from './types.js'

export type FreezeMapAttribute<$MAP_ATTRIBUTE extends $MapAttributeState> =
  // Applying void O.Update improves type display
  O.Update<
    MapAttribute<
      $MAP_ATTRIBUTE[$state],
      {
        [KEY in keyof $MAP_ATTRIBUTE[$attributes]]: FreezeAttribute<
          $MAP_ATTRIBUTE[$attributes][KEY]
        >
      }
    >,
    never,
    never
  >

type MapAttributeFreezer = <
  STATE extends SharedAttributeState,
  $ATTRIBUTES extends $MapAttributeAttributeStates
>(
  state: STATE,
  attribute: $ATTRIBUTES,
  path?: string
) => FreezeMapAttribute<$MapAttributeState<STATE, $ATTRIBUTES>>

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
): FreezeMapAttribute<$MapAttributeState<STATE, $ATTRIBUTES>> => {
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

    const {
      savedAs: attributeSavedAs = attributeName,
      key: attributeKey,
      required: attributeRequired
    } = attribute[$state]
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

    if (attributeKey) {
      keyAttributeNames.add(attributeName)
    }

    requiredAttributeNames[attributeRequired].add(attributeName)

    frozenAttributes[attributeName] = attribute.freeze(
      [path, attributeName].join('.')
    ) as FreezeAttribute<$ATTRIBUTES[Extract<keyof $ATTRIBUTES, string>]>
  }

  return new MapAttribute({
    path,
    attributes: frozenAttributes,
    ...state
  })
}
