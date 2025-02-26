import type { NarrowObject } from '~/types/narrowObject.js'

import type { SharedAttributeState } from '../shared/interface.js'
import { $MapAttribute } from './interface.js'
import type { MapAttributesSchemas } from './types.js'

type MapAttributeTyper = <
  ATTRIBUTES extends MapAttributesSchemas,
  STATE extends SharedAttributeState = {}
>(
  attributes: NarrowObject<ATTRIBUTES>,
  state?: NarrowObject<STATE>
) => $MapAttribute<STATE, ATTRIBUTES>

/**
 * Define a new map attribute
 *
 * @param attributes Dictionary of attributes
 * @param state _(optional)_ Map Options
 */
export const map: MapAttributeTyper = <
  ATTRIBUTES extends MapAttributesSchemas,
  STATE extends SharedAttributeState = {}
>(
  attributes: NarrowObject<ATTRIBUTES>,
  state: STATE = {} as STATE
): $MapAttribute<STATE, ATTRIBUTES> => new $MapAttribute(state, attributes)
