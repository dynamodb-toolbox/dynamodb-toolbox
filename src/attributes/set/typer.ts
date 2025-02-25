import type { NarrowObject } from '~/types/narrowObject.js'

import type { SharedAttributeStateConstraint } from '../shared/interface.js'
import { $SetAttribute } from './interface.js'
import type { $SetAttributeElements } from './types.js'

type SetAttributeTyper = <
  $ELEMENTS extends $SetAttributeElements,
  STATE extends SharedAttributeStateConstraint = {}
>(
  elements: $ELEMENTS,
  state?: NarrowObject<STATE>
) => $SetAttribute<STATE, $ELEMENTS>

/**
 * Define a new set attribute
 * Note that set elements have constraints. They must be:
 * - Required (required: AtLeastOnce)
 * - Displayed (hidden: false)
 * - Not renamed (savedAs: undefined)
 * - Not defaulted (defaults: undefined)
 *
 * @param elements Attribute (With constraints)
 * @param state _(optional)_ List Options
 */
export const set: SetAttributeTyper = <
  ELEMENTS extends $SetAttributeElements,
  STATE extends SharedAttributeStateConstraint = {}
>(
  elements: ELEMENTS,
  state: NarrowObject<STATE> = {} as STATE
) => new $SetAttribute(state, elements)
