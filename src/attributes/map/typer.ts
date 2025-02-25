import type { NarrowObject } from '~/types/narrowObject.js'

import type { SharedAttributeStateConstraint } from '../shared/interface.js'
import { $MapAttribute } from './interface.js'
import type { $MapAttributeAttributeStates } from './types.js'

type MapAttributeTyper = <
  ATTRIBUTES extends $MapAttributeAttributeStates,
  STATE extends SharedAttributeStateConstraint = {}
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
  ATTRIBUTES extends $MapAttributeAttributeStates,
  STATE extends SharedAttributeStateConstraint = {}
>(
  attributes: NarrowObject<ATTRIBUTES>,
  state: STATE = {} as STATE
): $MapAttribute<STATE, ATTRIBUTES> => new $MapAttribute(state, attributes)
