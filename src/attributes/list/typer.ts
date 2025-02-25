import type { NarrowObject } from '~/types/narrowObject.js'

import type { SharedAttributeStateConstraint } from '../shared/interface.js'
import { $ListAttribute } from './interface.js'
import type { $ListAttributeElements } from './types.js'

type ListAttributeTyper = <
  $ELEMENTS extends $ListAttributeElements,
  STATE extends SharedAttributeStateConstraint = {}
>(
  elements: $ELEMENTS,
  state?: NarrowObject<STATE>
) => $ListAttribute<STATE, $ELEMENTS>

/**
 * Define a new list attribute
 * Note that list elements have constraints. They must be:
 * - Required (required: AtLeastOnce)
 * - Displayed (hidden: false)
 * - Not renamed (savedAs: undefined)
 * - Not defaulted (defaults: undefined)
 *
 * @param elements Attribute (With constraints)
 * @param state _(optional)_ List Options
 */
export const list: ListAttributeTyper = <
  $ELEMENTS extends $ListAttributeElements,
  STATE extends SharedAttributeStateConstraint = {}
>(
  elements: $ELEMENTS,
  state: NarrowObject<STATE> = {} as STATE
): $ListAttribute<STATE, $ELEMENTS> => new $ListAttribute(state, elements)
