import type { Update } from '~/types/update.js'

import type { $state } from '../constants/attributeOptions.js'
import { validatePrimitiveAttribute } from '../primitive/freeze.js'
import type { $NumberAttributeState } from './interface.js'
import type { NumberAttribute } from './interface.js'
import { NumberAttribute_ } from './interface.js'
import type { NumberAttributeState } from './types.js'

export type FreezeNumberAttribute<
  $NUMBER_ATTRIBUTE extends $NumberAttributeState,
  EXTENDED extends boolean = false
> =
  // Applying void Update improves type display
  Update<
    EXTENDED extends true
      ? NumberAttribute_<$NUMBER_ATTRIBUTE[$state]>
      : NumberAttribute<$NUMBER_ATTRIBUTE[$state]>,
    never,
    never
  >

type NumberAttributeFreezer = <STATE extends NumberAttributeState>(
  state: STATE,
  path?: string
) => FreezeNumberAttribute<$NumberAttributeState<STATE>, true>

/**
 * Freezes a warm `number` attribute
 *
 * @param state Attribute options
 * @param path Path of the instance in the related schema (string)
 * @return void
 */
export const freezeNumberAttribute: NumberAttributeFreezer = (state, path) => {
  validatePrimitiveAttribute({ type: 'number', ...state }, path)

  return new NumberAttribute_({ path, ...state })
}
