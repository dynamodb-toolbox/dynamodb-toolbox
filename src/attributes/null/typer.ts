import type { NarrowObject } from '~/types/narrowObject.js'

import type { SharedAttributeStateConstraint } from '../shared/interface.js'
import { $NullAttribute } from './interface.js'

type NullAttributeTyper = <STATE extends Omit<SharedAttributeStateConstraint, 'enum'> = {}>(
  state?: NarrowObject<STATE>
) => $NullAttribute<STATE>

/**
 * Define a new attribute of null type
 *
 * @param state _(optional)_ Attribute Options
 */
export const nul: NullAttributeTyper = <STATE extends SharedAttributeStateConstraint = {}>(
  state: NarrowObject<STATE> = {} as STATE
) => new $NullAttribute(state)
