import type { NarrowObject } from '~/types/narrowObject.js'

import { $StringAttribute } from './interface.js'
import type { StringAttributeState } from './types.js'

type StringAttributeTyper = <OPTIONS extends Omit<StringAttributeState, 'enum'> = {}>(
  options?: NarrowObject<OPTIONS>
) => $StringAttribute<OPTIONS>

/**
 * Define a new attribute of string type
 *
 * @param options _(optional)_ Attribute Options
 */
export const string: StringAttributeTyper = <
  OPTIONS extends Omit<StringAttributeState, 'enum'> = {}
>(
  options: NarrowObject<OPTIONS> = {} as OPTIONS
) => new $StringAttribute(options)
