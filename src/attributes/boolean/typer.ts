import type { NarrowObject } from '~/types/narrowObject.js'

import { $BooleanAttribute } from './interface.js'
import type { BooleanAttributeStateConstraint } from './types.js'

type BooleanAttributeTyper = <STATE extends BooleanAttributeStateConstraint = {}>(
  state?: NarrowObject<STATE>
) => $BooleanAttribute<STATE>

/**
 * Define a new attribute of boolean type
 *
 * @param state _(optional)_ Attribute Options
 */
export const boolean: BooleanAttributeTyper = <STATE extends BooleanAttributeStateConstraint = {}>(
  state: NarrowObject<STATE> = {} as STATE
) => new $BooleanAttribute(state)
