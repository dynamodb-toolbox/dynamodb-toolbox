import type { NarrowObject } from '~/types/narrowObject.js'

import { $BinaryAttribute } from './interface.js'
import type { BinaryAttributeStateConstraint } from './types.js'

type BinaryAttributeTyper = <STATE extends Omit<BinaryAttributeStateConstraint, 'enum'> = {}>(
  state?: NarrowObject<STATE>
) => $BinaryAttribute<STATE>

/**
 * Define a new attribute of binary type
 *
 * @param state _(optional)_ Attribute Options
 */
export const binary: BinaryAttributeTyper = <
  STATE extends Omit<BinaryAttributeStateConstraint, 'enum'> = {}
>(
  state: NarrowObject<STATE> = {} as STATE
) => new $BinaryAttribute(state)
