import type { NullAttribute } from './interface.js'
import type { NullAttributeState } from './types.js'

export type ResolveNullAttribute<ATTRIBUTE extends NullAttribute> = ATTRIBUTE extends {
  enum: NonNullable<NullAttributeState['enum']>
}
  ? ATTRIBUTE['enum'][number]
  : null

export type ResolvedNullAttribute = ResolveNullAttribute<NullAttribute>
