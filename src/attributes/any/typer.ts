import type { NarrowObject } from '~/types/narrowObject.js'

import { $AnyAttribute } from './interface.js'
import type { AnyAttributeStateConstraint } from './types.js'

type AnyAttributeTyper = <STATE extends Omit<AnyAttributeStateConstraint, 'castAs'> = {}>(
  state?: NarrowObject<STATE>
) => $AnyAttribute<STATE>

/**
 * Define a new attribute of any type
 *
 * @param state _(optional)_ Attribute Options
 */
export const any: AnyAttributeTyper = <
  STATE extends Omit<AnyAttributeStateConstraint, 'castAs'> = {}
>(
  state: NarrowObject<STATE> = {} as STATE
) => new $AnyAttribute<STATE>(state)
