import type { Update } from '~/types/update.js'

import type { $state } from '../constants/attributeOptions.js'
import { validatePrimitiveAttribute } from '../primitive/freeze.js'
import type { $StringAttributeState } from './interface.js'
import { StringAttribute } from './interface.js'
import type { StringAttributeState } from './types.js'

export type FreezeStringAttribute<$STRING_ATTRIBUTE extends $StringAttributeState> =
  // Applying void Update improves type display
  Update<StringAttribute<$STRING_ATTRIBUTE[$state]>, never, never>

type StringAttributeFreezer = <STATE extends StringAttributeState>(
  state: STATE,
  path?: string
) => FreezeStringAttribute<$StringAttributeState<STATE>>

/**
 * Freezes a warm `string` attribute
 *
 * @param state Attribute options
 * @param path Path of the instance in the related schema (string)
 * @return void
 */
export const freezeStringAttribute: StringAttributeFreezer = <STATE extends StringAttributeState>(
  state: STATE,
  path?: string
): FreezeStringAttribute<$StringAttributeState<STATE>> => {
  validatePrimitiveAttribute({ type: 'string', ...state }, path)

  return new StringAttribute({ path, ...state })
}
