import type { NarrowObject } from '~/types/narrowObject.js'

import { $BooleanAttribute } from './interface.js'
import type { BooleanAttributeState } from './types.js'

type BooleanAttributeTyper = <STATE extends BooleanAttributeState = {}>(
  state?: NarrowObject<STATE>
) => $BooleanAttribute<STATE>

/**
 * Define a new attribute of boolean type
 *
 * @param state _(optional)_ Attribute Options
 */
export const boolean: BooleanAttributeTyper = <STATE extends BooleanAttributeState = {}>(
  state: NarrowObject<STATE> = {} as STATE
) => new $BooleanAttribute(state)
