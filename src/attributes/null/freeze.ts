import { validatePrimitiveAttribute } from '../primitive/freeze.js'
import type { SharedAttributeState } from '../shared/interface.js'
import type { NullAttribute, NullSchema } from './interface.js'
import { NullAttribute_ } from './interface.js'

export type FreezeNullAttribute<
  $NULL_ATTRIBUTE extends NullSchema,
  EXTENDED extends boolean = false
> = EXTENDED extends true
  ? NullAttribute_<$NULL_ATTRIBUTE['state']>
  : NullAttribute<$NULL_ATTRIBUTE['state']>

type NullAttributeFreezer = <STATE extends SharedAttributeState>(
  state: STATE,
  path?: string
) => FreezeNullAttribute<NullSchema<STATE>, true>

/**
 * Freezes a warm `null` attribute
 *
 * @param state Attribute options
 * @param path Path of the instance in the related schema (string)
 * @return void
 */
export const freezeNullAttribute: NullAttributeFreezer = (state, path) => {
  validatePrimitiveAttribute({ type: 'null', state }, path)

  return new NullAttribute_({ path, ...state })
}
