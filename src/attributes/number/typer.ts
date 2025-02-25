import type { NarrowObject } from '~/types/narrowObject.js'

import { $NumberAttribute } from './interface.js'
import type { NumberAttributeState } from './types.js'

type NumberAttributeTyper = <STATE extends Omit<NumberAttributeState, 'enum'> = {}>(
  state?: NarrowObject<STATE>
) => $NumberAttribute<STATE>

/**
 * Define a new attribute of number type
 *
 * @param state _(optional)_ Attribute Options
 */
export const number: NumberAttributeTyper = <STATE extends Omit<NumberAttributeState, 'enum'> = {}>(
  state: NarrowObject<STATE> = {} as STATE
) => new $NumberAttribute(state)
