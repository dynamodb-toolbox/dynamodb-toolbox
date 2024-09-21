import type { BooleanAttribute } from './interface.js'
import type { BooleanAttributeState } from './types.js'

export type ResolveBooleanAttribute<ATTRIBUTE extends BooleanAttribute> = ATTRIBUTE extends {
  enum: NonNullable<BooleanAttributeState['enum']>
}
  ? ATTRIBUTE['enum'][number]
  : boolean

export type ResolvedBooleanAttribute = ResolveBooleanAttribute<BooleanAttribute>
