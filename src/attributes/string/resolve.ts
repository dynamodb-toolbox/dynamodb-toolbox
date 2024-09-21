import type { StringAttribute } from './interface.js'
import type { StringAttributeState } from './types.js'

export type ResolveStringAttribute<ATTRIBUTE extends StringAttribute> = ATTRIBUTE extends {
  enum: NonNullable<StringAttributeState['enum']>
}
  ? ATTRIBUTE['enum'][number]
  : string

export type ResolvedStringAttribute = ResolveStringAttribute<StringAttribute>
