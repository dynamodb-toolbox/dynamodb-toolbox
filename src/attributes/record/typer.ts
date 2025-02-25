import type { NarrowObject } from '~/types/narrowObject.js'

import type { SharedAttributeStateConstraint } from '../shared/interface.js'
import { $RecordAttribute } from './interface.js'
import type { $RecordAttributeElements, $RecordAttributeKeys } from './types.js'

type RecordAttributeTyper = <
  $KEYS extends $RecordAttributeKeys,
  $ELEMENTS extends $RecordAttributeElements,
  STATE extends SharedAttributeStateConstraint = {}
>(
  keys: $KEYS,
  elements: $ELEMENTS,
  state?: NarrowObject<STATE>
) => $RecordAttribute<STATE, $KEYS, $ELEMENTS>

/**
 * Define a new record attribute
 * Note that record keys and elements have constraints. They must be:
 * - Required (required: AtLeastOnce)
 * - Displayed (hidden: false)
 * - Not key (key: false)
 * - Not renamed (savedAs: undefined)
 * - Not defaulted (defaults: undefined)
 *
 * @param keys Keys (With constraints)
 * @param elements Attribute (With constraints)
 * @param state _(optional)_ Record Options
 */
export const record: RecordAttributeTyper = <
  $KEYS extends $RecordAttributeKeys,
  $ELEMENTS extends $RecordAttributeElements,
  STATE extends SharedAttributeStateConstraint = {}
>(
  keys: $KEYS,
  elements: $ELEMENTS,
  state: NarrowObject<STATE> = {} as STATE
) => new $RecordAttribute(state, keys, elements)
