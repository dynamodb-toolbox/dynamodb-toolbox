import type { NarrowObject } from '~/types/narrowObject.js'

import type { SharedAttributeState } from '../shared/interface.js'
import { $NullAttribute } from './interface.js'

type NullAttributeTyper = <STATE extends Omit<SharedAttributeState, 'enum'> = {}>(
  state?: NarrowObject<STATE>
) => $NullAttribute<STATE>

/**
 * Define a new attribute of null type
 *
 * @param state _(optional)_ Attribute Options
 */
export const nul: NullAttributeTyper = <STATE extends SharedAttributeState = {}>(
  state: NarrowObject<STATE> = {} as STATE
) => new $NullAttribute(state)
